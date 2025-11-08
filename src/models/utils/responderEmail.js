// ============================================================================
// 📄 ARCHIVO: src/utils/responderEmail.js  
// 🎯 PROPÓSITO: Función utilitaria para enviar respuestas de correo
// 🔗 DEPENDENCIAS: Firebase Firestore para eliminación de solicitudes
// ============================================================================

// Importar funciones necesarias de Firebase Firestore
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../models/firebase/firebase";

// 🔗 URL del endpoint del proxy de correo
const URL_APPS_SCRIPT = '/api/proxyEmail';

/**
 * 📧 Función principal para enviar respuestas de correo electrónico
 * @param {Object} solicitud - Objeto con los datos de la solicitud
 * @param {string} textoRespuesta - Contenido HTML del correo a enviar
 * @returns {Object} - Resultado de la operación {ok: boolean, msg: string}
 */
export async function enviarRespuesta(solicitud, textoRespuesta) {
  try {
    console.log("🚀 Iniciando envío de respuesta para solicitud:", solicitud.id);

    // ========================================================================
    // 👤 1. EXTRACCIÓN Y NORMALIZACIÓN DEL NOMBRE DEL USUARIO
    // ========================================================================
    const nombreUsuario =
      solicitud["NOMBRE USUARIO"]?.trim() ||        // Formato 1: Con espacio
      solicitud.NOMBRE_USUARIO?.trim() ||           // Formato 2: Con guión bajo  
      solicitud.nombreUsuario?.trim() ||            // Formato 3: Camel case
      solicitud.solicitante?.trim() ||              // Formato 4: Campo genérico
      solicitud.usuarioReemplazar?.nombre?.trim() || // Formato 5: Objeto anidado
      solicitud["USUARIO ID"]?.trim() ||            // Formato 6: ID de usuario
      "Desconocido";                                // Valor por defecto

    console.log("👤 Nombre de usuario detectado:", nombreUsuario);

    // ========================================================================
    // 📝 2. CONSTRUCCIÓN DEL ASUNTO DEL CORREO
    // ========================================================================
    const asunto =
      solicitud.asunto || // Usar asunto existente si está disponible
      `Solicitud ${solicitud.tipoSolicitud?.toLowerCase() || "nuevo usuario"} - ${nombreUsuario}`;

    console.log("📝 Asunto del correo:", asunto);

    // ========================================================================
    // 📧 3. PREPARACIÓN DE DATOS PARA EL ENVÍO
    // ========================================================================
    const data = {
      asunto: asunto,                              // Asunto del correo (OBLIGATORIO)
      respuestaHtml: textoRespuesta,               // Cuerpo HTML del correo (OBLIGATORIO)
      correoDestino:                               // Destinatario del correo (OBLIGATORIO)
        solicitud?.usuarioReemplazar?.correo ||    // Opción 1: Correo de usuario a reemplazar
        solicitud?.correo ||                       // Opción 2: Correo directo
        solicitud?.CORREO ||                       // Opción 3: Correo en mayúsculas
        "auxiliar.ti@proservis.com.co",           // Opción 4: Correo por defecto
      nombreUsuario: nombreUsuario,                // Para logging y personalización
      tipoSolicitud: solicitud.tipoSolicitud || "desconocida" // Para categorización
    };

    console.log("📧 Datos preparados para envío:", {
      asunto: data.asunto,
      correoDestino: data.correoDestino,
      tipoSolicitud: data.tipoSolicitud,
      longitudHtml: data.respuestaHtml.length
    });

    // ========================================================================
    // 🚀 4. ENVÍO DE LA PETICIÓN AL PROXY
    // ========================================================================
    console.log("🔄 Enviando petición al proxy...");
    const response = await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // Especificar formato JSON
      },
      body: JSON.stringify(data), // Serializar datos a JSON
    });

    // ========================================================================
    // 🔍 5. VALIDACIÓN DE LA RESPUESTA HTTP
    // ========================================================================
    if (!response.ok) {
      // ❌ Si la respuesta HTTP no es 2xx, intentar extraer detalles del error
      let errorData;
      try {
        errorData = await response.json();
      } catch (jsonError) {
        // Si no se puede parsear JSON, usar información básica HTTP
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      // Lanzar error con información específica del proxy
      throw new Error(errorData.error || `Error ${response.status} del servidor`);
    }

    // ========================================================================
    // 📋 6. PROCESAMIENTO DE LA RESPUESTA JSON
    // ========================================================================
    const result = await response.json();
    console.log("✅ Respuesta del proxy recibida:", result);

    // ========================================================================
    // ✅ 7. VERIFICACIÓN DE ÉXITO EN LA RESPUESTA
    // ========================================================================
    if (!result.success) {
      throw new Error(result.error || "Error desconocido al enviar correo");
    }

    // ========================================================================
    // 🗑️ 8. ELIMINACIÓN DE LA SOLICITUD EN FIRESTORE (OPCIONAL)
    // ========================================================================
    // NOTA: Esta eliminación puede moverse al componente React según preferencia
    if (solicitud.id) {
      try {
        // 🔥 IMPORTANTE: Usar la MISMA colección que en el componente
        // Posibles opciones: "peticiones" o "solicitudes" - DEBE SER CONSISTENTE
        const COLECCION = "peticiones"; // ⚠️ CAMBIAR según tu base de datos
        
        const solicitudRef = doc(db, COLECCION, solicitud.id);
        await deleteDoc(solicitudRef);
        console.log(`🗑️ Solicitud ${solicitud.id} eliminada de '${COLECCION}'`);
      } catch (deleteError) {
        // ⚠️ No lanzar error para no afectar el flujo principal
        console.error("⚠️ Error eliminando solicitud:", deleteError);
        // El correo ya se envió, este error es secundario
      }
    }

    // ========================================================================
    // 🎉 9. RETORNO DE ÉXITO
    // ========================================================================
    return { 
      ok: true, 
      msg: "Correo enviado y solicitud eliminada correctamente" 
    };

  } catch (err) {
    // ========================================================================
    // 🚨 10. MANEJO DETALLADO DE ERRORES
    // ========================================================================
    console.error("❌ Error completo en enviarRespuesta:", {
      mensaje: err.message,
      solicitudId: solicitud?.id,
      stack: err.stack // Stack trace para debugging
    });

    return { 
      ok: false, 
      msg: err.message
    };
  }
}