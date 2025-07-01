export default function UsuarioNuevoForm({ formData, onChange }) {
  return (
    <div className="seccion seccion-usuario">
      <h2 className="titulo-seccion">Usuario Nuevo</h2>
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="nombre">Nombre Completo</label>
          <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={onChange} required />
        </div>
        <div className="campo">
          <label htmlFor="cedula">Cédula</label>
          <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={onChange} required />
        </div>
        <div className="campo">
          <label htmlFor="empresa">Empresa</label>
          <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={onChange} required />
        </div>
        <div className="campo">
          <label htmlFor="ciudad">Ciudad</label>
          <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={onChange} required />
        </div>
        <div className="campo">
          <label htmlFor="fechaIngreso">Fecha de ingreso</label>
          <input type="date" id="fechaIngreso" name="fechaIngreso" value={formData.fechaIngreso} onChange={onChange} required />
        </div>
      </div>

    </div>
  );
}
