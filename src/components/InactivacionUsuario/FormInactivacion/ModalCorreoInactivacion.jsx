// 📄 src/components/InactivacionUsuario/FormInactivacion/ModalCorreoInactivacion.jsx

import React from 'react';

export default function ModalCorreoInactivacion({ data, onClose }) {
  const handleEnviarCorreo = () => {
    const asunto = `Inactivación de usuario: ${data.nombre}`;
    const cuerpo = `
      Hola equipo TI,

      Se solicita la inactivación del siguiente usuario:
      - Nombre: ${data.nombre}
      - Cédula: ${data.cedula}
      - Cargo: ${data.cargo}
      - Empresa: ${data.empresa}
      - Correo: ${data.correo}
      - Fecha de retiro: ${data.fechaRetiro}
      - Comentario: ${data.comentario}

      Gracias.
    `;
    window.open(`mailto:aprendiz.ti@proservis.com.co?subject=${encodeURIComponent(asunto)}&body=${encodeURIComponent(cuerpo)}`);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>📧 Confirmar envío de correo</h3>
        <p><strong>Usuario:</strong> {data.nombre}</p>
        <p><strong>Correo:</strong> {data.correo}</p>
        <p><strong>Empresa:</strong> {data.empresa}</p>
        <div className="modal-actions">
          <button onClick={handleEnviarCorreo} className="btn-confirmar">Enviar correo</button>
          <button onClick={onClose} className="btn-cancelar">Cerrar</button>
        </div>
      </div>
    </div>
  );
}
