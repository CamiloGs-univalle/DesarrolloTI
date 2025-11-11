// ============================================================================
// 📄 ARCHIVO: /api/proxyEmail.js
// 🎯 PROPÓSITO: Proxy seguro para enviar correos mediante Google Apps Script
// 🔒 SEGURIDAD: Valida método, valida body, timeout automático, manejo robusto
// ============================================================================

// ------------------------------------------------------------
// 🛠️ 1) CONFIGURACIÓN ESPECIAL DE NEXT.JS
// ------------------------------------------------------------
// Exportamos `config` para indicarle a Next.js que utilice el bodyParser
// incorporado y transforme el body JSON en `req.body` (objeto).
// Sin esto, en algunos entornos `req.body` puede venir vacío o como string.
export const config = {
  api: {
    bodyParser: true, // true = Next.js parsea JSON automáticamente
  },
};

// ------------------------------------------------------------
// 🔁 2) HANDLER PRINCIPAL
// ------------------------------------------------------------
export default async function handler(req, res) {
  // ---------- Línea: validar método HTTP ----------
  // Solo permitimos POST. Si llega otro método devolvemos 405 Method Not Allowed.
  if (req.method !== "POST") {
    console.warn("⚠️ Intento de acceso con método no permitido:", req.method);
    return res.status(405).json({
      success: false,
      error: "Método no permitido. Usa POST para enviar correos.",
    });
  }

  // ---------- Línea: DEBUG - mostrar cabeceras y body (útil para debug local) ----------
  // NOTA: En producción puedes quitar estos logs o reducir su verbosidad.
  console.log("🔎 ProxyEmail - headers recibidos:", req.headers);
  console.log("🔎 ProxyEmail - body recibido (raw):", req.body);

  try {
    // ---------- Línea: Validación básica del body ----------
    // Verificamos que req.body exista y contenga propiedades.
    // Si viene vacío => 400 Bad Request (tu frontend probablemente no mandó JSON).
    if (!req.body || Object.keys(req.body).length === 0) {
      console.warn("⚠️ Petición con cuerpo vacío o mal formado recibida en proxy");
      return res.status(400).json({
        success: false,
        error: "El cuerpo de la petición está vacío o mal formado.",
      });
    }

    // ---------- Línea: Normalización de campos esperados ----------
    // Aseguramos que los campos críticos existan (asunto, correoDestino, respuestaHtml)
    // y los tomamos desde req.body (puedes adaptar nombres si tu frontend usa otros).
    const { asunto, correoDestino, respuestaHtml } = req.body;

    // ---------- Línea: Validación de campos obligatorios ----------
    if (!correoDestino || !asunto || !respuestaHtml) {
      console.error("❌ Faltan campos obligatorios en el body:", {
        asunto: !!asunto,
        correoDestino: !!correoDestino,
        respuestaHtml: !!respuestaHtml,
      });

      return res.status(400).json({
        success: false,
        error: "Faltan campos obligatorios: correoDestino, asunto o respuestaHtml.",
      });
    }

    // ---------- Línea: URL del Google Apps Script (destino final) ----------
    // ⚠️ IMPORTANTE: El Apps Script debe estar publicado como Web App
    // con: "Ejecutar como: Yo" y "Acceso: Cualquiera, incluso anónimo"
    const GOOGLE_APPS_SCRIPT_EMAIL = "https://script.google.com/macros/s/AKfycbyd4vUO_ErNp0NLxxwV3_ebx0vzFrVhRI9uBUG2OLh5RzGv26K0A9LdQ-z3v2ZN6gKv/exec";

    //const GOOGLE_APPS_SCRIPT_EMAIL = "http://localhost:8020/proxy/macros/s/AKfycbyd4vUO_ErNp0NLxxwV3_ebx0vzFrVhRI9uBUG2OLh5RzGv26K0A9LdQ-z3v2ZN6gKv/exec";


    // ---------- Línea: Preparamos el AbortController para timeout ----------
    // Creamos un controller para poder abortar la petición si excede 15s.
    const controller = new AbortController();
    const TIMEOUT_MS = 15000; // 15 segundos
    const timeout = setTimeout(() => {
      console.warn("⏰ Timeout alcanzado - Abortando petición a Apps Script");
      controller.abort(); // Lanza AbortError en la fetch
    }, TIMEOUT_MS);

    // ---------- Línea: Log antes de llamar al Apps Script ----------
    console.log("📤 Enviando datos a Apps Script:", {
      asunto,
      correoDestino,
      // No mostramos el HTML completo en logs para evitar polución; mostramos longitud
      respuestaHtmlLength: String(respuestaHtml).length,
    });

    // ---------- Línea: Enviamos la petición al Apps Script ----------
    // Mandamos exactamente el body que recibimos (puedes filtrar campos si quieres).
    const response = await fetch(GOOGLE_APPS_SCRIPT_EMAIL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(req.body),
      signal: controller.signal, // Permite abortar si timeout ocurre
    });

    // ---------- Línea: Limpiar timeout porque la petición ya respondió ----------
    clearTimeout(timeout);

    // ---------- Línea: Leemos la respuesta como texto (para debug/resiliencia) ----------
    // A veces Apps Script responde con JSON, a veces con texto: first read text.
    const responseText = await response.text();
    console.log("📥 Respuesta cruda de Apps Script (primeros 1000 chars):", responseText.substring(0, 1000));

    // ---------- Línea: Intentamos parsear la respuesta como JSON ----------
    let data;
    try {
      data = JSON.parse(responseText);
      console.log("✅ Respuesta parseada correctamente del Apps Script:", data);
    } catch (parseError) {
      // Si no se puede parsear, devolvemos error 500 con el rawResponse para debugging.
      console.error("❌ Error parseando JSON del Apps Script:", {
        error: parseError.message,
        responsePreview: responseText.substring(0, 500),
      });

      return res.status(500).json({
        success: false,
        error: "Respuesta inválida del servidor de correo",
        details: "El servidor respondió con un formato no JSON",
        rawResponse: responseText.substring(0, 1000),
      });
    }

    // ---------- Línea: Si el Apps Script devolvió success: false -> 400 (error lógico) ----------
    // Muchos Apps Script devuelven HTTP 200 incluso en errores internos, por eso miramos el body.
    if (data && data.success === false) {
      console.error("❌ Apps Script reportó error interno:", data.error || data);
      return res.status(400).json({
        success: false,
        error: data.error || "Error del servidor de correo",
        details: data.details || null,
        raw: data,
      });
    }

    // ---------- Línea: Si todo salió bien, devolvemos 200 con la data del Apps Script ----------
    console.log("✅ Correo enviado (según Apps Script) a:", correoDestino);
    return res.status(200).json({
      success: true,
      data: data,
    });

  } catch (error) {
    // ---------- Manejo centralizado de errores ----------
    console.error("🔥 Error en proxyEmail:", error);

    // Timeout (AbortController) -> 504 Gateway Timeout
    if (error.name === "AbortError") {
      return res.status(504).json({
        success: false,
        error: "Timeout. El servidor de correo tardó demasiado en responder.",
        details: `Tiempo límite: ${15000}ms`,
      });
    }

    // Errores de red comunes
    if (error.code === "ENOTFOUND" || error.code === "ECONNREFUSED") {
      return res.status(503).json({
        success: false,
        error: "No se puede conectar con el servidor de correo",
        details: "Verifica la URL del Apps Script y la conexión a internet",
      });
    }

    // Error genérico -> 500 Internal Server Error
    return res.status(500).json({
      success: false,
      error: "Error de conexión con el servidor de correo",
      details: error.message,
    });
  }
}
