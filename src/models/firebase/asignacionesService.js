// src/models/firebase/asignacionesService.js
import { db } from "./firebase";
import {
    collection,
    addDoc,
    getDocs,
    query,
    where,
    updateDoc,
    doc,
    serverTimestamp,
    onSnapshot
} from "firebase/firestore";

const asignacionesCol = collection(db, "Asignaciones");

/** Suscripción en tiempo real a asignaciones */
export function subscribeAsignaciones(callback) {
    return onSnapshot(asignacionesCol, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(data);
    });
}

/** Obtener todas las asignaciones (una vez) */
export async function obtenerTodasAsignaciones() {
    const snap = await getDocs(asignacionesCol);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Buscar asignación activa por SERIAL_EQUIPO */
export async function obtenerAsignacionActivaPorSerial(serial) {
    if (!serial) return null;
    const q = query(asignacionesCol, where("SERIAL_EQUIPO", "==", serial), where("ESTADO", "==", "ACTIVO"));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

/** Crear asignación nueva */
export async function crearAsignacion(data) {
    // data debe contener al menos: NOMBRE_USUARIO, CARGO, SERIAL_EQUIPO, CIUDAD, EMPRESA, ESTADO (=> ACTIVO)
    const payload = {
        ...data,
        FECHA_CREACION: serverTimestamp(),
        FECHA_ASIGNACION: data.FECHA_ASIGNACION || serverTimestamp(),
        ESTADO: data.ESTADO || "ACTIVO"
    };
    const ref = await addDoc(asignacionesCol, payload);
    return ref.id;
}

/** Finalizar una asignación (marcar finalizada) */
export async function finalizarAsignacion(id, motivo = "FINALIZADA") {
    if (!id) throw new Error("id de asignación requerido");
    const ref = doc(db, "Asignaciones", id);
    await updateDoc(ref, {
        ESTADO: "FINALIZADA",
        MOTIVO_FIN: motivo,
        FECHA_FINALIZACION: serverTimestamp()
    });
}
