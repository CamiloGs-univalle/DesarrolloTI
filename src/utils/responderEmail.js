// src/utils/responderEmail.js
import { collection, updateDoc, doc } from "firebase/firestore";
import { db } from "../firebase/firebase";

const URL_APPS_SCRIPT =
  "http://localhost:8020/proxy/macros/s/AKfycbzzbp9QRUdVwJb-QLI69M4l0cCPExJUYneq7b90mgwzJ1oCQWCDgnyHHQJZ1Exr0UmD/exec"; // ← reemplaza con tu URL real del Apps Script

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
      respuesta: textoRespuesta,
      correoDestino:
        solicitud?.usuarioReemplazar?.correo ||
        solicitud?.correo ||
        solicitud?.CORREO ||
        "auxiliar.ti@proservis.com.co", // valor por defecto si no hay correo
    };

    console.log("📨 Enviando respuesta:", data);

    // 🚀 Enviar al endpoint Apps Script
    const response = await fetch(URL_APPS_SCRIPT, {
      method: "POST",
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log("🔁 Respuesta del servidor:", result);

    if (!result.ok) {
      throw new Error(result.msg || "Error desconocido al enviar correo");
    }

    // 🗂️ Actualizar estado de la solicitud en Firestore (opcional)
    const solicitudRef = doc(collection(db, "solicitudes"), solicitud.id);
    await updateDoc(solicitudRef, { estado: "RESPONDIDO" });

    return {
      ok: true,
      msg: "Correo enviado correctamente y solicitud actualizada",
    };
  } catch (err) {
    console.error("❌ Error al enviar respuesta:", err);
    return { ok: false, msg: err.message };
  }
}
