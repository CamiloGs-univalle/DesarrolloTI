import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/firebase"; // ✅ asegúrate de tener esta importación
import ListaPendiente from "../ListaPendiente/ListaPendiente";
import DetalleSolicitud from "../ListaPendiente/DetalleSolicitud/DetalleSolicitud";


import "./HomeTI.css"; // opcional, si deseas darle estilo a esta vista
import UserMenu from "../../components/Home/UserMenu";

export default function HomeTI({ user }) {
  const [solicitudes, setSolicitudes] = useState([]);
  const [seleccionada, setSeleccionada] = useState(null);

  // 🔹 Cargar solicitudes desde Firebase
  useEffect(() => {
    const obtenerSolicitudes = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "peticiones"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setSolicitudes(data);
      } catch (error) {
        console.error("Error al obtener solicitudes:", error);
      }
    };
    obtenerSolicitudes();
  }, []);

  // 🔹 Manejar selección en la lista
  const handleSeleccion = (solicitud) => setSeleccionada(solicitud);

  return (
    <div className="home-ti-wrapper min-h-screen bg-gray-50 flex flex-col">
      {/* 🔹 Encabezado con título y menú de usuario */}
      <header className="ti-header flex justify-between items-center p-4 bg-white shadow-md">
        <h1 className="text-xl font-semibold text-gray-800">
          Panel del Área TI
        </h1>
        <UserMenu user={user} /> {/* ✅ Reutilizamos el menú con cambiar/cerrar sesión */}
      </header>

      {/* 🔹 Contenedor principal */}
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
