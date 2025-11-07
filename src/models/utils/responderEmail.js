// src/utils/responderEmail.js
import { collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../models/firebase/firebase";

//const URL_APPS_SCRIPT ="http://localhost:8020/proxy/macros/s/AKfycbzzbp9QRUdVwJb-QLI69M4l0cCPExJUYneq7b90mgwzJ1oCQWCDgnyHHQJZ1Exr0UmD/exec";


/**
 * ✅ Enviar respuesta a un correo desde React hacia Google Apps Script.
 * Si el correo existe en un hilo previo, el backend responderá en la misma cola.
 */

export async function enviarRespuesta(solicitud, respuesta) {
  try {
    const correoDestino =
      solicitud?.correo ||
      solicitud?.usuarioReemplazar?.correo ||
      solicitud?.CORREO ||
      "";

    const asunto = `Respuesta - ${solicitud.tipo || solicitud.tipoSolicitud || "Solicitud TI"}`;

    const payload = {
      correoDestino,
      asunto,
      cuerpo: respuesta,
    };

    // 🔹 Cambia la URL por la de tu Apps Script publicado como Web App
    const URL_APPS_SCRIPT = '/api/proxyEmail';
    
    const res = await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📩 Respuesta del servidor:", data);

    return data.success === true;
  } catch (error) {
    console.error("❌ Error enviando respuesta:", error);
    return false;
  }
}
