export default function CargoNuevoForm({ formData, onChange }) {
  return (
    <div className="seccion seccion-dinamica">
      <div className="form-cargo">
        <h2 className="titulo-seccion">Cargo Nuevo</h2>

        <div className="campo">
          <label htmlFor="cargo">Cargo</label>
          <input type="text" id="cargo" name="cargo" value={formData.cargo} onChange={onChange} required />
        </div>

        <div className="campo-checkboxes">
          <span>EQUIPO</span>
          <label>
            <input type="checkbox" name="alquilar" checked={formData.alquilar} onChange={onChange} />
            Alquilar
          </label>
          <label>
            <input type="checkbox" name="asignar" checked={formData.asignar} onChange={onChange} />
            Asignar
          </label>
        </div>

        <div className="campo">
          <label htmlFor="nuevoCorreo">Nuevo Correo</label>
          <input type="email" id="nuevoCorreo" name="nuevoCorreo" value={formData.nuevoCorreo} onChange={onChange} required />
        </div>

        <div className="campo">
          <label htmlFor="nombreGerente">Aprobado por gerencia</label>
          <input type="text" id="nombreGerente" name="nombreGerente" value={formData.nombreGerente} onChange={onChange} required />
        </div>

        <div className="campo">
          <label htmlFor="comentario">Comentario</label>
          <textarea id="comentario" name="comentario" value={formData.comentario} onChange={onChange}></textarea>
        </div>
      </div>
    </div>
  );
}
