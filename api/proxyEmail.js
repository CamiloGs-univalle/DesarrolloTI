// ============================================================================
// 📄 ARCHIVO: /api/proxyEmail.js
// 🎯 PROPÓSITO: Proxy seguro para enviar correos mediante Google Apps Script
// 🔒 SEGURIDAD: Valida métodos, timeout automático, manejo de errores
// ============================================================================

/**
 * 🔄 Handler principal para el endpoint del proxy de correo
 * @param {Object} req - Objeto de petición de Next.js
 * @param {Object} res - Objeto de respuesta de Next.js
 */
export default async function handler(req, res) {
  // ==========================================================================
  // 🔐 1. VALIDACIÓN DE MÉTODO HTTP - Solo permitir POST por seguridad
  // ==========================================================================
  if (req.method !== "POST") {
    console.warn("⚠️ Intento de acceso con método no permitido:", req.method);
    return res.status(405).json({
      success: false,
      error: "Método no permitido. Usa POST para enviar correos.",
    });
  }

  // ==========================================================================
  // 🧪 2. VALIDACIÓN DEL CUERPO DE LA PETICIÓN
  // ==========================================================================
  try {
    // Verificar que el cuerpo no esté vacío o mal formado
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn("⚠️ Petición con cuerpo vacío recibida");
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición está vacío o mal formado.",
      });
    }

    // ========================================================================
    // 🌐 3. CONFIGURACIÓN URL GOOGLE APPS SCRIPT
    // ========================================================================
    // ⚠️ IMPORTANTE: El Apps Script debe estar publicado como Web App
    // con acceso: "Ejecutar como: Yo" y "Acceso: Cualquiera, incluso anónimo"
    const GOOGLE_APPS_SCRIPT_EMAIL =
      "https://script.google.com/macros/s/AKfycbyd4vUO_ErNp0NLxxwV3_ebx0vzFrVhRI9uBUG2OLh5RzGv26K0A9LdQ-z3v2ZN6gKv/exec";

    // ========================================================================
    // ⏱ 4. CONFIGURACIÓN DE TIMEOUT (15 segundos)
    // ========================================================================
    const controller = new AbortController();
    const timeout = setTimeout(() => {
      console.warn("⏰ Timeout alcanzado - Abortando petición a Apps Script");
      controller.abort();
    }, 15000);

    // ========================================================================
    // 📤 5. ENVÍO DE DATOS AL GOOGLE APPS SCRIPT
    // ========================================================================
    console.log("📤 Enviando datos a Apps Script:", {
      asunto: req.body.asunto,
      correoDestino: req.body.correoDestino,
      tipoSolicitud: req.body.tipoSolicitud
    });

    const response = await fetch(GOOGLE_APPS_SCRIPT_EMAIL, {
      method: "POST",
      headers: { 
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(req.body),
      signal: controller.signal, // Vincular el controlador de aborto
    });

    // 🧹 Limpiar el timeout ya que la petición completó
    clearTimeout(timeout);

    // ========================================================================
    // 📥 6. PROCESAMIENTO DE LA RESPUESTA DEL APPS SCRIPT
    // ========================================================================
    
    // 🔍 Leer la respuesta como texto primero para debugging
    const responseText = await response.text();
    console.log("📥 Respuesta cruda de Apps Script:", responseText);

    let data;
    try {
      // Intentar parsear la respuesta como JSON
      data = JSON.parse(responseText);
      console.log("✅ Respuesta parseada correctamente:", data);
    } catch (parseError) {
      // ❌ Si no se puede parsear JSON, hay un problema con el Apps Script
      console.error("❌ Error parseando JSON del Apps Script:", {
        error: parseError.message,
        response: responseText.substring(0, 200) // Log parcial para debugging
      });
      
      return res.status(500).json({
        success: false,
        error: "Respuesta inválida del servidor de correo",
        details: "El servidor respondió con un formato no JSON",
        rawResponse: responseText.substring(0, 500)
      });
    }

    // ========================================================================
    // ✅ 7. VERIFICACIÓN DE ÉXITO INTERNO DEL APPS SCRIPT
    // ========================================================================
    // Nota: Apps Script siempre responde con HTTP 200, pero puede tener error interno
    if (data && data.success === false) {
      console.error("❌ Apps Script reportó error interno:", data.error);
      return res.status(400).json({
        success: false,
        error: data.error || "Error del servidor de correo",
        details: data.details || "Sin detalles adicionales"
      });
    }

    // ========================================================================
    // 🎉 8. RESPUESTA DE ÉXITO
    // ========================================================================
    console.log("✅ Correo enviado exitosamente a:", req.body.correoDestino);
    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    // ========================================================================
    // 🚨 9. MANEJO CENTRALIZADO DE ERRORES
    // ========================================================================
    console.error("🔥 Error en proxyEmail:", error);

    // 🕒 Caso específico: Timeout
    if (error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        error: "Timeout. El servidor de correo tardó demasiado en responder.",
        details: "La petición excedió los 15 segundos"
      });
    }

    // 🌐 Caso específico: Error de red
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        error: "No se puede conectar con el servidor de correo",
        details: "Verifica la URL del Apps Script y la conexión a internet"
      });
    }

    // ⚠️ Error genérico
    return res.status(500).json({
      success: false,
      error: "Error de conexión con el servidor de correo",
      details: error.message,
    });
  }
}