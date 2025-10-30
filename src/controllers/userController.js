// ============================================================================
// 📄 Archivo: guardarPeticionConUsuarioSiNoExiste.js
// ----------------------------------------------------------------------------
// ✅ Su función es:
//   1️⃣ Verificar si un usuario existe (por cédula) y crearlo si no.
//   2️⃣ Guardar la solicitud (petición) en Firebase.
//   3️⃣ Enviar los datos al Apps Script de Google Sheets.
//   4️⃣ 🚫 No eliminar nada todavía — la eliminación se hará cuando TI lo apruebe.
// ----------------------------------------------------------------------------
// 🔧 Dependencias:
// - Firestore (importa doc, setDoc, getDocs, query, where, collection)
// - Módulos locales de Firebase y Apps Script
// ============================================================================

import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { enviarUsuarioAAppsScript } from '../services/UserGoogleExcel';
import { enviarPeticionAAppsScript } from '../services/PeticionGoogleExcel';

// ============================================================================
// 🧩 Función principal: guardarPeticionConUsuarioSiNoExiste
// ============================================================================
export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    // ------------------------------------------------------------
    // 🪪 1️⃣ Normalizar la cédula del usuario (si viene numérica)
    // ------------------------------------------------------------
    const cedulaStr = usuario.cedula?.toString().trim();

    // ------------------------------------------------------------
    // 🔍 2️⃣ Buscar si el usuario ya existe en la colección "usuarios"
    // ------------------------------------------------------------
    const q = query(collection(db, 'usuarios'), where('CEDULA', '==', cedulaStr));
    const snapshot = await getDocs(q);

    let usuarioId;
    let usuarioCreado = false;

    // ------------------------------------------------------------
    // 🧱 3️⃣ Si no existe, crearlo en Firebase y enviar a Google Sheets
    // ------------------------------------------------------------
    if (snapshot.empty) {
      const usuarioFormato = {
        "CARGO": usuario.cargo?.toUpperCase() || "",
        "CEDULA": cedulaStr,
        "CIUDAD": usuario.ciudad?.toUpperCase() || "",
        "CODIGO CARGO": usuario.codigoCargo || "",
        "CODIGO PROCESO": usuario.codigoProceso || "",
        "CORREO": usuario.correo?.toUpperCase() || "",
        "EMPRESA": usuario.empresa?.toUpperCase() || "",
        "ESTADO": "ACTIVO",
        "NOMBRE / APELLIDO": usuario.nombre?.toUpperCase() || "",
        "OBSERVACION": "",
        "PROCESO": usuario.proceso?.toUpperCase() || "",
        "FECHA CREACION": new Date().toISOString(),
      };

      const nombreID = usuarioFormato["NOMBRE / APELLIDO"] || cedulaStr;
      const usuarioRef = doc(db, 'usuarios', nombreID);
      await setDoc(usuarioRef, usuarioFormato);
      usuarioId = usuarioRef.id;
      usuarioCreado = true;

      // 📤 Enviar el nuevo usuario al Apps Script de Google Sheets
      await enviarUsuarioAAppsScript({
        action: 'nuevo_usuario',
        ...usuarioFormato
      });
    } else {
      // ✅ Si ya existe, guardar su ID para vincularlo con la solicitud
      usuarioId = snapshot.docs[0].id;
    }

    // ------------------------------------------------------------
    // 🗓️ 4️⃣ Formatear la fecha de ingreso (día-mes-año)
    // ------------------------------------------------------------
    let fechaFormateada = "";
    if (peticion.fechaIngreso) {
      const partes = peticion.fechaIngreso.split("-");
      if (partes.length === 3) {
        fechaFormateada = (partes[0].length === 4)
          ? `${partes[2]}-${partes[1]}-${partes[0]}`
          : peticion.fechaIngreso;
      } else fechaFormateada = peticion.fechaIngreso;
    } else {
      // Si no se envía fecha, usar la actual
      const ahora = new Date();
      const dia = String(ahora.getDate()).padStart(2, '0');
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const año = ahora.getFullYear();
      fechaFormateada = `${dia}-${mes}-${año}`;
    }

    // ------------------------------------------------------------
    // 🔢 5️⃣ Crear un contador diario para el ID de la solicitud
    // ------------------------------------------------------------
    const peticionesRef = collection(db, 'peticiones');
    const queryDia = query(peticionesRef, where('fechaIngreso', '==', fechaFormateada));
    const snapshotPeticiones = await getDocs(queryDia);
    const contadorFormateado = String(snapshotPeticiones.size + 1).padStart(2, '0');
    const idPeticion = `${fechaFormateada}-${contadorFormateado}`;

    // ------------------------------------------------------------
    // 🧾 6️⃣ Estructura final de la petición
    // ------------------------------------------------------------
    const nuevaPeticion = {
      ...peticion,
      fechaIngreso: fechaFormateada,
      "USUARIO ID": usuarioId,
      "CEDULA USUARIO": cedulaStr,
      "NOMBRE USUARIO": usuario.nombre?.toUpperCase() || "",
      "CARGO": usuario.cargo?.toUpperCase() || "",
      "FECHA": new Date().toISOString(),
      "CONTADOR": contadorFormateado,
      "TIMESTAMP": Date.now(),
      "estado": "PENDIENTE" // 🔸 Siempre inicia como pendiente
    };

    // ------------------------------------------------------------
    // 💾 7️⃣ Guardar la solicitud en la colección "peticiones"
    // ------------------------------------------------------------
    const peticionRef = doc(db, 'peticiones', idPeticion);
    await setDoc(peticionRef, nuevaPeticion);
    console.log(`✅ Petición guardada en Firebase con ID: ${idPeticion}`);

    // ------------------------------------------------------------
    // 📤 8️⃣ Enviar la solicitud al Apps Script (Google Sheets)
    // ------------------------------------------------------------
    const tipo = peticion.tipoSolicitud?.toUpperCase() || "";
    const payload = {
      action: 'nueva_peticion',
      id: idPeticion,
      fechaIngreso: fechaFormateada,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      cargo: usuario.cargo,
      empresa: usuario.empresa,
      ciudad: usuario.ciudad,
      observacion: peticion.observacion || "",
      tipo
    };

    await enviarPeticionAAppsScript(payload);
    console.log(`📤 Petición enviada a Google Sheets con ID: ${idPeticion}`);

    // ------------------------------------------------------------
    // 🚫 9️⃣ No eliminar nada aquí
    // ------------------------------------------------------------
    // Antes, este bloque borraba usuarios y peticiones.
    // Ahora solo registramos el evento para mantener la trazabilidad.
    if (tipo === "INACTIVACION") {
      console.log("📩 Solicitud de INACTIVACION registrada. No se eliminará aún.");
    }

    // ------------------------------------------------------------
    // 🎯 🔟 Devolver resultado exitoso
    // ------------------------------------------------------------
    return {
      success: true,
      message: '✅ Petición guardada correctamente (sin eliminación)',
      usuarioId,
      peticionId: idPeticion,
      usuarioCreado
    };

  } catch (error) {
    // ------------------------------------------------------------
    // ❌ Manejo global de errores
    // ------------------------------------------------------------
    console.error('❌ Error guardando petición o usuario:', error);
    throw new Error(`Error al guardar la petición: ${error.message}`);
  }
}
