import React, { useEffect, useState } from "react";
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../models/firebase/firebase";
import { enviarRespuesta } from "../../../models/utils/responderEmail";
import "./RespuestaSolicitud.css";


export default function RespuestaSolicitud({ solicitud, onEliminada }) {
  const [respuesta, setRespuesta] = useState("");
  const [enviando, setEnviando] = useState(false);

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

    if (enviando) return;
    setEnviando(true);

    try {
      console.log("🚀 Iniciando envío para solicitud:", solicitud.id);

      // 1️⃣ ENVIAR CORREO
      const resultado = await enviarRespuesta(solicitud, respuesta);
      
      if (!resultado.ok) {
        throw new Error(resultado.msg);
      }

      console.log("✅ Correo enviado, procediendo a eliminar solicitud...");

      // 2️⃣ ELIMINAR SOLICITUD - USAR MISMA COLECCIÓN
      // 🔥 DECIDE: ¿Usas "peticiones" o "solicitudes"? Elige una:
      const COLECCION_SOLICITUDES = "peticiones"; // O "solicitudes" - DEBE SER LA MISMA EN TODOS LADOS
      
      await deleteDoc(doc(db, COLECCION_SOLICITUDES, solicitud.id));
      console.log(`✅ Solicitud ${solicitud.id} eliminada de '${COLECCION_SOLICITUDES}'`);

      // 3️⃣ PROCESAR INACTIVACIÓN SI CORRESPONDE
      const tipoSolicitud = solicitud.tipo?.toLowerCase() ||
        solicitud.tipoSolicitud?.toLowerCase() ||
        "";

      console.log("🔍 Tipo de solicitud detectado:", tipoSolicitud);

      if (tipoSolicitud.includes("inactivacion")) {
        await procesarInactivacion(solicitud);
      }

      // 4️⃣ NOTIFICAR ÉXITO
      if (onEliminada) onEliminada(solicitud.id);
      
      setRespuesta("");
      alert("✅ Correo enviado y solicitud procesada correctamente.");

    } catch (error) {
      console.error("❌ Error completo:", error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  // Función separada para inactivación
  const procesarInactivacion = async (solicitud) => {
    try {
      console.log("🗑️ Procesando eliminación de usuario por INACTIVACIÓN");

      const nombreCompletoUsuario = 
        solicitud?.usuarioReemplazar?.nombre ||
        solicitud?.nombre ||
        solicitud?.["NOMBRE USUARIO"] ||
        solicitud?.solicitante ||
        solicitud?.["NOMBRE / APELLIDO"];

      console.log("🔍 Buscando usuario para eliminar:", nombreCompletoUsuario);

      if (!nombreCompletoUsuario) {
        console.log("❌ No se pudo obtener nombre del usuario");
        return;
      }

      // Intentar eliminar directamente por ID
      try {
        await deleteDoc(doc(db, "usuarios", nombreCompletoUsuario.toUpperCase()));
        console.log(`✅ Usuario eliminado por ID: ${nombreCompletoUsuario}`);
        return;
      } catch (error) {
        console.log("⚠️ No se pudo eliminar por ID directo, buscando...");
      }

      // Búsqueda por cédula
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
            console.log(`✅ Usuario eliminado por cédula: ${cedulaUsuario}`);
          }
          return;
        }
      }

      // Búsqueda por nombre
      const qNombre = query(
        collection(db, "usuarios"),
        where("NOMBRE / APELLIDO", "==", nombreCompletoUsuario.toUpperCase())
      );
      const snapshotNombre = await getDocs(qNombre);

      if (!snapshotNombre.empty) {
        for (const docUsuario of snapshotNombre.docs) {
          await deleteDoc(doc(db, "usuarios", docUsuario.id));
          console.log(`✅ Usuario eliminado por nombre: ${nombreCompletoUsuario}`);
        }
      } else {
        console.log("❌ No se encontró usuario para eliminar");
      }

    } catch (error) {
      console.error("⚠️ Error en inactivación:", error);
      // No lanzar error para no afectar el flujo principal
    }
  };

  return (
    <div className="respuesta-solicitud">
      <h2>Responder Solicitud</h2>
      <textarea
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        className="campo-respuesta"
        rows="15"
      ></textarea>

      <div className="botones">
        <button 
          className="btn-enviar" 
          onClick={handleEnviar}
          disabled={enviando}
        >
          {enviando ? "Enviando..." : "Enviar y Eliminar"}
        </button>
      </div>
    </div>
  );
}