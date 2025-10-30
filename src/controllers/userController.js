// guardarPeticionConUsuarioSiNoExiste.js
import { doc, setDoc, collection, getDocs, query, where, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { enviarUsuarioAAppsScript } from '../services/UserGoogleExcel';
import { enviarPeticionAAppsScript } from '../services/PeticionGoogleExcel';

export async function guardarPeticionConUsuarioSiNoExiste(usuario, peticion) {
  try {
    const cedulaStr = usuario.cedula?.toString().trim();

    // 1) verificar usuario...
    const q = query(collection(db, 'usuarios'), where('CEDULA', '==', cedulaStr));
    const snapshot = await getDocs(q);

    let usuarioId;
    let usuarioCreado = false;

    if (snapshot.empty) {
      // crear usuario (igual que antes)
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
    } else {
      usuarioId = snapshot.docs[0].id;
    }

    // 2) fechaFormateada
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

    // 3) contador diario
    const peticionesRef = collection(db, 'peticiones');
    const queryDia = query(peticionesRef, where('fechaIngreso', '==', fechaFormateada));
    const snapshotPeticiones = await getDocs(queryDia);
    const contadorFormateado = String(snapshotPeticiones.size + 1).padStart(2, '0');

    // id final
    const idPeticion = `${fechaFormateada}-${contadorFormateado}`;

    // estructura final
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

    // guardar en Firebase con idPeticion
    const peticionRef = doc(db, 'peticiones', idPeticion);
    await setDoc(peticionRef, nuevaPeticion);
    console.log(`✅ Petición guardada en Firebase con ID: ${idPeticion}`);

    // detectar tipo y enviar a Sheets (ahora enviamos 'id' tambien)
    const tipo = peticion.tipoSolicitud?.toUpperCase() || "";

    // preparar payload para Apps Script con ID consistente
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

    // Si tipo INACTIVACION o USUARIO Y EQUIPO -> eliminar de Firebase después de enviarla (si así lo deseas)
    if (tipo === "INACTIVACION" || tipo === "USUARIO Y EQUIPO") {
      try {
        await deleteDoc(doc(db, "peticiones", idPeticion));
        console.log(`🗑️ Petición "${idPeticion}" eliminada correctamente de Firebase.`);
      } catch (error) {
        console.error("❌ Error al eliminar la petición de Firebase:", error);
      }
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
