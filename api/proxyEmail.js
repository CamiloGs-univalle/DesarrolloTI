// ============================================================================
// 📄 Archivo: /api/proxyEmail.js (CORREGIDO)
// ============================================================================

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({
      error: "Método no permitido. Usa POST para enviar correos.",
    });
  }

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({
        error: "El cuerpo de la petición está vacío o mal formado.",
      });
    }

    const GOOGLE_APPS_SCRIPT_EMAIL =
      "https://script.google.com/macros/s/AKfycbyd4vUO_ErNp0NLxxwV3_ebx0vzFrVhRI9uBUG2OLh5RzGv26K0A9LdQ-z3v2ZN6gKv/exec";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 15000);

    console.log("📤 Enviando a Apps Script:", JSON.stringify(req.body, null, 2));

    const response = await fetch(GOOGLE_APPS_SCRIPT_EMAIL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // 🔥 CRÍTICO: Apps Script puede responder con 200 incluso en error
    const responseText = await response.text();
    console.log("📥 Respuesta cruda de Apps Script:", responseText);

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      console.error("❌ No se pudo parsear JSON:", responseText);
      return res.status(500).json({
        success: false,
        error: "Respuesta inválida del servidor de correo",
        rawResponse: responseText.substring(0, 500)
      });
    }

    // ✅ Verificar si el Apps Script reportó éxito interno
    if (data && data.success === false) {
      return res.status(400).json({
        success: false,
        error: data.error || "Error del servidor de correo",
        details: data.details
      });
    }

    // ✅ Éxito
    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    console.error("🔥 Error en proxyEmail:", error);
    
    if (error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        error: "Timeout. El servidor de correo tardó demasiado en responder.",
      });
    }

    return res.status(500).json({
      success: false,
      error: "Error de conexión con el servidor de correo",
      details: error.message,
    });
  }
}