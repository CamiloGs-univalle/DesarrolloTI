// ============================================================================
// 📄 ARCHIVO: src/components/RespuestaSolicitud.js
// 🎯 PROPÓSITO: Componente React para responder y gestionar solicitudes
// 🔗 DEPENDENCIAS: Firebase, utilitario de correo
// ============================================================================

import React, { useEffect, useState } from "react";
// Importar funciones de Firebase Firestore
import { doc, deleteDoc, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "../../../models/firebase/firebase";
// Importar función utilitaria para enviar correos
import { enviarRespuesta } from "../../../models/utils/responderEmail";
import "./RespuestaSolicitud.css";

/**
 * 🎯 Componente principal para responder solicitudes
 * @param {Object} props - Propiedades del componente
 * @param {Object} props.solicitud - Datos de la solicitud a procesar
 * @param {Function} props.onEliminada - Callback al eliminar solicitud
 */
export default function RespuestaSolicitud({ solicitud, onEliminada }) {
  // ==========================================================================
  // 🎯 1. DECLARACIÓN DE ESTADOS DEL COMPONENTE
  // ==========================================================================
  const [respuesta, setRespuesta] = useState("");        // Texto de respuesta
  const [enviando, setEnviando] = useState(false);       // Estado de envío

  // ==========================================================================
  // 🔄 2. EFFECT PARA GENERAR PLANTILLA AUTOMÁTICA
  // ==========================================================================
  useEffect(() => {
    // Si no hay solicitud, no hacer nada
    if (!solicitud) return;

    console.log("🔄 Generando plantilla para solicitud:", solicitud.id);

    // ========================================================================
    // 📧 2.1 EXTRACCIÓN DE DATOS PARA LA PLANTILLA
    // ========================================================================
    const correo =
      solicitud?.usuarioReemplazar?.correo || // Correo de usuario a reemplazar
      solicitud?.correo ||                    // Correo directo
      "CORREO NO DISPONIBLE";                 // Valor por defecto

    const cedula =
      solicitud?.usuarioReemplazar?.cedula || // Cédula de usuario a reemplazar  
      solicitud?.cedula ||                    // Cédula directa
      solicitud?.CEDULA_USUARIO ||            // Cédula en formato mayúsculas
      "CEDULA NO DISPONIBLE";                 // Valor por defecto

    // ========================================================================
    // 🔒 2.2 GENERACIÓN DE MÁSCARA PARA CÉDULA (últimos 4 dígitos)
    // ========================================================================
    let ultimos4 = "****";
    if (cedula && cedula.length >= 4 && cedula !== "CEDULA NO DISPONIBLE") {
      ultimos4 = cedula.slice(-4); // Extraer últimos 4 caracteres
    }

    // ========================================================================
    // 📝 2.3 CONSTRUCCIÓN DE LA PLANTILLA HTML
    // ========================================================================
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

    // ========================================================================
    // 💾 2.4 ACTUALIZACIÓN DEL ESTADO CON LA PLANTILLA
    // ========================================================================
    setRespuesta(texto);
    console.log("✅ Plantilla generada exitosamente");

  }, [solicitud]); // Se ejecuta cuando cambia la solicitud

  // ==========================================================================
  // 📧 3. FUNCIÓN PRINCIPAL PARA ENVIAR CORREO Y PROCESAR SOLICITUD
  // ==========================================================================
  const handleEnviar = async () => {
    // 🛡️ Validación básica - Verificar que existe ID de solicitud
    if (!solicitud?.id) {
      alert("⚠️ Falta el ID del documento en Firebase.");
      return;
    }

    // 🛡️ Evitar envíos duplicados
    if (enviando) return;
    
    // 🎯 Iniciar estado de envío
    setEnviando(true);

    try {
      console.log("🚀 Iniciando proceso completo para solicitud:", solicitud.id);

      // ======================================================================
      // 📧 3.1 ENVÍO DEL CORREO ELECTRÓNICO
      // ======================================================================
      const resultado = await enviarRespuesta(solicitud, respuesta);
      
      // ❌ Si hay error en el envío, detener el proceso
      if (!resultado.ok) {
        throw new Error(resultado.msg);
      }

      console.log("✅ Correo enviado, procediendo a eliminar solicitud...");

      // ======================================================================
      // 🗑️ 3.2 ELIMINACIÓN DE LA SOLICITUD EN FIRESTORE
      // ======================================================================
      // 🔥 IMPORTANTE: Usar la MISMA colección en todos los archivos
      const COLECCION_SOLICITUDES = "peticiones"; // ⚠️ CAMBIAR si usas "solicitudes"
      
      await deleteDoc(doc(db, COLECCION_SOLICITUDES, solicitud.id));
      console.log(`✅ Solicitud ${solicitud.id} eliminada de '${COLECCION_SOLICITUDES}'`);

      // ======================================================================
      // 🔄 3.3 PROCESAMIENTO DE INACTIVACIÓN (si aplica)
      // ======================================================================
      const tipoSolicitud = solicitud.tipo?.toLowerCase() ||
        solicitud.tipoSolicitud?.toLowerCase() ||
        "";

      console.log("🔍 Tipo de solicitud detectado:", tipoSolicitud);

      // Si es una solicitud de inactivación, eliminar usuario también
      if (tipoSolicitud.includes("inactivacion")) {
        await procesarInactivacion(solicitud);
      }

      // ======================================================================
      // 📢 3.4 NOTIFICACIÓN Y LIMPIEZA
      // ======================================================================
      // Notificar al componente padre para actualizar la UI
      if (onEliminada) onEliminada(solicitud.id);
      
      // Limpiar el campo de respuesta
      setRespuesta("");
      
      // Notificar éxito al usuario
      alert("✅ Correo enviado y solicitud procesada correctamente.");

    } catch (error) {
      // ======================================================================
      // 🚨 3.5 MANEJO DE ERRORES DETALLADO
      // ======================================================================
      console.error("❌ Error en el proceso completo:", {
        error: error.message,
        solicitudId: solicitud.id,
        stack: error.stack
      });
      alert(`❌ Error: ${error.message}`);
    } finally {
      // ======================================================================
      // 🔄 3.6 LIMPIEZA FINAL (siempre se ejecuta)
      // ======================================================================
      setEnviando(false); // Restablecer estado de envío
    }
  };

  // ==========================================================================
  // 🗑️ 4. FUNCIÓN PARA PROCESAR INACTIVACIÓN DE USUARIOS
  // ==========================================================================
  /**
   * Procesa la eliminación de usuarios cuando la solicitud es de inactivación
   * @param {Object} solicitud - Datos de la solicitud con información del usuario
   */
  const procesarInactivacion = async (solicitud) => {
    try {
      console.log("🗑️ Procesando eliminación de usuario por INACTIVACIÓN");

      // ======================================================================
      // 👤 4.1 EXTRACCIÓN DEL NOMBRE COMPLETO DEL USUARIO
      // ======================================================================
      const nombreCompletoUsuario = 
        solicitud?.usuarioReemplazar?.nombre ||    // Nombre en objeto anidado
        solicitud?.nombre ||                       // Nombre directo
        solicitud?.["NOMBRE USUARIO"] ||           // Nombre con espacio
        solicitud?.solicitante ||                  // Campo genérico
        solicitud?.["NOMBRE / APELLIDO"];          // Nombre con formato específico

      console.log("🔍 Buscando usuario para eliminar:", nombreCompletoUsuario);

      // 🛡️ Validar que tenemos un nombre para buscar
      if (!nombreCompletoUsuario) {
        console.log("❌ No se pudo obtener nombre del usuario");
        return;
      }

      // ======================================================================
      // 🎯 4.2 INTENTO 1: ELIMINACIÓN DIRECTA POR ID (nombre completo)
      // ======================================================================
      try {
        await deleteDoc(doc(db, "usuarios", nombreCompletoUsuario.toUpperCase()));
        console.log(`✅ Usuario eliminado por ID: ${nombreCompletoUsuario}`);
        return; // Si funciona, salir de la función
      } catch (error) {
        console.log("⚠️ No se pudo eliminar por ID directo, buscando por otros métodos...");
      }

      // ======================================================================
      // 🔍 4.3 INTENTO 2: BÚSQUEDA Y ELIMINACIÓN POR CÉDULA
      // ======================================================================
      const cedulaUsuario = solicitud?.usuarioReemplazar?.cedula ||
        solicitud?.cedula ||
        solicitud?.CEDULA_USUARIO;

      if (cedulaUsuario) {
        console.log("🔍 Buscando usuario por cédula:", cedulaUsuario);
        
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
          return; // Usuario encontrado y eliminado
        } else {
          console.log("ℹ️ No se encontró usuario con cédula:", cedulaUsuario);
        }
      }

      // ======================================================================
      // 🔍 4.4 INTENTO 3: BÚSQUEDA Y ELIMINACIÓN POR NOMBRE
      // ======================================================================
      console.log("🔍 Buscando usuario por nombre:", nombreCompletoUsuario);
      
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
        console.log("❌ No se encontró usuario para eliminar con nombre:", nombreCompletoUsuario);
      }

    } catch (error) {
      // ======================================================================
      // 🚨 4.5 MANEJO DE ERRORES EN INACTIVACIÓN
      // ======================================================================
      console.error("⚠️ Error en el proceso de inactivación:", error);
      // No lanzar error para no afectar el flujo principal del envío
    }
  };

  // ==========================================================================
  // 🎨 5. RENDERIZADO DEL COMPONENTE
  // ==========================================================================
  return (
    <div className="respuesta-solicitud">
      {/* 📝 Título del componente */}
      <h2>Responder Solicitud</h2>
      
      {/* 📝 Campo de texto para la respuesta */}
      <textarea
        value={respuesta}
        onChange={(e) => setRespuesta(e.target.value)}
        className="campo-respuesta"
        rows="15"
        placeholder="Escribe o modifica la respuesta aquí..."
      ></textarea>

      {/* 🔘 Botón de acción */}
      <div className="botones">
        <button 
          className="btn-enviar" 
          onClick={handleEnviar}
          disabled={enviando}
        >
          {enviando ? "📤 Enviando..." : "📧 Enviar y Eliminar"}
        </button>
      </div>
    </div>
  );
} 