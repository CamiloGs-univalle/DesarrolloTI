import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { enviarAFirebaseAAppsScript } from '../services/googleSheetsService';

/**
 * Guarda una petición en Firestore, verificando primero si el usuario existe.
 * Si no existe en la colección 'usuarios', lo crea y lo manda a Google Sheets.
 * Luego guarda la petición en la colección 'peticiones' con referencia al usuario.
 * 
 * @param {Object} usuario - Datos del usuario (nombre, cedula, correo)
 * @param {Object} peticion - Datos de la petición (equipo, sistemas, comentario)
 */
export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    console.log('🚀 Verificando usuario con cédula:', usuario.cedula);

    // 1️⃣ Verificar si ya existe el usuario en 'usuarios'
    const q = query(
      collection(db, 'usuarios'),
      where('cedula', '==', usuario.cedula)
    );
    const snapshot = await getDocs(q);

    let usuarioId;

    if (snapshot.empty) {
      console.log('👤 Usuario NO existe. Creando en Firebase y enviando a Sheets...');

      // 2️⃣ No existe → Guardar en Firebase
      const usuarioRef = await addDoc(collection(db, 'usuarios'), usuario);
      usuarioId = usuarioRef.id;
      console.log('✅ Usuario creado con ID:', usuarioId);

      // 2️⃣.1 También enviarlo a Google Sheets
      await enviarAFirebaseAAppsScript(usuario);
    } else {
      console.log('✅ Usuario YA existe en Firebase');
      usuarioId = snapshot.docs[0].id;
    }

    // 3️⃣ Guardar la petición en 'peticiones'
    const nuevaPeticion = {
      ...peticion,
      usuarioId,
      fecha: new Date().toISOString(),
    };

    await addDoc(collection(db, 'peticiones'), nuevaPeticion);
    console.log('✅ Petición guardada en Firestore');

    alert('✅ Petición guardada correctamente en Firebase');

  } catch (error) {
    console.error('❌ Error guardando la petición:', error);
    alert('❌ Error guardando la petición. Revisa la consola.');
  }
}
