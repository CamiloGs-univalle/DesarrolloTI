// src/utils/responderEmail.js
import { collection, updateDoc, doc, deleteDoc } from "firebase/firestore";
import { db } from "../../models/firebase/firebase";

//const URL_APPS_SCRIPT ="http://localhost:8020/proxy/macros/s/AKfycbzzbp9QRUdVwJb-QLI69M4l0cCPExJUYneq7b90mgwzJ1oCQWCDgnyHHQJZ1Exr0UmD/exec";


/**
 * ✅ Enviar respuesta a un correo desde React hacia Google Apps Script.
 * Si el correo existe en un hilo previo, el backend responderá en la misma cola.
 */
// src/models/utils/responderEmail.js
export async function enviarRespuesta(solicitud, respuesta) {
  try {
    const payload = {
      asuntoOriginal: solicitud.asunto, // el asunto original del mensaje
      cuerpo: `
        <p>Buen día.</p>
        <p>${respuesta}</p>
        <p>Quedo atento a cualquier inquietud.<br>Muchas gracias.</p>
      `,
    };

    // 🚀 Enviar al proxy (Vercel), no directamente al Apps Script
    const res = await fetch("/api/proxyEmail", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    console.log("📨 Resultado del proxy:", data);
    return data.success;
  } catch (err) {
    console.error("❌ Error al enviar respuesta:", err);
    return false;
  }
}
