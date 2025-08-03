// controllers/guardarPeticionConUsuarioSiNoExiste.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// 🔁 Importamos cada función con nombre diferente para que no se pisen
import { enviarUsuarioAAppsScript as enviarUsuarioASheets } from '../services/UserGoogleExcel';
import { enviarPeticionAAppsScript as enviarPeticionASheets } from '../services/PeticionGoogleExcel';

/**
 * Guarda una petición en Firestore y la envía a Google Sheets.
 * Si el usuario no existe, lo crea y lo envía también.
 *
 * @param {Object} usuario - Datos del usuario (nombre, cedula, correo, etc)
 * @param {Object} peticion - Datos de la petición (equipo, sistemas, comentario, etc)
 */
export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    console.log('📌 Verificando usuario con cédula:', usuario.cedula);

    // 1️⃣ Verificar si el usuario ya existe
    const q = query(collection(db, 'usuarios'), where('cedula', '==', usuario.cedula));
    const snapshot = await getDocs(q);

    let usuarioId;

    if (snapshot.empty) {
      console.log('👤 Usuario NO existe. Creando en Firebase y enviando a Sheets...');

      // 2️⃣ Guardar nuevo usuario en Firebase
      const nombreID = usuario.nombre.toUpperCase().replace(/\s+/g, '_');

      const usuarioRef = doc(db, 'usuarios', nombreID); // 👉 usamos el nombre como ID
      await setDoc(usuarioRef, usuario);
      usuarioId = usuarioRef.id;

      // 2️⃣.1 También enviarlo a Google Sheets
      await enviarUsuarioASheets({
        action: 'nuevo_usuario',
        ...usuario,
      });
    } else {
      console.log('✅ Usuario YA existe en Firebase');
      usuarioId = snapshot.docs[0].id;
    }

    // 3️⃣ Guardar la petición en Firebase
    const nuevaPeticion = {
      ...peticion,
      usuarioId,
      fecha: new Date().toISOString(),
    };

    await addDoc(collection(db, 'peticiones'), nuevaPeticion);
    console.log('✅ Petición guardada en Firestore');

    // 3️⃣.1 También enviarla a Google Sheets
    await enviarPeticionASheets({
      action: 'nueva_peticion',
      ...peticion,
    });

    alert('✅ Petición guardada correctamente en Firebase y enviada a Google Sheets');

  } catch (error) {
    console.error('❌ Error guardando petición o usuario:', error);
    alert('❌ Error guardando la petición. Revisa la consola.');
  }
}
