// /api/google.js

/**
 * Proxy API para enviar datos desde tu app (en Vercel)
 * hacia un Google Apps Script que conecta con Google Sheets.
 * Esto evita problemas de CORS y hace el flujo más seguro.
 */
export default async function handler(req, res) {
  // ✅ 1. Restringimos solo a método POST
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Método no permitido. Usa POST." 
    });
  }

  try {
    // ✅ 2. Validamos que el body tenga datos
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: "El cuerpo de la petición está vacío o mal formado." 
      });
    }

    // ✅ 3. URL pública del Apps Script desplegado como aplicación web
    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzCSRPqTvZWxbuaq8pRqbGlS-Bz2KMt3ZvkAHlRoS_XS_-KBmXrIvBTxpLnhGr_et0xlA/exec";

    // ✅ 4. Enviamos los datos al Apps Script
    // - Usamos AbortController para timeout en caso de que falle el GAS
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000); // 10s de espera

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout); // limpiamos el timeout

    // ✅ 5. Verificamos si la respuesta fue OK
    if (!response.ok) {
      return res.status(response.status).json({
        error: `Error desde Google Apps Script`,
        status: response.status,
        statusText: response.statusText,
      });
    }

    // ✅ 6. Intentamos parsear la respuesta como JSON
    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return res.status(500).json({
        error: "No se pudo parsear la respuesta de Google Apps Script",
        details: parseError.message,
      });
    }

    // ✅ 7. Reenviamos la respuesta correcta al frontend
    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
    // ✅ 8. Manejo de errores específicos
    if (error.name === "AbortError") {
      return res.status(504).json({
        error: "Timeout. Google Apps Script tardó demasiado en responder.",
      });
    }

    return res.status(500).json({
      error: "Error inesperado al enviar a Google Apps Script",
      details: error.message,
    });
  }
}
