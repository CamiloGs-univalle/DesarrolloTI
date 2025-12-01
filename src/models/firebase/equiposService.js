// src/models/firebase/equiposService.js
// Servicio para CRUD y cambios de estado de "equipos"
// Importa la instancia de Firestore desde tu firebase.js existente
import { db } from "./firebase";
import {
    collection,
    doc,
    getDocs,
    getDoc,
    query,
    where,
    updateDoc,
    onSnapshot
} from "firebase/firestore";

const equiposCol = collection(db, "Equipos");

/**
 * Obtener todos los equipos (snapshot en tiempo real)
 * callback recibe array [{ id, ...data }]
 * devuelve la función unsubscribe de onSnapshot
 */
export function subscribeEquipos(callback) {
    return onSnapshot(equiposCol, (snap) => {
        const data = snap.docs.map(d => ({ id: d.id, ...d.data() }));
        callback(data);
    });
}

/** Obtener todos (una sola vez) */
export async function obtenerTodosEquipos() {
    const snap = await getDocs(equiposCol);
    return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

/** Obtener equipo por SERIAL (devuelve el primer match o null) */
export async function obtenerEquipoPorSerial(serial) {
    if (!serial) return null;
    const q = query(equiposCol, where("SERIAL", "==", serial));
    const snap = await getDocs(q);
    if (snap.empty) return null;
    return { id: snap.docs[0].id, ...snap.docs[0].data() };
}

/** Obtener equipo por ID (directo) */
export async function obtenerEquipoPorId(id) {
    const ref = doc(db, "Equipos", id);
    const snap = await getDoc(ref);
    return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

/** Actualiza campos del equipo (merge parcial) */
export async function actualizarEquipo(id, campos) {
    if (!id) throw new Error("id de equipo requerido");
    const ref = doc(db, "Equipos", id);
    await updateDoc(ref, campos);
}

/** Cambiar estado (constante única para centralizar) */
export async function cambiarEstadoEquipo(id, estado) {
    await actualizarEquipo(id, { ESTADO: estado });
}

/** Actualizar último usuario registrado (campo que tú uses) */
export async function setUltimoUsuario(id, nombreUsuario) {
    // ajusta el nombre del campo si tu colección tiene otro
    await actualizarEquipo(id, { "USUARIO ANTERIOR ULTIMO": nombreUsuario });
}
