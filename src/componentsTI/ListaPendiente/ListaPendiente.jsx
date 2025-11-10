// src/components/ListaPendiente.js
import React, { useState } from "react";
import { EstadoService } from "../../models/services/estadoService";
import "./ListaPendiente.css";

export default function ListaPendiente({ solicitudes, onSeleccionar, seleccionada, onPeticionRespondida }) {
  const [respondiendo, setRespondiendo] = useState(null);

  const manejarAprobar = async (peticionId) => {
    try {
      setRespondiendo(peticionId);
      const resultado = await EstadoService.aprobarPeticion(peticionId);
      console.log('✅ Petición aprobada:', resultado);
      if (onPeticionRespondida) {
        onPeticionRespondida();
      }
    } catch (error) {
      console.error('❌ Error aprobando petición:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setRespondiendo(null);
    }
  };

  const manejarRechazar = async (peticionId) => {
    try {
      setRespondiendo(peticionId);
      const resultado = await EstadoService.rechazarPeticion(peticionId);
      console.log('✅ Petición rechazada:', resultado);
      if (onPeticionRespondida) {
        onPeticionRespondida();
      }
    } catch (error) {
      console.error('❌ Error rechazando petición:', error);
      alert(`Error: ${error.message}`);
    } finally {
      setRespondiendo(null);
    }
  };

  return (
    <div className="lista-pendiente">
      <h2 className="titulo-lista">Solicitudes Pendientes ({solicitudes.length})</h2>

      {solicitudes.map((sol) => {
        const nombreUsuario =
          sol["NOMBRE USUARIO"] ||
          sol["NOMBRE_USUARIO"] ||
          sol.nombreUsuario ||
          sol.NOMBRE_USUARIO ||
          sol.usuario ||
          sol["usuario"] ||
          sol["USUARIO"] ||
          sol["USUARIO ID"] ||
          sol.USUARIO_ID ||
          sol.nombre ||
          "Nombre no disponible";

        const tipoSolicitud = sol.tipoSolicitud || sol.tipo || "Sin tipo";
        const fechaSolicitud = sol.fechaIngreso || sol.fechaSolicitud || sol.FECHA || "Sin fecha";
        const cedulaUsuario = sol["CEDULA USUARIO"] || sol.cedulaUsuario || "";

        return (
          <div
            key={sol.id}
            className={`item-solicitud ${seleccionada?.id === sol.id ? "seleccionada" : ""}`}
          >
            <div className="solicitud-info" onClick={() => onSeleccionar(sol)}>
              <p className="tipo">{tipoSolicitud.toUpperCase()}</p>
              <p className="fecha">{fechaSolicitud}</p>
              <p className="nombre">{nombreUsuario}</p>
              <p className="cedula">Cédula: {cedulaUsuario}</p>
              <p className="id-peticion">ID: {sol.id}</p>
            </div>

            <div className="acciones-peticion">
              <button
                className="btn-aprobar"
                onClick={() => manejarAprobar(sol.id)}
                disabled={respondiendo === sol.id}
              >
                {respondiendo === sol.id ? '🔄' : '✅'} Aprobar
              </button>

              <button
                className="btn-rechazar"
                onClick={() => manejarRechazar(sol.id)}
                disabled={respondiendo === sol.id}
              >
                {respondiendo === sol.id ? '🔄' : '❌'} Rechazar
              </button>
            </div>
          </div>
        );
      })}
    </div>
  );
}