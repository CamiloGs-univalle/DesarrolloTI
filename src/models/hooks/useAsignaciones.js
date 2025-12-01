// src/models/hooks/useAsignaciones.js
import { useState, useEffect } from "react";
import { subscribeAsignaciones, obtenerTodasAsignaciones } from "../firebase/asignacionesService";

/**
 * Hook para asignaciones (realtime por defecto)
 */
export function useAsignaciones({ realtime = true } = {}) {
  const [asignaciones, setAsignaciones] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let unsub;
    if (realtime) {
      unsub = subscribeAsignaciones((data) => {
        setAsignaciones(data);
        setLoading(false);
      });
    } else {
      (async () => {
        const data = await obtenerTodasAsignaciones();
        setAsignaciones(data);
        setLoading(false);
      })();
    }
    return () => {
      if (typeof unsub === "function") unsub();
    };
  }, [realtime]);

  return { asignaciones, loading, setAsignaciones };
}
