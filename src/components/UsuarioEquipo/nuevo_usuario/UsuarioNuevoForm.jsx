export default function UsuarioNuevoForm({ formData, onChange }) {
  // Listas fijas para empresa y ciudad
  const Empresas = [
    "Proservis Temporales",
    "Siamo",
    "Affine",
    "Samalo",
    "Anfibia",
    "Mendiola",
  ];

  const Ciudades = [
    "Cali",
    "Medellin",
    "Bogota",
    "Barranquilla",
    "Bucaramanga",
    "Pereira",
    "Pasto",
    "Buga",
  ];

  // --- FILTRO DE AUTOCOMPLETADO ---
  const sugerenciasEmpresa = Empresas.filter((c) =>
    c.toLowerCase().includes((formData.empresa || "").toLowerCase())
  );

  const sugerenciasCiudad = Ciudades.filter((c) =>
    c.toLowerCase().includes((formData.ciudad || "").toLowerCase())
  );

  return (
    <div className="seccion seccion-usuario">
      <h2 className="titulo-seccion">Usuario Nuevo</h2>
      <div className="grupo-campos">

        {/* Nombre */}
        <div className="campo">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }}
            required
          />
        </div>

        {/* Cédula */}
        <div className="campo">
          <label htmlFor="cedula">Cédula</label>
          <input
            type="text"
            id="cedula"
            name="cedula"
            value={formData.cedula}
            onChange={(e) => {
              // Elimina todo lo que no sea número y limita a 12 dígitos
              const valor = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
              onChange({ target: { name: 'cedula', value: valor } });
            }}
            inputMode="numeric"
            pattern="[0-9]{1,15}"
            maxLength={15}
            required
          />
        </div>

        {/* Empresa (select) */}
        <div className="campo">
          <label htmlFor="empresa">Empresa</label>
          <input
            type="text"
            id="empresa"
            name="empresa"
            value={formData.empresa}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }}
            list="sugerenciasEmpresa"
            required
            placeholder="Escribe o selecciona un cargo"
          />
          <datalist id="sugerenciasEmpresa">
            {sugerenciasEmpresa.map((empresa, index) => (
              <option key={index} value={empresa} />
            ))}
          </datalist>
        </div>

        {/* ciudad (select) */}
        <div className="campo">
          <label htmlFor="ciudad">Ciudad</label>
          <input
            type="text"
            id="ciudad"
            name="ciudad"
            value={formData.ciudad}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }}
            list="sugerenciasCiudad"
            required
            placeholder="Escribe o selecciona un cargo"
          />
          <datalist id="sugerenciasCiudad">
            {sugerenciasCiudad.map((ciudad, index) => (
              <option key={index} value={ciudad} />
            ))}
          </datalist>
        </div>

        {/* Fecha de ingreso */}
        <div className="campo">
          <label htmlFor="fechaIngreso">Fecha de ingreso</label>
          <input
            type="date"
            id="fechaIngreso"
            name="fechaIngreso"
            value={formData.fechaIngreso}
            onChange={onChange}
            required
          />
        </div>
      </div>
    </div>
  );
}


/*
export default function UsuarioNuevoForm({ formData, onChange }) {
  return (
    <div className="seccion seccion-usuario">
      <h2 className="titulo-seccion">Usuario Nuevo</h2>
      <div className="grupo-campos">
        <div className="campo">
          <label htmlFor="nombre">Nombre Completo</label>
          <input
            type="text"
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }}
            required
          />

        </div>
        <div className="campo">
  <label htmlFor="cedula">Cédula</label>
  <div className="campo">
  <input
    type="text"
    id="cedula"
    name="cedula"
    value={formData.cedula}
    onChange={(e) => {
      // Elimina todo lo que no sea número y limita a 12 dígitos
      const valor = e.target.value.replace(/[^0-9]/g, '').slice(0, 12);
      onChange({ target: { name: 'cedula', value: valor } });
    }}
    inputMode="numeric"
    pattern="[0-9]{1,15}"
    maxLength={15}
    required
  />
</div>

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


*/