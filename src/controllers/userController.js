// controllers/guardarPeticionConUsuarioSiNoExiste.js
import { doc, setDoc, collection, addDoc, getDocs, query, where } from 'firebase/firestore';
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

    // 3️⃣ Crear la petición con formato uniforme
    const nuevaPeticion = {
      ...peticion,
      "USUARIO ID": usuarioId,
      "CEDULA USUARIO": cedulaStr,
      "NOMBRE USUARIO": usuario.nombre?.toUpperCase() || "",
      "CARGO": usuario.cargo?.toUpperCase() || "",
      "FECHA": new Date().toISOString(),
      "TIMESTAMP": Date.now(),
    };

    // 🗂️ Guardar la petición
    const peticionRef = await addDoc(collection(db, 'peticiones'), nuevaPeticion);
    console.log('✅ Petición guardada en Firestore con ID:', peticionRef.id);

    // 📤 Enviar la petición a Google Sheets
    await enviarPeticionAAppsScript({
      action: 'nueva_peticion',
      ...nuevaPeticion
    });
    console.log('✅ Petición enviada a Google Sheets');

    // 4️⃣ Retornar resultado
    return {
      success: true,
      message: 'Petición y usuario guardados correctamente en Firestore y Sheets',
      usuarioId,
      peticionId: peticionRef.id,
      usuarioCreado
    };

  } catch (error) {
    console.error('❌ Error guardando petición o usuario:', error);
    throw new Error(`Error al guardar la petición: ${error.message}`);
  }
}
