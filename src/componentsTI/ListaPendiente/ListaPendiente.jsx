import React from "react";
import "./ListaPendiente.css";

export default function ListaPendiente({ solicitudes, onSeleccionar, seleccionada }) {
  return (
    <div className="lista-pendiente">
      <h2 className="titulo-lista">Solicitudes Pendientes</h2>

      {solicitudes.map((sol) => {
        // ✅ Intenta leer el nombre desde diferentes claves posibles
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
          sol.nombre;

        const tipoSolicitud = sol.tipoSolicitud || sol.tipo || "Sin tipo";
        const fechaSolicitud = sol.fechaIngreso || sol.fechaSolicitud || sol.FECHA || "Sin fecha";

        return (
          <div
            key={sol.id}
            className={`item-solicitud ${seleccionada?.id === sol.id ? "seleccionada" : ""}`}
            onClick={() => onSeleccionar(sol)}
          >
            <p className="tipo">{tipoSolicitud.toUpperCase()}</p>
            <p className="fecha">{sol.fecha}</p>
            <p className="nombre">{sol.solicitante}</p>
          </div>
        );
      })}
    </div>
  );
}
