// src/componentsTI/ListaPendiente/DetalleSolicitud/DetalleSolicitud.jsx
import React from "react";

export default function DetalleSolicitud({ solicitud }) {
  if (!solicitud)
    return <div className="w-2/3 flex items-center justify-center text-gray-500">Selecciona una solicitud</div>;

  return (
    <div className="w-2/3 p-6 bg-white rounded-xl shadow-md ml-4 flex flex-col gap-3 border">
      <h2 className="text-center font-bold text-lg mb-2">
        USUARIO Y EQUIPO - “{solicitud.nombre}”
      </h2>

      <div className="grid grid-cols-2 gap-3 text-sm">
        <div><strong>Correo:</strong> {solicitud.correo}</div>
        <div><strong>Cargo:</strong> {solicitud.cargo}</div>
        <div><strong>Cédula:</strong> {solicitud.cedula}</div>
        <div><strong>Ciudad:</strong> {solicitud.ciudad}</div>
        <div><strong>Empresa:</strong> {solicitud.empresa}</div>
      </div>

      <p className="mt-4 text-sm border-t pt-3 whitespace-pre-line leading-relaxed">
        {solicitud.mensaje || 
`Buen día.
Adjunto credenciales del usuario en mención por favor compartir a quien corresponda.

CORREO: "${solicitud.correo}"
CONTRASEÑA: "${solicitud.cedula}"

TR3: "${solicitud.correo}"
CONTRASEÑA: "${solicitud.cedula}"

SORTTIME: "${solicitud.cedula}"
CONTRASEÑA: "los 4 últimos dígitos de la cédula"`
        }
      </p>

      <div className="flex justify-end gap-4 mt-4">
        <button className="bg-green-700 text-white px-6 py-2 rounded-xl hover:bg-green-800">EDITAR</button>
        <button className="bg-green-600 text-white px-6 py-2 rounded-xl hover:bg-green-700">ENVIAR</button>
      </div>
    </div>
  );
}
