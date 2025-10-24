// src/services/PeticionGoogleExcel.js
//const URL_PETICIONES_APPS_SCRIPT = '/api/proxy';
const URL_PETICIONES_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbzCSRPqTvZWxbuaq8pRqbGlS-Bz2KMt3ZvkAHlRoS_XS_-KBmXrIvBTxpLnhGr_et0xlA/exec';
// src/services/PeticionGoogleExcel.js

// 🔗 URL del Apps Script que recibe las peticiones
// Puedes cambiarlo por la URL pública cuando lo despliegues
/**
 * Envía datos de PETICIONES a Google Sheets usando Apps Script.
 * Normaliza los campos y asigna id = fechaIngreso para priorizar.
 *
 * @param {Object} datos - Objeto con los datos de la petición
 * @param {string} datos.fechaIngreso - Fecha en la que se debe ejecutar la petición (YYYY-MM-DD)
 * @param {string} datos.cedula - Cédula del usuario
 * @param {string} datos.nombre - Nombre completo del usuario
 * @param {string} datos.correo - Correo electrónico
 * @param {string} datos.cargo - Cargo del usuario
 * @param {string} [datos.empresa] - Empresa del usuario (opcional)
 * @param {string} [datos.ciudad] - Ciudad del usuario (opcional)
 * @param {string} [datos.observacion] - Observación o comentario adicional (opcional)
 * @returns {Promise<Object|string>} - Respuesta del servidor, puede ser JSON o texto
 */
export async function enviarPeticionAAppsScript(datos) {
  try {
    // 1️⃣ Validar los campos mínimos obligatorios
    const { fechaIngreso, cedula, nombre, correo } = datos;
    if (!fechaIngreso || !cedula || !nombre || !correo) {
      throw new Error('Faltan campos obligatorios: fechaIngreso, cedula, nombre o correo');
    }

    // 2️⃣ Normalizar datos: aseguramos consistencia y agregamos defaults
    const peticionNormalizada = {
      id: fechaIngreso, // ✅ ID = fechaIngreso, para priorizar por fecha
      cedula: datos["CEDULA"] || datos.cedula,
      nombre: datos["NOMBRE / APELLIDO"] || datos.nombre,
      correo: datos["CORREO"] || datos.correo,
      cargo: datos["CARGO"] || datos.cargo,
      empresa: datos["EMPRESA"] || datos.empresa || 'PROSERVIS TEMPORALES',
      ciudad: datos["CIUDAD"] || datos.ciudad || 'CALI',
      observacion: datos["OBSERVACION"] || '',
      tipo: 'USUARIO Y EQUIPO', // Todas las peticiones por ahora son de este tipo
      timestamp: Date.now(), // timestamp numérico para ordenar o filtrar
      ...datos // mantener cualquier otro dato extra que venga en el objeto
    };

    console.log('📤 Enviando petición a Google Sheets...', peticionNormalizada);

    // 3️⃣ Enviar la petición al Apps Script usando POST
    const response = await fetch(URL_PETICIONES_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json', // enviamos JSON
        'Accept': 'application/json' // esperamos JSON
      },
      body: JSON.stringify({
        ...peticionNormalizada,
        timestamp: new Date().toISOString() // timestamp en formato ISO para logs
      })
    });

    // 4️⃣ Validar que la respuesta HTTP sea exitosa
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    // 5️⃣ Leer la respuesta como texto
    const textoRespuesta = await response.text();

    try {
      // 6️⃣ Intentar parsear la respuesta como JSON
      const respuestaJson = JSON.parse(textoRespuesta);
      console.log(`✅ Petición enviada exitosamente:`, respuestaJson);
      return respuestaJson;
    } catch {
      // 7️⃣ Si no es JSON, devolver como texto plano
      console.log(`✅ Petición enviada. Respuesta texto:`, textoRespuesta);
      return { success: true, message: textoRespuesta };
    }

  } catch (error) {
    // 8️⃣ Manejo de errores: log y throw
    console.error(`❌ Error al enviar petición a Google Sheets:`, error.message);
    throw new Error(`Error al enviar petición: ${error.message}`);
  }
}
