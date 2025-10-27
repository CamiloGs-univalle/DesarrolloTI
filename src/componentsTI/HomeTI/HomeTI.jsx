import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 
import ListaPendiente from "../ListaPendiente/ListaPendiente";
import DetalleSolicitud from "../ListaPendiente/DetalleSolicitud/DetalleSolicitud";
import RespuestaSolicitud from "../ListaPendiente/RespuestaSolicitud/RespuestaSolicitud";
import UserMenu from "../../components/Home/UserMenu";
import "./HomeTI.css";

export default function HomeTI({ user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "peticiones"));
        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();
          return {
            id: doc.id,
            nombre: d["usuarioReemplazar"]?.nombre || d["NOMBRE USUARIO"] || "Sin nombre",
            cargo: d["CARGO"] || "",
            cedula: d["usuarioReemplazar"]?.cedula || d["CEDULA USUARIO"] || "",
            empresa: d["proceso"] || "",
            correo: d?.usuarioReemplazar?.correo || "",
            tipo: d["tipoSolicitud"]?.toUpperCase() || "SOLICITUD",
            fecha: d["fechaIngreso"] || "",
            estado: d["estado"] || "PENDIENTE",
            mensaje: d?.mensaje || "",
            solicitante: d["solicitante"] || "",
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
              <RespuestaSolicitud solicitud={seleccionada} />
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
