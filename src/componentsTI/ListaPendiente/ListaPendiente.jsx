import React from "react";

export default function ListaPendiente({ solicitudes, onSeleccionar, seleccionada }) {
  return (
    <div className="lista-pendiente">
      <h2 className="titulo-lista">LISTA PENDIENTES</h2>
      {solicitudes.length === 0 ? (
        <p className="text-center text-gray-500 mt-4">No hay solicitudes pendientes</p>
      ) : (
        solicitudes.map((s) => (
          <div
            key={s.id}
            onClick={() => onSeleccionar(s)}
            className={`item-solicitud ${
              seleccionada?.id === s.id ? "seleccionada" : ""
            }`}
          >
            <p className="tipo">{`SOLICITUD - ${s.tipo}`}</p>
            <p className="fecha">“{s.fecha}”</p>
            <p className="nombre">“{s.nombre}”</p>
          </div>
        ))
      )}
    </div>
  );
}
