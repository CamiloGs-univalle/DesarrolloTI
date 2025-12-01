// src/controllers/inventarioController.js
// Controlador que orquesta el flujo: inactivar usuario => poner equipo en PAZ_Y_SALVO => almacenar ultimo usuario.
// No modifica tus archivos existentes, solo usa los servicios nuevos.
import * as Equipos from "../models/firebase/equiposService";
import * as Asignaciones from "../models/firebase/asignacionesService";

/**
 * Inactivar usuario y enviar su equipo a PAZ_Y_SALVO.
 * - serialEquipo: SERIAL del equipo (string)
 * - nombreUsuario: nombre completo del usuario que fue inactivado
 *
 * Este proceso:
 * 1) busca asignación activa por serial
 * 2) finaliza la asignación
 * 3) actualiza el equipo: ESTADO = "PAZ_Y_SALVO", setUltimoUsuario
 *
 * Retorna { ok: true } o lanza error con mensaje.
 */
export async function inactivarUsuarioYEnviarEquipo({ serialEquipo, nombreUsuario }) {
    if (!serialEquipo) throw new Error("serialEquipo requerido");
    // 1) obtener asignacion activa
    const asign = await Asignaciones.obtenerAsignacionActivaPorSerial(serialEquipo);
    if (!asign) {
        // No hay asignación activa: aun así ponemos en PAZ_Y_SALVO y registramos último usuario
        const equipo = await Equipos.obtenerEquipoPorSerial(serialEquipo);
        if (!equipo) throw new Error("Equipo no encontrado para serial: " + serialEquipo);
        await Equipos.cambiarEstadoEquipo(equipo.id, "PAZ_Y_SALVO");
        await Equipos.setUltimoUsuario(equipo.id, nombreUsuario);
        return { ok: true, note: "No había asignación activa, equipo marcado como PAZ_Y_SALVO" };
    }

    // 2) finalizar asignacion
    await Asignaciones.finalizarAsignacion(asign.id, "INACTIVACION_USUARIO");

    // 3) actualizar equipo
    const equipo = await Equipos.obtenerEquipoPorSerial(serialEquipo);
    if (!equipo) throw new Error("Equipo no encontrado luego de finalizar asignación");
    await Equipos.cambiarEstadoEquipo(equipo.id, "PAZ_Y_SALVO");
    await Equipos.setUltimoUsuario(equipo.id, nombreUsuario);

    return { ok: true };
}

/**
 * TI aprueba paz y salvo -> equipo pasa a LIBRE
 */
export async function aprobarPazYSalvo(serialEquipo) {
    const equipo = await Equipos.obtenerEquipoPorSerial(serialEquipo);
    if (!equipo) throw new Error("Equipo no encontrado");
    await Equipos.cambiarEstadoEquipo(equipo.id, "LIBRE");
    return { ok: true };
}

/**
 * TI rechaza y envía a reparación
 */
export async function enviarAReparacion(serialEquipo, motivo = "") {
    const equipo = await Equipos.obtenerEquipoPorSerial(serialEquipo);
    if (!equipo) throw new Error("Equipo no encontrado");
    await Equipos.cambiarEstadoEquipo(equipo.id, "REPARACION");
    // opcional: agregar nota de observaciones
    if (motivo) {
        await Equipos.actualizarEquipo(equipo.id, { OBSERVACIONES: motivo });
    }
    return { ok: true };
}
