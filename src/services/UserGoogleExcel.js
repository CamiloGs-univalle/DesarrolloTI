// src/services/UserGoogleExcel.js

// 🔗 URL del Apps Script para USUARIOS

// ✅ URL pública de tu Apps Script desplegado como Web App
const URL_USUARIOS_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbzCSRPqTvZWxbuaq8pRqbGlS-Bz2KMt3ZvkAHlRoS_XS_-KBmXrIvBTxpLnhGr_et0xlA/exec';


//De forma host => 
//const URL_USUARIOS_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbzCSRPqTvZWxbuaq8pRqbGlS-Bz2KMt3ZvkAHlRoS_XS_-KBmXrIvBTxpLnhGr_et0xlA/exec';

/**
 * Envía datos de USUARIOS a Google Sheets usando Apps Script.
 * @param {Object} datos - Objeto con los datos a enviar. Debe contener la propiedad `action`.
 * @returns {Promise<Object>} - Respuesta JSON del servidor.
 */
export async function enviarUsuarioAAppsScript(datos) {
  try {
    console.log('📤 Enviando usuario a Google Sheets...', datos);

    // 1️⃣ VALIDAR DATOS MÍNIMOS REQUERIDOS
    if (!datos.cedula || !datos.nombre || !datos.correo) {
      throw new Error('Datos incompletos. Se requieren: cédula, nombre y correo');
    }

    // 2️⃣ PREPARAR DATOS PARA ENVÍO
    const datosCompletos = {
      ...datos,
      timestamp: new Date().toISOString(),
      source: 'react-app'
    };

    // 3️⃣ REALIZAR PETICIÓN HTTP POST
    const response = await fetch(URL_USUARIOS_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(datosCompletos)
    });

    // 4️⃣ VERIFICAR SI LA RESPUESTA ES EXITOSA
    if (!response.ok) {
      throw new Error(`Error HTTP! estado: ${response.status}`);
    }

    // 5️⃣ OBTENER Y PROCESAR LA RESPUESTA
    const textoRespuesta = await response.text();
    
    try {
      // Intentar parsear como JSON
      const respuestaJson = JSON.parse(textoRespuesta);
      console.log('✅ Usuario enviado exitosamente:', respuestaJson);
      return respuestaJson;
    } catch (parseError) {
      // Si no es JSON, devolver como texto
      console.log('✅ Usuario enviado. Respuesta texto:', textoRespuesta);
      return { 
        success: true, 
        message: textoRespuesta,
        rawResponse: textoRespuesta
      };
    }

  } catch (error) {
    console.error('❌ Error al enviar usuario a Google Sheets:', error.message);
    throw new Error(`Error al enviar usuario: ${error.message}`);
  }
}

/**
 * Función de prueba para verificar conexión con Google Sheets
 */
export async function probarConexionUsuario() {
  try {
    console.log('🔍 Probando conexión con Google Sheets para usuarios...');
    
    const datosPrueba = {
      action: 'test',
      timestamp: new Date().toISOString()
    };
    
    const response = await fetch(URL_USUARIOS_APPS_SCRIPT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(datosPrueba)
    });
    
    if (!response.ok) {
      throw new Error(`Error de conexión: ${response.status}`);
    }
    
    const resultado = await response.text();
    console.log('✅ Conexión exitosa:', resultado);
    return { success: true, message: 'Conexión verificada' };
    
  } catch (error) {
    console.error('❌ Error probando conexión:', error);
    throw error;
  }
}