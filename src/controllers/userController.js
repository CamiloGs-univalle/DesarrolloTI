import { doc, setDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { enviarUsuarioAAppsScript } from '../services/UserGoogleExcel';
import { enviarPeticionAAppsScript } from '../services/PeticionGoogleExcel';

/**
 * Guarda una petición en Firestore y, según el tipo, la envía a Google Sheets.
 * Si el usuario no existe, lo crea y lo envía también a Sheets.
 * 
 * ⚙️ Lógica adicional:
 * - Las peticiones de tipo "INACTIVACION" y "USUARIO Y EQUIPO" se eliminan de Firebase tras ser enviadas.
 */
export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    const cedulaStr = usuario.cedula?.toString().trim();
    console.log('📌 Verificando usuario con CÉDULA:', cedulaStr);

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

      // Enviar usuario nuevo a Google Sheets
      await enviarUsuarioAAppsScript({
        action: 'nuevo_usuario',
        ...usuarioFormato
      });

      console.log('✅ Usuario creado y enviado a Google Sheets:', nombreID);
    } else {
      usuarioId = snapshot.docs[0].id;
      console.log('✅ Usuario YA existe en Firebase');
    }

    // 2️⃣ Normalizar fecha (dd-mm-yyyy)
    let fechaFormateada = "";
    if (peticion.fechaIngreso) {
      const partes = peticion.fechaIngreso.split("-");
      if (partes.length === 3) {
        fechaFormateada = (partes[0].length === 4)
          ? `${partes[2]}-${partes[1]}-${partes[0]}`
          : peticion.fechaIngreso;
      } else fechaFormateada = peticion.fechaIngreso;
    } else {
      const ahora = new Date();
      const dia = String(ahora.getDate()).padStart(2, '0');
      const mes = String(ahora.getMonth() + 1).padStart(2, '0');
      const año = ahora.getFullYear();
      fechaFormateada = `${dia}-${mes}-${año}`;
    }

    // 3️⃣ Generar contador diario
    const peticionesRef = collection(db, 'peticiones');
    const queryDia = query(peticionesRef, where('fechaIngreso', '==', fechaFormateada));
    const snapshotPeticiones = await getDocs(queryDia);
    const contadorFormateado = String(snapshotPeticiones.size + 1).padStart(2, '0');

    // 🆔 ID final (ej: 29-10-2025-03)
    const idPeticion = `${fechaFormateada}-${contadorFormateado}`;

    // 4️⃣ Estructura final de la petición
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
      "estado": "PENDIENTE"
    };

    // 🗂️ 5️⃣ Guardar en Firebase
    const peticionRef = doc(db, 'peticiones', idPeticion);
    await setDoc(peticionRef, nuevaPeticion);
    console.log(`✅ Petición guardada temporalmente en Firebase con ID: ${idPeticion}`);

    // 🧩 6️⃣ Detectar el tipo de solicitud
    const tipo = peticion.tipoSolicitud?.toUpperCase() || "";

    // 🚫 Si es "INACTIVACION" o "USUARIO Y EQUIPO"
    if (tipo === "INACTIVACION" || tipo === "USUARIO Y EQUIPO") {
      console.log(`⚠️ Petición de tipo "${tipo}" detectada.`);

      // ✅ Enviar primero a Sheets
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
        tipo: tipo
      });

      console.log(`📤 Petición ${tipo} enviada correctamente a Google Sheets.`);

      // 🧹 Eliminar de Firebase después de enviarla
      try {
        await deleteDoc(doc(db, "peticiones", idPeticion));
        console.log(`🗑️ Petición "${idPeticion}" eliminada correctamente de Firebase.`);
      } catch (error) {
        console.error("❌ Error al eliminar la petición de Firebase:", error);
      }
    } else {
      // 🟢 7️⃣ Otros tipos (solo enviar a Sheets)
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
        tipo: tipo || "OTRO"
      });

      console.log('✅ Petición enviada a Google Sheets con ID:', idPeticion);
    }

    return {
      success: true,
      message: 'Petición guardada y procesada correctamente',
      usuarioId,
      peticionId: idPeticion,
      usuarioCreado
    };

  } catch (error) {
    console.error('❌ Error guardando petición o usuario:', error);
    throw new Error(`Error al guardar la petición: ${error.message}`);
  }
}
