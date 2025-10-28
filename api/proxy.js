// /api/proxy.js
export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ 
      error: "Método no permitido. Usa POST." 
    });
  }

  try {
    if (!req.body || Object.keys(req.body).length === 0) {
      return res.status(400).json({ 
        error: "El cuerpo de la petición está vacío o mal formado." 
      });
    }

    const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/AKfycbzswblpEw1POB2v2B5yYqRwZfQ4fM-uYPvJ9zw6GzNhSBqH0kxGIH-rNxkA3-HThG68/exec";

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(GOOGLE_APPS_SCRIPT_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(req.body),
      signal: controller.signal,
    });

    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(response.status).json({
        error: `Error desde Google Apps Script`,
        status: response.status,
        statusText: response.statusText,
      });
    }

    let data;
    try {
      data = await response.json();
    } catch (parseError) {
      return res.status(500).json({
        error: "No se pudo parsear la respuesta de Google Apps Script",
        details: parseError.message,
      });
    }

    return res.status(200).json({
      success: true,
      data,
    });

  } catch (error) {
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
