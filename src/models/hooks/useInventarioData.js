// src/hooks/useInventarioData.js
import { useState, useEffect, useMemo } from "react";
import { useEquipos } from "./useEquipos";
import { useAsignaciones } from "./useAsignaciones";

/**
 * Hook que combina Equipos + Asignaciones en una sola vista robusta.
 * Reglas:
 * - KEY = SERIAL (normalizado)
 * - Si hay asignación ACTIVA -> estado ASIGNADO
 * - Si no hay asignación activa -> DISPONIBLE (o según estado físico)
 * - Detecta multi-asignaciones activas y las reporta en consola
 */

const normalize = (v) => {
    if (v === undefined || v === null) return "";
    return String(v).trim();
};

const normalizeKey = (serial) => normalize(serial).toUpperCase();

const isEstadoActivo = (estado) => {
    if (!estado) return false;
    const e = normalize(estado).toLowerCase();
    return e === "activo" || e === "asignado" || e === "activa" || e.includes("activo");
};

const detectEstadoEquipoFromText = (textoEstado) => {
    const e = normalize(textoEstado).toLowerCase();

    if (!e) return null;

    if (/manten|repar|service|repair|reparaci/i.test(e)) return "MANTENIMIENTO";
    if (/baja|descart|inserv|dado de baja|dado_de_baja|dado-de-baja|retir/i.test(e)) return "BAJA";
    if (/paz|paz_y_salvo|paz y salvo|pazy_salvo/i.test(e)) return "PAZ_Y_SALVO";
    if (/libre|dispon|disponible|available/i.test(e)) return "DISPONIBLE";
    if (isEstadoActivo(e)) return "ASIGNADO";
    // fallback: devuelve null para indicar "no sabemos" y dejar la decisión a la lógica
    return null;
};

const safeFormatFecha = (fecha) => {
    if (!fecha) return "-";
    try {
        // Si es timestamp firestore con toDate
        if (fecha.toDate && typeof fecha.toDate === "function") {
            return new Date(fecha.toDate()).toLocaleString();
        }
        // Si es ISO string
        if (typeof fecha === "string") {
            const d = new Date(fecha);
            if (!Number.isNaN(d.getTime())) return d.toLocaleString();
        }
        if (fecha instanceof Date) return fecha.toLocaleString();
        return String(fecha);
    } catch (e) {
        console.error("safeFormatFecha error:", e);
        return String(fecha);
    }
};

export const useInventarioData = () => {
    const { equipos: equiposFirebase, loading: loadingEquipos } = useEquipos();
    const { asignaciones, loading: loadingAsignaciones } = useAsignaciones();

    const [equiposCombinados, setEquiposCombinados] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (loadingEquipos || loadingAsignaciones) return;

        try {
            // 1. Crear mapa de equipos por SERIAL normalizado (fuente maestra)
            const mapaEquipos = new Map();
            equiposFirebase.forEach(e => {
                const key = normalizeKey(e.SERIAL || e.SERIAL?.toString() || e?.serial || "");
                if (!key) return;
                mapaEquipos.set(key, { ...e, __origId: e.id, SERIAL_NORMAL: key });
            });

            // 2. Agrupar asignaciones por SERIAL_NORMAL
            const asignPorSerial = new Map();
            asignaciones.forEach(a => {
                const serialRaw = a.SERIAL_EQUIPO || a.SERIAL || a.serial || "";
                const key = normalizeKey(serialRaw);
                if (!key) return;
                if (!asignPorSerial.has(key)) asignPorSerial.set(key, []);
                asignPorSerial.get(key).push(a);
            });

            // 3. Detectar doblones/activas multiples
            for (const [key, arr] of asignPorSerial.entries()) {
                const activas = arr.filter(x => isEstadoActivo(x.ESTADO));
                if (activas.length > 1) {
                    console.warn(`[Inventario] MULTIPLES ASIGNACIONES ACTIVAS para SERIAL: ${key}`, activas);
                    // Puedes enviar esto a una colección de auditoría o exponerlo en UI
                }
            }

            // 4. Construir lista combinada: recorrer todos los equipos (maestro) y también asignaciones huérfanas
            const combinado = [];

            // a) Primero, todos los equipos del maestro (Equipos)
            mapaEquipos.forEach((equipo, key) => {
                const asigns = asignPorSerial.get(key) || [];
                const asignActiva = asigns.find(a => isEstadoActivo(a.ESTADO));

                // historial: todas las asignaciones (orden inverso por fecha si existe fecha)
                const historialAsignaciones = asigns
                    .slice()
                    .sort((a, b) => {
                        const fa = a.FECHA_ASIGNACION ? new Date(a.FECHA_ASIGNACION) : new Date(0);
                        const fb = b.FECHA_ASIGNACION ? new Date(b.FECHA_ASIGNACION) : new Date(0);
                        return fb - fa;
                    })
                    .map(a => ({
                        id: a.id,
                        usuario: a.NOMBRE_USUARIO || a.USUARIO || a.nombre || "-",
                        cargo: a.CARGO || "-",
                        fechaAsignacion: safeFormatFecha(a.FECHA_ASIGNACION),
                        estadoAsignacion: a.ESTADO || "-"
                    }));

                // decidir estado final
                let estadoFinal = null;
                if (asignActiva) {
                    estadoFinal = "ASIGNADO";
                } else {
                    // intentar extraer del texto del campo ESTADO del equipo
                    const estadoDet = detectEstadoEquipoFromText(equipo.ESTADO);
                    estadoFinal = estadoDet || "DISPONIBLE";
                }

                combinado.push({
                    id: equipo.__origId || equipo.id,
                    serial: equipo.SERIAL || equipo.SERIAL_NORMAL || key,
                    tipoEquipo: equipo.TIPO_EQUIPO || equipo["TIPO DE EQUIPO"] || equipo.TIPO || "-",
                    marca: equipo.MARCA || equipo.MARCA_EQUIPO || equipo.MARK || "-",
                    codigoActivo: equipo.CODIGO_ACTIVO || equipo["ETIQUETA DE EQUIPO"] || equipo.ETIQUETA_EQUIPO || "-",
                    usuarioActual: asignActiva ? (asignActiva.NOMBRE_USUARIO || asignActiva.NOMBRE || asignActiva.usuario) : (equipo["USUARIO ANTERIOR ULTIMO"] || equipo["USUARIO_ANTERIOR_ULTIMO"] || "Sin asignar"),
                    cargo: asignActiva ? (asignActiva.CARGO || "-") : "-",
                    sucursal: asignActiva ? (asignActiva.CIUDAD || asignActiva.SUCURSAL || equipo.SUCURSAL) : equipo.SUCURSAL || "-",
                    empresa: asignActiva ? (asignActiva.EMPRESA || equipo.EMPRESA) : equipo.EMPRESA || "-",
                    estado: estadoFinal,
                    anydesk: equipo.ANYDESK || "-",
                    fechaAsignacion: asignActiva ? safeFormatFecha(asignActiva.FECHA_ASIGNACION) : "-",
                    observaciones: equipo.OBSERVACIONES || equipo.OBSERV || "-",
                    historial: historialAsignaciones,
                    rawEquipo: equipo,       // handy for debugging / modal
                    rawAsignaciones: asigns  // handy for debugging / modal
                });
            });

            // b) Segundo, asignaciones cuyo equipo NO existe en Equipos -> marcas como "NO ENCONTRADO" y opcionalmente crear
            asignPorSerial.forEach((arr, key) => {
                if (!mapaEquipos.has(key)) {
                    // agrupar las asignaciones y crear un "equipo fantasma" basado en asignación
                    const asignActiva = arr.find(a => isEstadoActivo(a.ESTADO));
                    const historialAsignaciones = arr
                        .slice()
                        .sort((a, b) => {
                            const fa = a.FECHA_ASIGNACION ? new Date(a.FECHA_ASIGNACION) : new Date(0);
                            const fb = b.FECHA_ASIGNACION ? new Date(b.FECHA_ASIGNACION) : new Date(0);
                            return fb - fa;
                        })
                        .map(a => ({
                            id: a.id,
                            usuario: a.NOMBRE_USUARIO || a.USUARIO || a.nombre || "-",
                            cargo: a.CARGO || "-",
                            fechaAsignacion: safeFormatFecha(a.FECHA_ASIGNACION),
                            estadoAsignacion: a.ESTADO || "-"
                        }));

                    combinado.push({
                        id: `missing-${key}`,
                        serial: key,
                        tipoEquipo: asignActiva?.TIPO_EQUIPO || "-",
                        marca: asignActiva?.MARCA_EQUIPO || "-",
                        codigoActivo: asignActiva?.ETIQUETA_EQUIPO || "N/A",
                        usuarioActual: asignActiva ? (asignActiva.NOMBRE_USUARIO || "-") : "Sin asignar",
                        cargo: asignActiva ? (asignActiva.CARGO || "-") : "-",
                        sucursal: asignActiva ? (asignActiva.CIUDAD || "-") : "-",
                        empresa: asignActiva ? (asignActiva.EMPRESA || "-") : "-",
                        estado: asignActiva ? "ASIGNADO" : "SIN_REGISTRO_EQUIPO",
                        anydesk: asignActiva?.ANYDESK || "-",
                        fechaAsignacion: asignActiva ? safeFormatFecha(asignActiva.FECHA_ASIGNACION) : "-",
                        observaciones: asignActiva?.OBSERVACIONES || "-",
                        historial: historialAsignaciones,
                        rawEquipo: null,
                        rawAsignaciones: arr,
                        missingInEquipos: true
                    });

                    console.warn(`[Inventario] SERIAL en Asignaciones pero NO en Equipos: ${key}`, arr);
                }
            });

            setEquiposCombinados(combinado);
            setLoading(false);
        } catch (err) {
            console.error("Error combinando inventario:", err);
            setEquiposCombinados([]);
            setLoading(false);
        }
    }, [equiposFirebase, asignaciones, loadingEquipos, loadingAsignaciones]);

    // expose memoized lists útiles
    const stats = useMemo(() => {
        const total = equiposCombinados.length;
        const porEstado = equiposCombinados.reduce((acc, e) => {
            acc[e.estado] = (acc[e.estado] || 0) + 1;
            return acc;
        }, {});
        return { total, porEstado };
    }, [equiposCombinados]);

    return { equipos: equiposCombinados, loading, stats };
};
