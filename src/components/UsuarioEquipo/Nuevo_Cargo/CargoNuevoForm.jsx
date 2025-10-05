import { useState } from "react";
import './CargoNuevoForm.css';
import { guardarPeticionConUsuarioSiNoExiste } from '../../../controllers/userController.js';

export default function CargoNuevoForm({ formData, onChange }) {
  const [estadoEnvio] = useState("idle");
  const esCorporativo = formData.correoCorporativo;

  // components/UsuarioEquipo.jsx (parte relevante)

  // En la función handleSubmit, asegúrate de incluir el cargo:
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // PREPARAR DATOS DEL USUARIO CON CARGO
      const datosUsuario = {
        nombre: formData.nombre.trim(),
        cedula: formData.cedula.trim(),
        correo: formData.correo.trim(),
        cargo: formData.cargo.trim(), // ✅ CARGO INCLUIDO
        empresa: formData.empresa.trim(),
        ciudad: formData.ciudad.trim(),
        fechaIngreso: formData.fechaIngreso
      };

      // PREPARAR DATOS DE LA PETICIÓN CON CARGO
      const datosPeticion = {
        solicitante: formData.nombre.trim(),
        tipoSolicitud: formType,
        cargo: formData.cargo.trim(), // ✅ CARGO INCLUIDO EN PETICIÓN TAMBIÉN
        // ... resto de datos
      };

      // EJECUTAR LA FUNCIÓN PRINCIPAL
      const resultado = await guardarPeticionConUsuarioSiNoExiste(datosUsuario, datosPeticion);

      console.log('✅ Proceso completado. Cargo guardado:', resultado.cargo);

    } catch (error) {
      console.error('❌ Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="seccion seccion-dinamica">
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
            placeholder="Se autocompleta con el cargo del usuario seleccionado"
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
            placeholder="Se autocompleta con el correo del usuario seleccionado"
          />
        </div>

        <div className="campo">
          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={onChange}
            placeholder="Comentarios adicionales sobre el cargo nuevo"
          ></textarea>
        </div>

        <div className="campo">
          <button
            type="button"
            className="boton-enviar"
            onClick={handleSubmit}
          >
            Enviar Solicitud
          </button>
        </div>

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