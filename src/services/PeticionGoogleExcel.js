// src/services/PeticionGoogleExcel.js
const URL_PETICIONES_APPS_SCRIPT = '/api/proxy';
//const URL_PETICIONES_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbzCSRPqTvZWxbuaq8pRqbGlS-Bz2KMt3ZvkAHlRoS_XS_-KBmXrIvBTxpLnhGr_et0xlA/exec';

/**
 * Envía datos de PETICIONES a Google Sheets usando Apps Script.
 * @param {Object} datos - Objeto con los datos a enviar. Debe contener la propiedad `action`.
 * @returns {Promise<Object|string>} - Respuesta JSON del servidor o texto plano.
 */
export async function enviarPeticionAAppsScript(datos) {
  try {
    console.log('📤 Enviando petición a Google Sheets...', datos);

    const response = await fetch(URL_PETICIONES_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({
        ...datos,
        timestamp: new Date().toISOString()
      })
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textoRespuesta = await response.text();

    try {
      const respuestaJson = JSON.parse(textoRespuesta);
      console.log(`✅ Petición enviada exitosamente:`, respuestaJson);
      return respuestaJson;
    } catch {
      console.log(`✅ Petición enviada. Respuesta texto:`, textoRespuesta);
      return { success: true, message: textoRespuesta };
    }

  } catch (error) {
    console.error(`❌ Error al enviar petición a Google Sheets:`, error.message);
    throw new Error(`Error al enviar petición: ${error.message}`);
  }
}