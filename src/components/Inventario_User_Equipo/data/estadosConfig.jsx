/***************************************************************
 * 📌 estadosConfig.jsx (VERSIÓN SIN ERRORES — FINAL)
 * -------------------------------------------------------------
 * Coincide EXACTAMENTE con los estados que genera tu hook:
 * ASIGNADO, DISPONIBLE, SIN ASIGNAR, MANTENIMIENTO, BAJA
 ***************************************************************/

import {
  CheckCircle,
  XCircle,
  PauseCircle,
  Wrench,
  Laptop,
} from "lucide-react";

export const estadosConfig = {
  // ============================================================
  //  🟢 ASIGNADO
  // ============================================================
  "ASIGNADO": {
    emoji: "🟢",
    icon: CheckCircle,
    descripcion: "Actualmente asignado a un usuario",
    color: "from-green-500 to-green-700",
    badge: "bg-green-100 text-green-700 border-green-300",
  },

  // ============================================================
  //  🔵 DISPONIBLE
  // ============================================================
  "DISPONIBLE": {
    emoji: "🔵",
    icon: Laptop,
    descripcion: "Equipo activo disponible para entregar",
    color: "from-blue-500 to-blue-700",
    badge: "bg-blue-100 text-blue-700 border-blue-300",
  },

  // ============================================================
  //  🟣 SIN ASIGNAR
  // ============================================================
  "SIN ASIGNAR": {
    emoji: "🟣",
    icon: PauseCircle,
    descripcion: "Equipo sin usuario asignado",
    color: "from-purple-500 to-purple-700",
    badge: "bg-purple-100 text-purple-700 border-purple-300",
  },

  // ============================================================
  //  🟡 MANTENIMIENTO
  // ============================================================
  "MANTENIMIENTO": {
    emoji: "🟡",
    icon: Wrench,
    descripcion: "Equipo en revisión o reparación",
    color: "from-yellow-500 to-yellow-700",
    badge: "bg-yellow-100 text-yellow-700 border-yellow-300",
  },

  // ============================================================
  //  🔴 BAJA
  // ============================================================
  "BAJA": {
    emoji: "🔴",
    icon: XCircle,
    descripcion: "Equipo retirado del inventario",
    color: "from-red-500 to-red-700",
    badge: "bg-red-100 text-red-700 border-red-300",
  },
};
