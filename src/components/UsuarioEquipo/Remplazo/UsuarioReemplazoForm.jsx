export default function UsuarioReemplazoForm({ formData, onChange }) {
  return (
    <div className="seccion seccion-dinamica">
      <div className="form-reemplazo">
        <h2 className="titulo-seccion">Usuario a Reemplazar</h2>
        <div className="campo">
          <label htmlFor="usuarioReemplazar">Nombre</label>
          <input type="text" id="usuarioReemplazar" name="usuarioReemplazar" value={formData.usuarioReemplazar} onChange={onChange} required />
        </div>
        <div className="campo">
          <label htmlFor="equipo">Cargo</label>
          <input type="text" id="equipo" name="equipo" value={formData.equipo} onChange={onChange} />
        </div>
        <div className="campo">
          <div className="checkboxes">
            {['sortime', 'tr3', 'sap', 'solvix'].map((sistema) => (
              <div className="checkbox-group" key={sistema}>
                <input type="checkbox" id={sistema} name={sistema} checked={formData[sistema]} onChange={onChange} />
                <label htmlFor={sistema}>{sistema.toUpperCase()}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="campo">
          <label htmlFor="correo">Comentario</label>
          <input type="email" id="correo" name="correo" value={formData.correo} onChange={onChange} />
        </div>
      </div>
    </div>
  );
}
