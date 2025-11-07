// ============================================================================
// 📄 Archivo: /api/proxyEmail.js
// ----------------------------------------------------------------------------
// ✅ Proxy dedicado para enviar respuestas de correo a Google Apps Script
//    desde producción (Vercel) sin usar servidores locales.
// ----------------------------------------------------------------------------
// 🔧 Funciona 24/7 en Vercel Functions, con:
// - Validación del método
// - Timeout automático (10s)
// - Manejo de errores con detalle
// ============================================================================

export default async function handler(req, res) {
  // 🔸 Solo permitimos POST por seguridad
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido. Usa POST para enviar correos.",
    });
  }

  try {
    // 🧩 Validar cuerpo
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "El cuerpo de la petición está vacío o mal formado.",
      });
    }

    // 🌐 URL del Apps Script que maneja el envío de correos
    // ⚠️ Debe estar publicado como Web App con acceso “Cualquiera, incluso anónimo”
    const GOOGLE_APPS_SCRIPT_EMAIL =
      "https://script.google.com/macros/s/AKfycbyd4vUO_ErNp0NLxxwV3_ebx0vzFrVhRI9uBUG2OLh5RzGv26K0A9LdQ-z3v2ZN6gKv/exec";

    // ⏱ Controlador para timeout (10 segundos)
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    // 🚀 Enviar los datos al Apps Script
    const response = await fetch(GOOGLE_APPS_SCRIPT_EMAIL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    // 🧹 Limpiar el timeout al finalizar
    clearTimeout(timeout);

    // ❌ Si el Apps Script devuelve error HTTP
    if (!response.ok) {
      return res.status(response.status).json({
        error: "Error desde Google Apps Script",
        status: response.status,
        statusText: response.statusText,
      });
    }

    // 🔍 Intentar parsear la respuesta JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return res.status(500).json({
        error: "No se pudo parsear la respuesta del Apps Script",
        details: parseError.message,
      });
    }

    // ✅ Éxito
    return res.status(200).json({
      success: true,
      data,
    });
  } catch (error) {
    // 🕒 Timeout
    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "Timeout. El Apps Script tardó demasiado en responder.",
      });
    }

    // ⚠️ Error general
    return res.status(500).json({
      error: "Error inesperado al enviar correo mediante proxyEmail",
      details: error.message,
    });
  }
}
