import { useState } from "react";
import './CargoNuevoForm.css';
import { enviarCorreoCorporativo, enviarCorreoGratuito } from '../../../utils/sendEmail';

export default function CargoNuevoForm({ formData, onChange }) {
  const [estadoEnvio, setEstadoEnvio] = useState("idle");
  const [emailGH, setEmailGH] = useState("camilo13369@gmail.com");
  const esCorporativo = formData.correoCorporativo;

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.clear();
    setEstadoEnvio("enviando");
    
    console.group("🚀 Iniciando proceso de solicitud");
    console.log("📄 Datos del formulario:", formData);
    console.log("📧 Email de GH:", emailGH);

    try {
      if (esCorporativo) {
        console.log("💼 Procesando correo corporativo...");
        await enviarCorreoCorporativo(formData.nuevoCorreo, formData.comentario);
      } else {
        console.log("🆓 Procesando correo gratuito...");
        await enviarCorreoGratuito(formData.nuevoCorreo, formData.comentario);
      }

      setEstadoEnvio("enviado");
      console.groupEnd();
      alert("✅ Solicitud enviada correctamente.");
    } catch (error) {
      setEstadoEnvio("error");
      console.error("❌ Error en el proceso:", error);
      console.groupEnd();
      alert("❌ Error al enviar la solicitud.");
    }
  };

  return (
    <div className="seccion seccion-dinamica">
      {/* Eliminamos el <form> y usamos un div con la misma clase */}
      <div className="form-cargo">
        <h2 className="titulo-seccion">Cargo Nuevo</h2>

        <div className="campo">
          <label htmlFor="cargo">Cargo</label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={onChange}
            required
          />
        </div>

        <div className="campo-checkboxes">
          <span>EQUIPO</span>
          <label>
            <input
              type="checkbox"
              name="alquilar"
              checked={formData.alquilar}
              onChange={onChange}
            />
            Alquilar
          </label>
          <label>
            <input
              type="checkbox"
              name="asignar"
              checked={formData.asignar}
              onChange={onChange}
            />
            Asignar
          </label>
        </div>

        <div className="campo">
          <label>
            <p>{esCorporativo ? "Correo Corporativo." : "Correo Gratuito."}</p>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              name="correoCorporativo"
              checked={formData.correoCorporativo}
              onChange={onChange}
            />
            <span className="slider round"></span>
          </label>
          <p style={{ fontSize: "0.9em", color: "#555" }}>
            {esCorporativo
              ? "Se enviará solicitud a gerencia para crear este correo corporativo."
              : "Se enviará solicitud a TI para crear un correo gratuito."}
          </p>
        </div>

        <div className="campo">
          <label htmlFor="nuevoCorreo">Correo a crear</label>
          <input
            type="email"
            id="nuevoCorreo"
            name="nuevoCorreo"
            value={formData.nuevoCorreo}
            onChange={onChange}
            required
          />
        </div>

        <div className="campo">
          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={onChange}
          ></textarea>
        </div>

        {/* Cambiamos el type="submit" por type="button" */}
        <div className="campo">
          <button 
            type="button" 
            className="boton-enviar"
            onClick={handleSubmit}
          >
            Enviar Solicitud
          </button>
        </div>

        {/* Estado visual del envío */}
        {estadoEnvio === "enviando" && (
          <p className="mensaje-enviando">⏳ Enviando solicitud...</p>
        )}
        {estadoEnvio === "enviado" && (
          <p className="mensaje-enviado">✅ Solicitud enviada.</p>
        )}
        {estadoEnvio === "error" && (
          <p className="mensaje-error">❌ Error al enviar. Intenta nuevamente.</p>
        )}
      </div>
    </div>
  );
}