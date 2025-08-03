// src/services/UserGoogleExcel.js
// NOTA: Cambia esta URL por la de tu Apps Script de usuarios
const URL_USUARIOS_APPS_SCRIPT = 'http://localhost:8020/proxy/macros/s/AKfycbxIQEUMdtPREAFsS-6VoIPD_tVZKLZ2zOHvNrAd_A86UZxf6ufh353msiftDrFCHL26/exec';

/**
 * Envía datos de USUARIOS a Google Sheets usando Apps Script.
 * @param {Object} datos - Objeto con los datos a enviar. Debe contener la propiedad `action`.
 * @returns {Promise<Object|string>} - Respuesta JSON del servidor o texto plano.
 */
export async function enviarUsuarioAAppsScript(datos) {
  try {
    console.log('📤 Enviando usuario a Google Sheets...', datos);

    const response = await fetch(URL_USUARIOS_APPS_SCRIPT, {
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
      console.log(`✅ Usuario enviado exitosamente:`, respuestaJson);
      return respuestaJson;
    } catch {
      console.log(`✅ Usuario enviado. Respuesta texto:`, textoRespuesta);
      return { success: true, message: textoRespuesta };
    }

  } catch (error) {
    console.error(`❌ Error al enviar usuario a Google Sheets:`, error.message);
    throw new Error(`Error al enviar usuario: ${error.message}`);
  }
}

/**
 * FUNCIÓN PRINCIPAL: Procesa usuario y petición
 * @param {Object} datosUsuario - Datos del usuario
 * @param {Object} datosPeticion - Datos de la petición
 */
export async function guardarPeticionConUsuarioSiNoExiste(datosUsuario, datosPeticion) {
  // Importar servicios localmente para evitar problemas de imports circulares
  const { firestoreService } = await import('../firebase/firebaseService');
  const { enviarPeticionAAppsScript } = await import('./PeticionGoogleExcel');

  try {
    console.log('🔄 Iniciando procesamiento de petición...');

    // Validar datos básicos
    if (!datosUsuario.cedula?.trim()) {
      throw new Error('Cédula del usuario es requerida');
    }
    if (!datosPeticion.motivo?.trim()) {
      throw new Error('Motivo de la petición es requerido');
    }

    const { cedula } = datosUsuario;
    let usuarioId;
    let usuarioCreado = false;

    // 1. Verificar si el usuario existe
    const usuarioExistente = await firestoreService.obtenerUsuarioPorCedula(cedula);

    if (!usuarioExistente) {
      console.log('👤 Creando nuevo usuario...');
      
      // 2. Crear usuario en Firebase
      usuarioId = await firestoreService.agregarUsuario(datosUsuario);
      usuarioCreado = true;

      // 3. Enviar usuario a Google Sheets
      await enviarUsuarioAAppsScript({
        action: 'nuevo_usuario',
        ...datosUsuario
      });
      console.log('✅ Usuario enviado a Google Sheets');
      
    } else {
      console.log('✅ Usuario existente encontrado');
      usuarioId = usuarioExistente.id;
    }

    // 4. Preparar datos de la petición
    const peticionCompleta = {
      ...datosPeticion,
      usuarioId,
      cedulaUsuario: cedula,
      nombreUsuario: datosUsuario.nombre
    };

    // 5. Guardar petición en Firebase
    const peticionId = await firestoreService.guardarPeticion(peticionCompleta);

    // 6. Enviar petición a Google Sheets
    await enviarPeticionAAppsScript({
      action: 'nueva_peticion',
      ...peticionCompleta
    });

    console.log('🎉 Procesamiento completado exitosamente');

    return {
      success: true,
      usuarioId,
      peticionId,
      usuarioCreado,
      message: 'Petición procesada correctamente'
    };

  } catch (error) {
    console.error('❌ Error en procesamiento:', error.message);
    throw new Error(`Error al procesar petición: ${error.message}`);
  }
}
