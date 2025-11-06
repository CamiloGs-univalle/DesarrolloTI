import React, { useEffect, useState } from "react";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../models/firebase/firebase";
import { enviarRespuesta } from "../../../models/utils/responderEmail";
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
    3177151356
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
        // 🔹 1️⃣ ELIMINAR DEFINITIVAMENTE la solicitud de "peticiones"
        await deleteDoc(doc(db, "peticiones", solicitud.id));
        console.log(`✅ Petición ${solicitud.id} eliminada definitivamente de 'peticiones'`);

        // 🔹 2️⃣ DETECTAR SI ES INACTIVACIÓN Y ELIMINAR USUARIO
        const tipoSolicitud = solicitud.tipo?.toLowerCase() ||
          solicitud.tipoSolicitud?.toLowerCase() ||
          "";

        console.log("🔍 Tipo de solicitud detectado:", tipoSolicitud);

        if (tipoSolicitud.includes("inactivacion")) {
          console.log("🗑️ Procesando eliminación de usuario por INACTIVACIÓN");

          // Obtener el NOMBRE COMPLETO del usuario (que es el ID en "usuarios")
          const nombreCompletoUsuario = solicitud?.usuarioReemplazar?.nombre ||
            solicitud?.nombre ||
            solicitud?.["NOMBRE USUARIO"] ||
            solicitud?.solicitante ||
            solicitud?.["NOMBRE / APELLIDO"];

          console.log("🔍 Buscando usuario para eliminar por nombre:", nombreCompletoUsuario);

          if (nombreCompletoUsuario) {
            // 🔍 INTENTAR ELIMINAR DIRECTAMENTE POR ID (nombre completo)
            try {
              await deleteDoc(doc(db, "usuarios", nombreCompletoUsuario.toUpperCase()));
              console.log(`✅ Usuario eliminado directamente por ID: ${nombreCompletoUsuario}`);
            } catch (error) {
              console.log(`⚠️ No se pudo eliminar por ID directo, buscando por consulta...`);

              // 🔍 SI FALLA, BUSCAR POR CÉDULA COMO FALLBACK
              const cedulaUsuario = solicitud?.usuarioReemplazar?.cedula ||
                solicitud?.cedula ||
                solicitud?.CEDULA_USUARIO;

              if (cedulaUsuario) {
                const qCedula = query(
                  collection(db, "usuarios"),
                  where("CEDULA", "==", cedulaUsuario)
                );
                const snapshotCedula = await getDocs(qCedula);

                if (!snapshotCedula.empty) {
                  for (const docUsuario of snapshotCedula.docs) {
                    await deleteDoc(doc(db, "usuarios", docUsuario.id));
                    console.log(`✅ Usuario eliminado por cédula: ${cedulaUsuario} (ID: ${docUsuario.id})`);
                  }
                } else {
                  console.log("⚠️ No se encontró usuario con cédula:", cedulaUsuario);

                  // 🔍 ÚLTIMO INTENTO: BUSCAR POR NOMBRE SIMILAR
                  const qNombre = query(
                    collection(db, "usuarios"),
                    where("NOMBRE / APELLIDO", "==", nombreCompletoUsuario.toUpperCase())
                  );
                  const snapshotNombre = await getDocs(qNombre);

                  if (!snapshotNombre.empty) {
                    for (const docUsuario of snapshotNombre.docs) {
                      await deleteDoc(doc(db, "usuarios", docUsuario.id));
                      console.log(`✅ Usuario eliminado por nombre: ${nombreCompletoUsuario} (ID: ${docUsuario.id})`);
                    }
                  } else {
                    console.log("❌ No se encontró usuario con nombre:", nombreCompletoUsuario);
                  }
                }
              } else {
                console.log("❌ No hay cédula para búsqueda alternativa");
              }
            }
          } else {
            console.log("❌ No se pudo obtener el nombre completo del usuario para eliminar");
          }
        } else {
          console.log("ℹ️ No es inactivación, solo se elimina la petición");
        }

        // 🔹 3️⃣ Notificar al componente padre para actualizar la UI
        if (onEliminada) onEliminada(solicitud.id);

        // 🔹 4️⃣ Limpiar el estado local
        setRespuesta("");
        alert("✅ Correo enviado, solicitud eliminada y usuario inactivado correctamente.");
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