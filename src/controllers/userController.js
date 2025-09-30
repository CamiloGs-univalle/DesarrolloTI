// controllers/guardarPeticionConUsuarioSiNoExiste.js
import { doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

// 🔁 Importamos las funciones para enviar a Google Sheets
import { enviarUsuarioAAppsScript } from '../services/UserGoogleExcel';
import { enviarPeticionAAppsScript } from '../services/PeticionGoogleExcel';

/**
 * Guarda una petición en Firestore y la envía a Google Sheets.
 * Si el usuario no existe, lo crea y lo envía también.
 *
 * @param {Object} usuario - Datos del usuario (nombre, cedula, correo, cargo, etc)
 * @param {Object} peticion - Datos de la petición (equipo, sistemas, comentario, etc)
 */
export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    console.log('📌 Iniciando proceso: Verificando usuario con cédula:', usuario.cedula);

    // 1️⃣ VERIFICAR SI EL USUARIO YA EXISTE EN FIRESTORE
    const q = query(collection(db, 'usuarios'), where('cedula', '==', usuario.cedula));
    const snapshot = await getDocs(q);

    let usuarioId;
    let usuarioCreado = false;

    if (snapshot.empty) {
      console.log('👤 Usuario NO existe. Creando en Firebase y enviando a Sheets...');

      // 2️⃣ GUARDAR NUEVO USUARIO EN FIREBASE
      const nombreID = usuario.nombre.toUpperCase().replace(/\s+/g, ' ');
      const usuarioRef = doc(db, 'usuarios', nombreID);
      
      // Datos completos del usuario INCLUYENDO CARGO
      const usuarioCompleto = {
        ...usuario,
        fechaCreacion: new Date().toISOString(),
        estado: 'ACTIVO'
      };
      
      await setDoc(usuarioRef, usuarioCompleto);
      usuarioId = usuarioRef.id;
      usuarioCreado = true;

      // 2️⃣.1 ENVIAR USUARIO A GOOGLE SHEETS (CON CARGO)
      await enviarUsuarioAAppsScript({
        action: 'nuevo_usuario',
        cedula: usuario.cedula,
        nombre: usuario.nombre,
        correo: usuario.correo,
        cargo: usuario.cargo, // ✅ CARGO INCLUIDO
        empresa: usuario.empresa || '',
        ciudad: usuario.ciudad || '',
        estado: 'ACTIVO',
        observacion: 'Creado desde formulario'
      });
      console.log('✅ Usuario enviado a Google Sheets con cargo:', usuario.cargo);
      
    } else {
      console.log('✅ Usuario YA existe en Firebase');
      usuarioId = snapshot.docs[0].id;
    }

    // 3️⃣ PREPARAR DATOS COMPLETOS DE LA PETICIÓN (INCLUYENDO CARGO)
    const nuevaPeticion = {
      ...peticion,
      usuarioId: usuarioId,
      cedulaUsuario: usuario.cedula,
      nombreUsuario: usuario.nombre,
      cargo: usuario.cargo || peticion.cargoNuevo?.cargo || peticion.usuarioReemplazar?.equipo || '',
      fecha: new Date().toISOString(),
      timestamp: Date.now()
    };

    // 3️⃣.1 GUARDAR PETICIÓN EN FIRESTORE
    const peticionRef = await addDoc(collection(db, 'peticiones'), nuevaPeticion);
    console.log('✅ Petición guardada en Firestore con ID:', peticionRef.id);

    // 3️⃣.2 ENVIAR PETICIÓN A GOOGLE SHEETS
    await enviarPeticionAAppsScript({
      action: 'nueva_peticion',
      ...nuevaPeticion
    });
    console.log('✅ Petición enviada a Google Sheets');

    // 4️⃣ RETORNAR RESULTADO EXITOSO
    return {
      success: true,
      message: 'Petición guardada correctamente en Firebase y enviada a Google Sheets',
      usuarioId: usuarioId,
      peticionId: peticionRef.id,
      usuarioCreado: usuarioCreado,
      cargo: nuevaPeticion.cargo
    };

  } catch (error) {
    console.error('❌ Error guardando petición o usuario:', error);
    
    // 5️⃣ RETORNAR ERROR DETALLADO
    throw new Error(`Error al guardar la petición: ${error.message}`);
  }
}