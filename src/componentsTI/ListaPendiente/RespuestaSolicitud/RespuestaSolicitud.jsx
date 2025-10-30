// src/components/ListaPendiente/RespuestaSolicitud/RespuestaSolicitud.jsx
import React, { useEffect, useState } from "react";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../firebase/firebase";
import { enviarRespuesta } from "../../../utils/responderEmail";
import "./RespuestaSolicitud.css";

/*
  RespuestaSolicitud
  - recibe 'solicitud' (objeto seleccionado).
  - onEliminada: callback para notificar al padre que elimine de la UI.
*/

export default function RespuestaSolicitud({ solicitud, onEliminada }) {
  const [respuesta, setRespuesta] = useState("");

  useEffect(() => {
    if (!solicitud) return;

    // 1) Extraer correo y cédula con tolerancia a distintos nombres de campos
    const correo =
      solicitud?.usuarioReemplazar?.correo ||
      solicitud?.correo ||
      solicitud?.CORREO ||
      "CORREO";
    const cedula =
      solicitud?.usuarioReemplazar?.cedula ||
      solicitud?.cedula ||
      solicitud?.CEDULA_USUARIO ||
      solicitud?.CEDULA ||
      "CEDULA";

    // 2) Obtener últimos 4 digitos de la cédula
    let ultimos4 = "****";
    if (cedula && String(cedula).length >= 4) {
      ultimos4 = String(cedula).slice(-4);
    }

    // 3) Preparar texto por defecto
    const texto = `Buen día.
Adjunto credenciales del usuario en mención. Por favor compartir a quien corresponda.<br><br>

<p><strong>CORREO:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong></p>

<p><strong>HELPDESK:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong> ${cedula}</p>

<p><strong>TR3:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong> ${cedula}</p>

<p><strong>SORTTIME:</strong> ${correo}</p>
<p><strong>CONTRASEÑA:</strong> ${ultimos4}</p>

<br>
Quedo atento a cualquier inquietud.<br>
Muchas gracias.`;

    setRespuesta(texto);
  }, [solicitud]);

  // ----------------------
  // FUNCION PRINCIPAL
  // ----------------------
  const handleEnviar = async () => {
    // Validación: si no hay solicitud -> salir
    if (!solicitud) {
      alert("⚠️ No hay solicitud seleccionada.");
      return;
    }

    try {
      // 1) Intentar enviar la respuesta por correo (tu función existente)
      const ok = await enviarRespuesta(solicitud, respuesta);

      if (!ok) {
        alert("❌ No se pudo enviar el correo. Revisa la consola.");
        return;
      }

      // 2) BORRADO de la petición en Firestore
      //    - si tenemos solicitud.id -> borrado directo por id
      //    - además intentamos borrar por fecha (fechaIngreso / fecha / FECHA) para
      //      cubrir casos en los que el documento fue creado con id distinto.
      const fechaBuscada = solicitud.fechaIngreso || solicitud.fecha || solicitud.FECHA || solicitud.fechaSolicitud;

      // 2.a) Si existe id, borramos ese doc concreto
      if (solicitud.id) {
        try {
          await deleteDoc(doc(db, "peticiones", solicitud.id)); // borrado directo por id
          console.log(`✅ Petición eliminada por id: ${solicitud.id}`);
        } catch (error) {
          console.warn("⚠️ No se pudo eliminar por id:", error);
        }
      }

      // 2.b) Borrado por fecha: de busca y elimina todos los documentos con fechaIngreso==fechaBuscada
      if (fechaBuscada) {
        try {
          const q = query(collection(db, "peticiones"), where("fechaIngreso", "==", fechaBuscada));
          const snapshot = await getDocs(q);

          // Si no hay resultados con campo fechaIngreso, intentamos campo 'fecha' o 'FECHA'
          if (snapshot.empty) {
            // segunda chance: buscar por campo 'fecha' o 'FECHA'
            const q2 = query(collection(db, "peticiones"), where("fecha", "==", fechaBuscada));
            const snapshot2 = await getDocs(q2);
            for (const docu of snapshot2.docs) {
              await deleteDoc(doc(db, "peticiones", docu.id));
              console.log(`✅ Eliminado por campo 'fecha': ${docu.id}`);
            }
          } else {
            for (const docu of snapshot.docs) {
              await deleteDoc(doc(db, "peticiones", docu.id));
              console.log(`✅ Eliminado por campo 'fechaIngreso': ${docu.id}`);
            }
          }
        } catch (error) {
          console.error("❌ Error borrando por fecha:", error);
        }
      }

      // 3) Si es INACTIVACION -> eliminar usuario de 'usuarios' (como ya tenías)
      const tipo = (solicitud.tipo || solicitud.tipoSolicitud || "").toString().toLowerCase();
      if (tipo === "inactivacion" || tipo === "inactivación") {
        const cedula = solicitud?.usuarioReemplazar?.cedula || solicitud?.cedula || solicitud?.CEDULA_USUARIO || solicitud?.CEDULA;
        if (cedula) {
          try {
            const q = query(collection(db, "usuarios"), where("cedula", "==", cedula));
            const querySnapshot = await getDocs(q);
            for (const docu of querySnapshot.docs) {
              await deleteDoc(doc(db, "usuarios", docu.id));
              console.log(`✅ Usuario con cédula ${cedula} eliminado de 'usuarios'`);
            }
          } catch (error) {
            console.error("❌ Error eliminando usuario tras inactivacion:", error);
          }
        }
      }

      // 4) Avisar al componente padre para actualizar la UI
      if (onEliminada) {
        // Pasamos la fecha para que el padre pueda filtrar por fecha o id
        onEliminada(solicitud.id || { fecha: fechaBuscada });
      }

      setRespuesta("");
      alert("✅ Correo enviado y solicitud eliminada correctamente.");
    } catch (error) {
      console.error("❌ Error al enviar o eliminar:", error);
      alert("❌ Error al enviar o eliminar la solicitud. Revisa la consola.");
    }
  };

  return (
    <div className="respuesta-solicitud">
      <h2>Responder Solicitud</h2>
      <textarea
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        className="campo-respuesta"
        rows={10}
      ></textarea>

      <div className="botones">
        <button className="btn-enviar" onClick={handleEnviar}>
          Enviar y Eliminar
        </button>
      </div>
    </div>
  );
}
