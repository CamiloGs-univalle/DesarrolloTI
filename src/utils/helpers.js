// src/utils/helpers.js
export class Helpers {
  /**
   * Formatea datos para logging
   * @param {string} tipo - Tipo de operación
   * @param {Object} datos - Datos a formatear
   */
  static logOperacion(tipo, datos) {
    console.log(`🔄 [${tipo.toUpperCase()}]`, {
      timestamp: new Date().toISOString(),
      datos: datos
    });
  }

  /**
   * Sanitiza strings de entrada
   * @param {string} str - String a sanitizar
   * @returns {string} String sanitizado
   */
  static sanitizeString(str) {
    return str?.toString().trim() || '';
  }

  /**
   * Valida formato de cédula
   * @param {string} cedula - Cédula a validar
   * @returns {boolean} Es válida
   */
  static validarCedula(cedula) {
    return cedula && 
           typeof cedula === 'string' && 
           cedula.trim().length >= APP_CONFIG.VALIDATION.CEDULA_MIN_LENGTH;
  }
}