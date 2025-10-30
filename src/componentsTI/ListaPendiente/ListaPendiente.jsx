// src/components/ListaPendiente/ListaPendiente.jsx
import React from "react";
import "./ListaPendiente.css";

/*
  ListaPendiente
  - recibe 'solicitudes' (array de objetos) tal como los construye HomeTI.
  - onSeleccionar: callback cuando el usuario hace click en un item.
  - seleccionada: objeto seleccionado actualmente.
*/

export default function ListaPendiente({ solicitudes, onSeleccionar, seleccionada }) {
  return (
    <div className="lista-pendiente">
      <h2 className="titulo-lista">Solicitudes Pendientes</h2>

      {solicitudes.map((sol) => {
        // 1) Leer nombre desde varias propiedades posibles
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
          sol.solicitante ||
          "Sin nombre";

        // 2) Tipo y fecha (normalizamos)
        const tipoSolicitud = sol.tipoSolicitud || sol.tipo || sol.tipoSolicitud || "Sin tipo";
        const fechaSolicitud = sol.fechaIngreso || sol.fecha || sol.fechaSolicitud || "Sin fecha";

        return (
          <div
            key={sol.id || `${fechaSolicitud}-${nombreUsuario}`} // fallback key si no hay id
            className={`item-solicitud ${seleccionada?.id === sol.id ? "seleccionada" : ""}`}
            onClick={() => onSeleccionar(sol)}
          >
            <p className="tipo">{String(tipoSolicitud).toUpperCase()}</p>

            {/* Mostrar la fecha normalizada */}
            <p className="fecha">{fechaSolicitud}</p>

            {/* Mostrar nombre del solicitante */}
            <p className="nombre">{nombreUsuario}</p>
          </div>
        );
      })}
    </div>
  );
}
