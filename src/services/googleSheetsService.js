// 📁 src/services/googleSheetsService.js

/**
 * Servicio para enviar datos a Google Sheets via Apps Script
 */

// USA ESTA URL (la que copiaste)
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbwZlJ0VVKJT_b9cQKcZeopAlWf7D-E7l3q4CQy1k-opggNork0d1JPXcITwOQJX0rQ/exec';

export class GoogleSheetsService {
  
  /**
   * Envía un nuevo usuario a Google Sheets
   */
  static async enviarUsuario(datosUsuario) {
    try {
      console.log('📤 Enviando usuario a Google Sheets...', datosUsuario);
      
      // Validar datos mínimos requeridos
      if (!datosUsuario.cedula || !datosUsuario.nombre || !datosUsuario.correo) {
        throw new Error('Datos incompletos. Se requieren: cédula, nombre y correo');
      }
      
      // Preparar datos para enviar
      const datosParaEnviar = {
        action: 'nuevo_usuario',
        timestamp: new Date().toISOString(),
        ...datosUsuario
      };
      
      console.log('📦 Datos a enviar:', datosParaEnviar);
      console.log('🔗 URL destino:', URL_APPS_SCRIPT);
      
      // Realizar la petición POST con timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15000);
      
      const response = await fetch(URL_APPS_SCRIPT, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(datosParaEnviar),
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      console.log('📨 Respuesta HTTP recibida:', response.status, response.statusText);
      
      // Verificar si la respuesta es OK
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      // Parsear la respuesta JSON
      const respuesta = await response.json();
      
      console.log('✅ Respuesta de Google Sheets:', respuesta);
      
      return respuesta;
      
    } catch (error) {
      console.error('❌ Error enviando usuario:', error);
      
      // Mensajes de error más específicos
      if (error.name === 'AbortError') {
        throw new Error('Timeout: La petición tardó más de 15 segundos');
      }
      
      if (error.message.includes('Failed to fetch')) {
        throw new Error('No se pudo conectar al servidor. Verifica que el proxy esté ejecutándose en puerto 8020.');
      }
      
      throw new Error(`Error al enviar usuario: ${error.message}`);
    }
  }
  
  /**
   * Función de prueba para verificar la conexión
   */
  static async probarConexion() {
    try {
      console.log('🔍 Probando conexión con Apps Script...');
      console.log('🔗 URL:', URL_APPS_SCRIPT);
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000);
      
      const response = await fetch(URL_APPS_SCRIPT, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`Error HTTP: ${response.status} - ${response.statusText}`);
      }
      
      const data = await response.json();
      console.log('✅ Conexión exitosa:', data);
      return data;
      
    } catch (error) {
      console.error('❌ Error probando conexión:', error);
      
      if (error.name === 'AbortError') {
        throw new Error('Timeout: No se pudo conectar en 10 segundos. Verifica el proxy.');
      }
      
      throw error;
    }
  }
}