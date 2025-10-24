import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; 
import ListaPendiente from "../ListaPendiente/ListaPendiente";
import DetalleSolicitud from "../ListaPendiente/DetalleSolicitud/DetalleSolicitud";
import UserMenu from "../../components/Home/UserMenu";
import "./HomeTI.css";

export default function HomeTI({ user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  // 🔹 Cargar solicitudes desde Firestore
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "peticiones"));
        const data = querySnapshot.docs.map((doc) => {
          const d = doc.data();

          // ✅ Adaptamos los nombres de los campos reales
          return {
            id: doc.id,
            nombre: d["NOMBRE USUARIO"] || "Sin nombre",
            cargo: d["CARGO"] || "",
            cedula: d["CEDULA USUARIO"] || "",
            empresa: d["proceso"] || "",
            correo: d?.usuarioReemplazar?.correo || "",
            ciudad: d?.usuarioReemplazar?.equipo || "",
            tipo: d["tipoSolicitud"]?.toUpperCase() || "SOLICITUD",
            fecha: d["fechaIngreso"] || "",
            estado: d["estado"] || "",
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

  // 🔹 Seleccionar solicitud
  const handleSeleccion = (solicitud) => setSeleccionada(solicitud);

  return (
    <div className="home-ti-wrapper min-h-screen bg-gray-50 flex flex-col">
      {/* 🔹 Encabezado */}
      <header className="ti-header flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold text-gray-800">
          Panel del Área TI
        </h1>
        <UserMenu user={user} />
      </header>

      {/* 🔹 Contenido principal */}
      <main className="flex-grow flex justify-center items-start p-8">
        <div className="flex w-full max-w-6xl gap-6">
          <ListaPendiente
            solicitudes={solicitudes}
            onSeleccionar={handleSeleccion}
            seleccionada={seleccionada}
          />
          <DetalleSolicitud solicitud={seleccionada} />
        </div>
      </main>
    </div>
  );
}
