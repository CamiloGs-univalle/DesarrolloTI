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

    // 1️⃣ Verificar si el usuario ya existe
    const q = query(collection(db, 'usuarios'), where('CEDULA', '==', cedulaStr));
    const snapshot = await getDocs(q);

    let usuarioId;
    let usuarioCreado = false;

    if (snapshot.empty) {
      console.log('👤 Usuario NO existe. Creando en Firebase y enviando a Sheets...');

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

      await enviarUsuarioAAppsScript({
        action: 'nuevo_usuario',
        ...usuarioFormato
      });

      console.log('✅ Usuario creado y enviado a Google Sheets:', nombreID);
    } else {
      console.log('✅ Usuario YA existe en Firebase');
      usuarioId = snapshot.docs[0].id;
    }

    /**
     * 2️⃣ FECHA SIN DESFASE
     * Si el usuario envía la fecha manualmente, la usamos directamente (dd-mm-aaaa o yyyy-mm-dd).
     * Si no la envía, usamos la fecha actual.
     */
    let fechaFormateada = "";
    if (peticion.fechaIngreso) {
      // Si viene tipo "2025-10-24" → la convertimos a "24-10-2025"
      const partes = peticion.fechaIngreso.split("-");
      if (partes.length === 3) {
        if (partes[0].length === 4) {
          // formato yyyy-mm-dd
          fechaFormateada = `${partes[2]}-${partes[1]}-${partes[0]}`;
        } else {
          // ya viene como dd-mm-aaaa
          fechaFormateada = peticion.fechaIngreso;
        }
      } else {
        fechaFormateada = peticion.fechaIngreso;
      }
    } else {
      // si no envían fecha, se genera la actual en zona Colombia
      const ahora = new Date();
      const dia = String(ahora.getDate()).padStart(2, '0');
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const año = ahora.getFullYear();
      fechaFormateada = `${dia}-${mes}-${año}`;
    }

    // 🔢 3️⃣ Generar contador por día
    const peticionesRef = collection(db, 'peticiones');
    const queryDia = query(peticionesRef, where('fechaIngreso', '==', fechaFormateada));
    const snapshotPeticiones = await getDocs(queryDia);

    const contador = snapshotPeticiones.size + 1;
    const contadorFormateado = String(contador).padStart(2, '0');

    // 🆔 ID final con formato dd-mm-aaaa-XX
    const idPeticion = `${fechaFormateada}-${contadorFormateado}`;

    // 4️⃣ Crear la petición
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

    // 🗂️ Guardar la petición en Firebase
    const peticionRef = doc(db, 'peticiones', idPeticion);
    await setDoc(peticionRef, nuevaPeticion);

    // 📤 Enviar a Google Sheets
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
