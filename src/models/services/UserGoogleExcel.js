// src/services/UserGoogleExcel.js

// 🔗 URL del Apps Script para USUARIOS

// ✅ URL pública de tu Apps Script desplegado como Web App
const URL_USUARIOS_APPS_SCRIPT = '/api/proxy';
// src/services/UserGoogleExcel.js

// 🔗 URL del Apps Script para USUARIOS
//const URL_USUARIOS_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbzswblpEw1POB2v2B5yYqRwZfQ4fM-uYPvJ9zw6GzNhSBqH0kxGIH-rNxkA3-HThG68/exec';

/**
 * Envía datos de USUARIOS a Google Sheets usando Apps Script.
 * @param {Object} datos - Objeto con los datos a enviar. Debe contener la propiedad `action`.
 * @returns {Promise<Object>} - Respuesta JSON del servidor.
 */
export async function enviarUsuarioAAppsScript(datos) {
  try {
    console.log('📤 Enviando datos a Google Sheets...', datos);

    // ✅ VALIDACIÓN INTELIGENTE: Diferentes validaciones según la acción
    if (!datos.action) {
      throw new Error('Se requiere el campo "action" en los datos');
    }

    // 🟢 Para NUEVO_USUARIO: validar todos los campos
    if (datos.action === 'nuevo_usuario') {
      const cedula = datos.cedula || datos.CEDULA;
      const nombre = datos.nombre || datos["NOMBRE / APELLIDO"];
      const correo = datos.correo || datos.CORREO;
      const cargo = datos.cargo || datos.CARGO;
      const empresa = datos.empresa || datos.EMPRESA;
      const ciudad = datos.ciudad || datos.CIUDAD;

      if (!cedula || !nombre || !correo) {
        throw new Error('Datos incompletos. Se requieren: cédula, nombre y correo');
      }

      // Sobrescribir en formato estándar (minúsculas)
      datos.cedula = cedula;
      datos.nombre = nombre;
      datos.correo = correo;
      datos.cargo = cargo || '';
      datos.empresa = empresa || '';
      datos.ciudad = ciudad || '';

    }


    // 🟡 Para INACTIVAR_USUARIO: solo validar cédula
    if (datos.action === 'inactivar_usuario') {
      if (!datos.cedula) {
        throw new Error('Se requiere la cédula para inactivar usuario');
      }
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
      console.log('✅ Datos enviados exitosamente:', respuestaJson);
      return respuestaJson;
    } catch (parseError) {
      // Si no es JSON, devolver como texto
      console.log('✅ Datos enviados. Respuesta texto:', textoRespuesta);
      return {
        success: true,
        message: textoRespuesta,
        rawResponse: textoRespuesta
      };
    }

  } catch (error) {
    console.error('❌ Error al enviar datos a Google Sheets:', error.message);
    throw new Error(`Error al enviar datos: ${error.message}`);
  }
}

/**
 * FUNCIÓN ESPECIALIZADA: Inactivar usuario en Google Sheets
 * @param {string} cedula - Cédula del usuario a inactivar
 * @returns {Promise<Object>} - Respuesta del servidor
 */
export async function inactivarUsuarioEnSheets(cedula) {
  try {
    console.log('🔄 Inactivando usuario en Google Sheets...', cedula);

    const datosInactivacion = {
      action: 'inactivar_usuario',
      cedula: cedula
    };

    const resultado = await enviarUsuarioAAppsScript(datosInactivacion);

    if (resultado.success) {
      console.log("✅ Usuario inactivado en Google Sheets:", resultado);
      return resultado;
    } else {
      throw new Error(resultado.message || "Error al inactivar en Sheets");
    }
  } catch (error) {
    console.error("❌ Error al inactivar usuario en Sheets:", error);
    throw error;
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