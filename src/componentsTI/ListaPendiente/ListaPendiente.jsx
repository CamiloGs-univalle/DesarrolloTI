// src/componentsTI/ListaPendiente.jsx
import React from "react";

export default function ListaPendiente({ solicitudes, onSeleccionar, seleccionada }) {
  return (
    <div className="w-1/3 bg-white rounded-xl shadow-md p-4 overflow-y-auto border">
      <h2 className="font-bold text-center text-lg mb-3">LISTA PENDIENTES</h2>
      {solicitudes.map((s) => (
        <div
          key={s.id}
          onClick={() => onSeleccionar(s)}
          className={`p-3 mb-3 rounded-lg cursor-pointer border ${
            seleccionada?.id === s.id ? "border-green-600 bg-green-50" : "border-gray-300"
          }`}
        >
          <p className="font-semibold text-sm">{`SOLICITUD - ${s.tipo}`}</p>
          <p className="text-xs text-gray-700">“{s.fecha}”</p>
          <p className="text-xs font-medium text-gray-900">“{s.nombre}”</p>
        </div>
      ))}
    </div>
  );
}
