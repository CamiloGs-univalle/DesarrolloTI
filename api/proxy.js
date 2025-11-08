// ❌ PROBLEMA: Estás verificando response.ok pero el Apps Script puede responder con 200 incluso en error
// ✅ SOLUCIÓN: Verificar el contenido de la respuesta

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
    const timeout = setTimeout(() => controller.abort(), 15000); // Aumentado a 15s

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

    // 🔥 CAMBIO CRÍTICO: Apps Script siempre responde con 200, verificar contenido
    const textResponse = await response.text();
    
    let data;
    try {
      data = JSON.parse(textResponse);
    } catch (parseError) {
      console.error("❌ No se pudo parsear respuesta:", textResponse);
      return res.status(500).json({
        error: "Respuesta inválida del servidor",
        rawResponse: textResponse.substring(0, 200) // Log para debugging
      });
    }

    // ✅ Verificar si el Apps Script reportó éxito
    if (data && data.success === false) {
      return res.status(400).json({
        error: data.error || "Error del Apps Script",
        details: data.details
      });
    }

    // ✅ Éxito
    return res.status(200).json({
      success: true,
      data: data
    });

  } catch (error) {
    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "Timeout. El Apps Script tardó demasiado en responder.",
      });
    }

    console.error("🔥 Error en proxyEmail:", error);
    return res.status(500).json({
      error: "Error interno del servidor",
      details: error.message,
    });
  }
}