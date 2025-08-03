// src/services/googleSheetsService.js

// URLs de Apps Scripts (diferentes para usuarios y peticiones)
const URLS = {
  USUARIOS: 'http://localhost:8020/proxy/macros/s/AKfycbxIQEUMdtPREAFsS-6VoIPD_tVZKLZ2zOHvNrAd_A86UZxf6ufh353msiftDrFCHL26/exec',
  PETICIONES: 'http://localhost:8020/proxy/macros/s/AKfycbybSH5UwnNEM0hqB59JB_3sZyvIBwoVKF1hv1h9p3Cd3MF1Gwc7kvV7G5HfnBDtJosy/exec'
};

export class GoogleSheetsService {
  /**
   * Envía datos a Google Sheets
   * @param {string} tipoSheet - 'usuarios' o 'peticiones'
   * @param {Object} datos - Datos a enviar
   * @returns {Promise<Object>} Respuesta del servidor
   */
  static async enviarDatos(tipoSheet, datos) {
    try {
      const url = URLS[tipoSheet.toUpperCase()];
      if (!url) {
        throw new Error(`Tipo de sheet inválido: ${tipoSheet}`);
      }

      console.log(`📤 Enviando ${tipoSheet} a Google Sheets...`);

      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(datos)
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const textoRespuesta = await response.text();
      
      try {
        const respuestaJson = JSON.parse(textoRespuesta);
        console.log(`✅ ${tipoSheet} enviado correctamente:`, respuestaJson);
        return respuestaJson;
      } catch {
        console.log(`✅ ${tipoSheet} enviado. Respuesta texto:`, textoRespuesta);
        return { success: true, message: textoRespuesta };
      }

    } catch (error) {
      console.error(`❌ Error enviando ${tipoSheet} a Sheets:`, error.message);
      throw new Error(`Error al enviar ${tipoSheet} a Google Sheets: ${error.message}`);
    }
  }

  /**
   * Envía usuario a Google Sheets
   * @param {Object} datosUsuario - Datos del usuario
   */
  static async enviarUsuario(datosUsuario) {
    return this.enviarDatos('usuarios', {
      action: 'nuevo_usuario',
      timestamp: new Date().toISOString(),
      ...datosUsuario
    });
  }

  /**
   * Envía petición a Google Sheets
   * @param {Object} datosPeticion - Datos de la petición
   */
  static async enviarPeticion(datosPeticion) {
    return this.enviarDatos('peticiones', {
      action: 'nueva_peticion',
      timestamp: new Date().toISOString(),
      ...datosPeticion
    });
  }
}

// ===== 5. CONTROLADOR PRINCIPAL =====
// src/controllers/peticionController.js
import { FirestoreService } from '../services/firestoreService';
import { GoogleSheetsService } from '../services/googleSheetsService';

export class PeticionController {
  /**
   * Procesa una petición: verifica/crea usuario y guarda la petición
   * @param {Object} datosUsuario - Datos del usuario
   * @param {Object} datosPeticion - Datos de la petición
   * @returns {Promise<Object>} Resultado del procesamiento
   */
  static async procesarPeticion(datosUsuario, datosPeticion) {
    // Validar datos de entrada
    const validationResult = this.validarDatos(datosUsuario, datosPeticion);
    if (!validationResult.valido) {
      throw new Error(`Datos inválidos: ${validationResult.errores.join(', ')}`);
    }

    let usuarioId;
    let usuarioCreado = false;

    try {
      console.log('🔄 Iniciando procesamiento de petición...');

      // 1. Verificar si el usuario existe
      const usuarioExistente = await FirestoreService.obtenerUsuarioPorCedula(datosUsuario.cedula);

      if (!usuarioExistente) {
        console.log('👤 Creando nuevo usuario...');
        
        // 2. Crear usuario en Firebase
        usuarioId = await FirestoreService.crearUsuario(datosUsuario);
        usuarioCreado = true;

        // 3. Enviar usuario a Google Sheets
        await GoogleSheetsService.enviarUsuario(datosUsuario);
        
      } else {
        console.log('✅ Usuario existente encontrado');
        usuarioId = usuarioExistente.id;
      }

      // 4. Preparar datos de la petición
      const peticionCompleta = {
        ...datosPeticion,
        usuarioId,
        cedulaUsuario: datosUsuario.cedula,
        nombreUsuario: datosUsuario.nombre
      };

      // 5. Guardar petición en Firebase
      const peticionId = await FirestoreService.guardarPeticion(peticionCompleta);

      // 6. Enviar petición a Google Sheets
      await GoogleSheetsService.enviarPeticion(peticionCompleta);

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

  /**
   * Valida los datos de entrada
   * @param {Object} datosUsuario - Datos del usuario
   * @param {Object} datosPeticion - Datos de la petición
   * @returns {Object} Resultado de validación
   */
  static validarDatos(datosUsuario, datosPeticion) {
    const errores = [];

    // Validar usuario
    if (!datosUsuario.nombre?.trim()) errores.push('Nombre del usuario requerido');
    if (!datosUsuario.cedula?.trim()) errores.push('Cédula requerida');
    if (!datosUsuario.correo?.trim()) errores.push('Correo requerido');

    // Validar petición
    if (!datosPeticion.motivo?.trim()) errores.push('Motivo de la petición requerido');

    // Validar formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (datosUsuario.correo && !emailRegex.test(datosUsuario.correo)) {
      errores.push('Formato de correo inválido');
    }

    return {
      valido: errores.length === 0,
      errores
    };
  }
}