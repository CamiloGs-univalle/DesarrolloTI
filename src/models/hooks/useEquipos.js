// src/models/hooks/useEquipos.js
import { useState, useEffect } from "react";
import { subscribeEquipos, obtenerTodosEquipos } from "../firebase/equiposService";

/**
 * Hook para equipos: proporciona lista y reload.
 * Usa suscripción en tiempo real si prefieres.
 */
export function useEquipos({ realtime = true } = {}) {
  const [equipos, setEquipos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    if (realtime) {
      unsub = subscribeEquipos((data) => {
        setEquipos(data);
        setLoading(false);
      });
    } else {
      (async () => {
        const data = await obtenerTodosEquipos();
        setEquipos(data);
        setLoading(false);
      })();
    }
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [realtime]);

  return { equipos, loading, setEquipos };
}
