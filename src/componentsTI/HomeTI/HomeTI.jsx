// src/pages/HomeTI/HomeTI.jsx
import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../models/firebase/firebase"; 
import ListaPendiente from "../ListaPendiente/ListaPendiente";
import DetalleSolicitud from "../ListaPendiente/DetalleSolicitud/DetalleSolicitud";
import RespuestaSolicitud from "../ListaPendiente/RespuestaSolicitud/RespuestaSolicitud";
import UserMenu from "../../components/Home/UserMenu";
import "./HomeTI.css";

export default function HomeTI({ user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  // 🔹 Función para eliminar la solicitud de la lista cuando RespuestaSolicitud la elimina de Firebase
  const handleEliminada = (idOrFecha) => {
    // idOrFecha puede ser id (string) o un objeto { fecha: 'dd-mm-yyyy' }
    setSolicitudes(prev => prev.filter(s => {
      if (!s) return false;
      if (typeof idOrFecha === "string") return s.id !== idOrFecha;
      if (idOrFecha?.fecha) return (s.fechaIngreso || s.fecha) !== idOrFecha.fecha;
      return true;
    }));
    setSeleccionada(null);
  };

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "peticiones"));
        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id, // id del documento (ej: "31-10-2025-01")
            nombre: d["usuarioReemplazar"]?.nombre || d["NOMBRE USUARIO"] || d["NOMBRE / APELLIDO"] || d["NOMBRE"] || "Sin nombre",
            cargo: d["CARGO"] || "",
            cedula: d["usuarioReemplazar"]?.cedula || d["CEDULA USUARIO"] || d["CEDULA"] || "",
            empresa: d["proceso"] || d["EMPRESA"] || "",
            correo: d?.usuarioReemplazar?.correo || d["CORREO"] || "",
            tipo: (d["tipoSolicitud"] || d["tipo"] || "SOLICITUD"),
            fecha: d["fechaIngreso"] || d["fecha"] || d["FECHA"] || "",
            fechaIngreso: d["fechaIngreso"] || d["fecha"] || d["FECHA"] || "",
            estado: d["estado"] || "PENDIENTE",
            mensaje: d?.mensaje || d?.observacion || "",
            solicitante: d["solicitante"] || d["SOLICITANTE"] || ""
          };
        });
        setSolicitudes(data);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };
    obtenerSolicitudes();
  }, []);

  return (
    <div className="home-ti-wrapper">
      <header className="ti-header">
        <h1>Panel del Área TI</h1>
        <div className="usuario">
          <UserMenu user={user} />
        </div>
      </header>

      <main className="contenido-principal">
        <div className="contenedor-principal">
          <ListaPendiente
            solicitudes={solicitudes}
            onSeleccionar={setSeleccionada}
            seleccionada={seleccionada}
          />

          {seleccionada ? (
            <div className="detalle-y-respuesta">
              <DetalleSolicitud solicitud={seleccionada} />
              <RespuestaSolicitud
                solicitud={seleccionada}
                onEliminada={handleEliminada} // <-- aquí pasamos la función
              />
            </div>
          ) : (
            <div className="detalle-vacio">
              Selecciona una solicitud para ver su detalle
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
