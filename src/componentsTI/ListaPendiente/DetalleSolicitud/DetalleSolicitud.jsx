import React from "react";
import "./DetalleSolicitud.css";

export default function DetalleSolicitud({ solicitud }) {
  if (!solicitud) return null;

  return (
    <div className="detalle-solicitud">
      <h2 className="titulo-detalle">Detalle de la Solicitud</h2>
      <div className="grid-detalle">
        <p><b>Nombre:</b> {solicitud.solicitante}</p>
        <p><b>Cargo:</b> {solicitud.cargo}</p>
        <p><b>Cedula:</b> {solicitud.cedula}</p>
        <p><b>Estado:</b> {solicitud.estado}</p>
      </div>
      <div className="mensaje">
        <b>Mensaje:</b> <br /> {solicitud.mensaje || "Sin descripción adicional"}
      </div>
    </div>
  );
}
