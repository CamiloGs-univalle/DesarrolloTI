// controllers/guardarPeticionConUsuarioSiNoExiste.js
import { doc, setDoc, collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase/firebase';

// 🔁 Funciones para enviar datos a Google Sheets
import { enviarUsuarioAAppsScript } from '../services/UserGoogleExcel';
import { enviarPeticionAAppsScript } from '../services/PeticionGoogleExcel';

/**
 * Guarda una petición en Firestore y la envía a Google Sheets.
 * Si el usuario no existe, lo crea con formato EXACTO al de la hoja.
 */
export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    const cedulaStr = usuario.cedula?.toString().trim();
    console.log('📌 Verificando usuario con CEDULA:', cedulaStr);

    // 1️⃣ Verificar si el usuario ya existe (usando "CEDULA" en mayúsculas)
    const q = query(collection(db, 'usuarios'), where('CEDULA', '==', cedulaStr));
    const snapshot = await getDocs(q);

    let usuarioId;
    let usuarioCreado = false;

    if (snapshot.empty) {
      console.log('👤 Usuario NO existe. Creando en Firebase y enviando a Sheets...');

      // 2️⃣ Crear usuario con formato idéntico al de tu hoja
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

      // 🗂️ Guardar el documento en Firestore
      const nombreID = usuarioFormato["NOMBRE / APELLIDO"];
      const usuarioRef = doc(db, 'usuarios', nombreID);
      await setDoc(usuarioRef, usuarioFormato);

      usuarioId = usuarioRef.id;
      usuarioCreado = true;

      // 📤 Enviar el usuario también a Google Sheets
      await enviarUsuarioAAppsScript({
        action: 'nuevo_usuario',
        ...usuarioFormato
      });

      console.log('✅ Usuario creado y enviado a Google Sheets:', nombreID);
    } else {
      console.log('✅ Usuario YA existe en Firebase');
      usuarioId = snapshot.docs[0].id;
    }

    // 🗓️ 3️⃣ Ajustar la fecha a la zona horaria local (UTC-5)
    const fechaOriginal = new Date(peticion.fechaIngreso || Date.now());
    const offsetMs = fechaOriginal.getTimezoneOffset() * 60 * 1000; // diferencia en milisegundos
    const fechaLocal = new Date(fechaOriginal.getTime() - offsetMs); // convierte a hora local

    const dia = String(fechaLocal.getDate()).padStart(2, '0');
    const mes = String(fechaLocal.getMonth() + 1).padStart(2, '0');
    const año = fechaLocal.getFullYear();
    const fechaFormateada = `${dia}-${mes}-${año}`;

    // 🔢 4️⃣ Generar contador para las peticiones del mismo día
    const peticionesRef = collection(db, 'peticiones');
    const queryDia = query(peticionesRef, where('fechaIngreso', '==', fechaFormateada));
    const snapshotPeticiones = await getDocs(queryDia);

    const contador = snapshotPeticiones.size + 1; // siguiente número del día
    const contadorFormateado = String(contador).padStart(2, '0'); // 🔹 solo 2 dígitos (01, 02, 03)

    // 🆔 ID final con fecha + contador (ejemplo: 23-10-2025-01)
    const idPeticion = `${fechaFormateada}-${contadorFormateado}`;

    // 5️⃣ Crear la petición con formato uniforme
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
    };

    // 🗂️ Guardar la petición (ID = fecha + contador)
    const peticionRef = doc(db, 'peticiones', idPeticion);
    await setDoc(peticionRef, nuevaPeticion);

    // 📤 Enviar la petición a Google Sheets
    await enviarPeticionAAppsScript({
      action: 'nueva_peticion',
      fechaIngreso: fechaFormateada,
      cedula: usuario.cedula,
      nombre: usuario.nombre,
      correo: usuario.correo,
      cargo: usuario.cargo,
      empresa: usuario.empresa,
      ciudad: usuario.ciudad,
      observacion: peticion.observacion || "",
      id: idPeticion,
      tipo: 'USUARIO Y EQUIPO',
    });

    console.log('✅ Petición enviada a Google Sheets con ID:', idPeticion);

    // 6️⃣ Retornar resultado
    return {
      success: true,
      message: 'Petición y usuario guardados correctamente en Firestore y Sheets',
      usuarioId,
      peticionId: idPeticion,
      usuarioCreado
    };

  } catch (error) {
    console.error('❌ Error guardando petición o usuario:', error);
    throw new Error(`Error al guardar la petición: ${error.message}`);
  }
}
