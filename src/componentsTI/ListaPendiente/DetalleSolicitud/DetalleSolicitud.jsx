import React from "react";

export default function DetalleSolicitud({ solicitud }) {
  if (!solicitud)
    return (
      <div className="detalle-vacio">
        Selecciona una solicitud
      </div>
    );

  return (
    <div className="detalle-solicitud">
      <h2 className="titulo-detalle">
        USUARIO Y EQUIPO - “{solicitud.nombre}”
      </h2>

      <div className="grid-detalle">
        <div><strong>Correo:</strong> {solicitud.correo}</div>
        <div><strong>Cargo:</strong> {solicitud.cargo}</div>
        <div><strong>Cédula:</strong> {solicitud.cedula}</div>
        <div><strong>Ciudad:</strong> {solicitud.ciudad}</div>
        <div><strong>Empresa:</strong> {solicitud.empresa}</div>
      </div>

      <p className="mensaje">
        {solicitud.mensaje || 
`Buen día.
Adjunto credenciales del usuario en mención por favor compartir a quien corresponda.

CORREO: "${solicitud.correo}"
CONTRASEÑA: "${solicitud.cedula}"

TR3: "${solicitud.correo}"
CONTRASEÑA: "${solicitud.cedula}"

SORTTIME: "${solicitud.cedula}"
CONTRASEÑA: "los 4 últimos dígitos de la cédula"`}
      </p>

      <div className="botones">
        <button className="btn-editar">EDITAR</button>
        <button className="btn-enviar">ENVIAR</button>
      </div>
    </div>
  );
}
