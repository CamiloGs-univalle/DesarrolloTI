// src/services/PeticionGoogleExcel.js
const URL_PETICIONES_APPS_SCRIPT = '/api/proxy';
//De forma host => 
//const URL_PETICIONES_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbwZlJ0VVKJT_b9cQKcZeopAlWf7D-E7l3q4CQy1k-opggNork0d1JPXcITwOQJX0rQ/exec';


/**
 * enviarPeticionAAppsScript
 * - recibe 'datos' que pueden incluir fechaIngreso y opcionalmente id
 * - NO fuerza id = fechaIngreso (eso provocaba inconsistencias)
 */
export async function enviarPeticionAAppsScript(datos) {
  try {
    const { fechaIngreso, cedula, nombre, correo } = datos;
    if (!fechaIngreso || !cedula || !nombre || !correo) {
      throw new Error('Faltan campos obligatorios: fechaIngreso, cedula, nombre o correo');
    }

    // Construir objeto a enviar manteniendo cualquier `id` que venga (por ejemplo: '31-10-2025-01')
    const peticionNormalizada = {
      ...datos,
      fechaIngreso,
      cedula: datos["CEDULA"] || datos.cedula,
      nombre: datos["NOMBRE / APELLIDO"] || datos.nombre,
      correo: datos["CORREO"] || datos.correo,
      cargo: datos["CARGO"] || datos.cargo,
      empresa: datos["EMPRESA"] || datos.empresa || 'PROSERVIS TEMPORALES',
      ciudad: datos["CIUDAD"] || datos.ciudad || 'CALI',
      observacion: datos["OBSERVACION"] || datos.observacion || '',
      tipo: datos.tipo || 'USUARIO Y EQUIPO',
      timestamp: datos.timestamp || Date.now()
    };

    //console.log('📤 Enviando petición a Google Sheets...', peticionNormalizada);

    const response = await fetch(URL_PETICIONES_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(peticionNormalizada)
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const textoRespuesta = await response.text();

    try {
      const respuestaJson = JSON.parse(textoRespuesta);
      //console.log(`✅ Petición enviada exitosamente:`, respuestaJson);
      return respuestaJson;
    } catch {
      //console.log(`✅ Petición enviada. Respuesta texto:`, textoRespuesta);
      return { success: true, message: textoRespuesta };
    }
  } catch (error) {
    console.error(`❌ Error al enviar petición a Google Sheets:`, error.message);
    throw new Error(`Error al enviar petición: ${error.message}`);
  }
}
  