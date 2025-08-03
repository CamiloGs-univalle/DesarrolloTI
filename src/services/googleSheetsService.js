// 📁 src/services/googleSheetsService.js

// URL del Apps Script, redirigida mediante el proxy local (LCP)
const URL_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbxIQEUMdtPREAFsS-6VoIPD_tVZKLZ2zOHvNrAd_A86UZxf6ufh353msiftDrFCHL26/exec';

/**
 * Enviar datos a Google Sheets a través de Google Apps Script.
 * @param {Object} datos - Objeto JSON con los datos que se enviarán.
 *                        - Debe incluir un campo llamado `action` con valor: 'nuevo_usuario', 'reemplazo', o 'nuevo_cargo'
 * @returns {Object|String} - La respuesta del servidor (JSON o texto).
 */
export async function enviarAFirebaseAAppsScript(datos) {
  try {
    // Realiza una solicitud POST al Apps Script
    const response = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datos)
    });

    // Leer la respuesta como texto
    const textoRespuesta = await response.text();

    // Intentar parsear como JSON
    try {
      const respuestaJson = JSON.parse(textoRespuesta);
      console.log('📤 Respuesta JSON recibida:', respuestaJson);
      return respuestaJson;
    } catch {
      // Si no es JSON, devolver texto crudo
      console.warn('⚠️ La respuesta no es JSON. Texto:', textoRespuesta);
      return textoRespuesta;
    }

  } catch (error) {
    console.error('❌ Error al enviar datos a Apps Script:', error);
    throw error;
  }
}
