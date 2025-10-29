import React, { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { enviarRespuesta } from "../../../utils/responderEmail";
import "./RespuestaSolicitud.css";

export default function RespuestaSolicitud({ solicitud, onEliminada }) {
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    if (!solicitud) return;

    const correo =
      solicitud?.usuarioReemplazar?.correo ||
      solicitud?.correo ||
      "CORREO";
    const cedula =
      solicitud?.usuarioReemplazar?.cedula ||
      solicitud?.cedula ||
      solicitud?.CEDULA_USUARIO ||
      "CEDULA";

    let ultimos4 = "****";
    if (cedula && cedula.length >= 4) {
      ultimos4 = cedula.slice(-4);
    }

    const texto = `Buen día.
Adjunto credenciales del usuario en mención. Por favor compartir a quien corresponda.<br><br>

<p><strong>CORREO:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong></p>

<p><strong>HELPDESK:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong> ${cedula}</p>

<p><strong>TR3:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong> ${cedula}</p>

<p><strong>SORTTIME:</strong> ${cedula}</p>
<p><strong>CONTRASEÑA:</strong> ${ultimos4}</p>

<br>
Quedo atento a cualquier inquietud.<br>
Muchas gracias.`;

    setRespuesta(texto);
  }, [solicitud]);

  const handleEnviar = async () => {
    if (!solicitud?.id) {
      alert("⚠️ Falta el ID del documento en Firebase.");
      return;
    }

    try {
      const ok = await enviarRespuesta(solicitud, respuesta);

      if (ok) {
        // 🔹 Elimina de Firebase
        await deleteDoc(doc(db, "solicitudes", solicitud.id));

        // 🔹 Actualiza la lista en el componente padre
        if (onEliminada) onEliminada(solicitud.id);

        setRespuesta("");
        alert("✅ Correo enviado y solicitud eliminada correctamente.");
      } else {
        alert("❌ No se pudo enviar el correo. Revisa la consola.");
      }
    } catch (error) {
      console.error("❌ Error al enviar o eliminar:", error);
      alert("❌ Error al enviar o eliminar la solicitud.");
    }
  };

  return (
    <div className="respuesta-solicitud">
      <h2>Responder Solicitud</h2>
      <textarea
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        className="campo-respuesta"
      ></textarea>

      <div className="botones">
        <button className="btn-enviar" onClick={handleEnviar}>
          Enviar y Eliminar
        </button>
      </div>
    </div>
  );
}
