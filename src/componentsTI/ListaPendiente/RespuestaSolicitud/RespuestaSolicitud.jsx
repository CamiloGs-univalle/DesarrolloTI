import React, { useEffect, useState } from "react";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../../firebase/firebase"; // ajusta la ruta según tu estructuraS
import { enviarRespuesta } from "../../../utils/responderEmail";

import "./RespuestaSolicitud.css";

export default function RespuestaSolicitud({ solicitud, onEliminada }) {
    const [respuesta, setRespuesta] = useState("");

    useEffect(() => {
        if (solicitud) {
            // 🔹 Extraemos los datos de la solicitud
            const correo =
                solicitud?.usuarioReemplazar?.correo ||
                solicitud?.correo ||
                "CORREO";
            const cedula =
                solicitud?.usuarioReemplazar?.cedula ||
                solicitud?.cedula ||
                solicitud?.CEDULA_USUARIO ||
                "CEDULA";
            const nombre =
                solicitud?.usuarioReemplazar?.nombre ||
                solicitud?.nombre ||
                solicitud?.NOMBRE_USUARIO ||
                "USUARIO";

            // 🔹 Calculamos los 4 últimos dígitos de la cédula (si es válida)
            let ultimos4 = "****";
            if (cedula && cedula.length >= 4) {
                ultimos4 = cedula.slice(-4);
            }

            // 🔹 Texto automático
            const texto = `Buen día.

            Adjunto credenciales del usuario en mención por favor compartir a quien corresponda.

            CORREO: "${correo}"
            CONTRASEÑA:

            HELDESK: "${correo}"
            CONTRASEÑA: "${cedula}"

            TR3: "${correo}"
            CONTRASEÑA: "${cedula}"

            SORTTIME: "${cedula}"
            CONTRASEÑA: "${ultimos4}"`;

            setRespuesta(texto);
        }
    }, [solicitud]);

    // 🧩 función para eliminar el documento en Firestore
     const handleEnviar = async () => {
    if (!solicitud?.id) {
      alert("⚠️ Falta el ID del documento en Firebase.");
      return;
    }

    const ok = await enviarRespuesta(solicitud, respuesta);

    if (ok && onEliminada) {
      onEliminada(solicitud.id);
      setRespuesta("");
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
          Enviar
        </button>
      </div>
    </div>
  );
}