// src/utils/responderEmail.js
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../models/firebase/firebase";

const URL_APPS_SCRIPT = '/api/proxyEmail';

export async function enviarRespuesta(solicitud, textoRespuesta) {
  try {
    // 🧠 Detectar correctamente el nombre del usuario
    const nombreUsuario =
      solicitud["NOMBRE USUARIO"]?.trim() ||
      solicitud.NOMBRE_USUARIO?.trim() ||
      solicitud.nombreUsuario?.trim() ||
      solicitud.solicitante?.trim() ||
      solicitud.usuarioReemplazar?.nombre?.trim() ||
      solicitud["USUARIO ID"]?.trim() ||
      "Desconocido";

    // 🧩 Construir el asunto correcto
    const asunto =
      solicitud.asunto ||
      `Solicitud ${solicitud.tipoSolicitud?.toLowerCase() || "nuevo usuario"} - ${nombreUsuario}`;

    // 📧 Crear el cuerpo con los datos que el Apps Script necesita
    const data = {
      asunto: asunto,
      respuestaHtml: textoRespuesta,
      correoDestino:
        solicitud?.usuarioReemplazar?.correo ||
        solicitud?.correo ||
        solicitud?.CORREO ||
        "auxiliar.ti@proservis.com.co",
      nombreUsuario: nombreUsuario, // 👈 Añadir para debugging
      tipoSolicitud: solicitud.tipoSolicitud || "desconocida"
    };

    console.log("📨 Enviando respuesta:", data);

    // 🚀 Enviar al Apps Script
    const response = await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    // 🔥 CAMBIO CRÍTICO: Mejor manejo de respuestas
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP ${response.status}`);
    }

    const result = await response.json();
    console.log("🔁 Respuesta completa del servidor:", result);

    // ✅ Verificar éxito en la respuesta
    if (!result.success) {
      throw new Error(result.error || "Error al enviar correo");
    }

    // ✅ Eliminar la solicitud solo si el correo se envió correctamente
    if (solicitud.id) {
      try {
        const solicitudRef = doc(db, "solicitudes", solicitud.id);
        await deleteDoc(solicitudRef);
        console.log(`🗑️ Solicitud ${solicitud.id} eliminada correctamente`);
      } catch (deleteError) {
        console.error("⚠️ Error eliminando solicitud:", deleteError);
        // No lanzar error, solo loggear
      }
    }

    return { 
      ok: true, 
      msg: "Correo enviado y solicitud eliminada correctamente" 
    };

  } catch (err) {
    console.error("❌ Error completo al enviar respuesta:", err);
    return { 
      ok: false, 
      msg: err.message,
      stack: err.stack // 👈 Para debugging detallado
    };
  }
}