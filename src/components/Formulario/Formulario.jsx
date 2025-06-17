import "./Formulario.css";
import { useState } from "react";
import { guardarUsuario } from "../../controllers/userController";

export default function Formulario() {
  const [formData, setFormData] = useState({
    solicitante: "",
    nombreNuevo: "",
    cedulaNuevo: "",
    empresa: "",
    ciudad: "",
    sistemas: { sorttime: false, sap: false, tr3: false, solvix: false },
    nombreReemplazo: "",
    equipo: false,
    celular: false,
    correo: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["sorttime", "sap", "tr3", "solvix"].includes(name)) {
      setFormData((prev) => ({
        ...prev,
        sistemas: {
          ...prev.sistemas,
          [name]: checked,
        },
      }));
    } else if (["equipo", "celular", "correo"].includes(name)) {
      setFormData((prev) => ({ ...prev, [name]: checked }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await guardarUsuario(formData);
    alert("✅ Solicitud enviada correctamente");
  };

  return (
    <form onSubmit={handleSubmit} className="formulario-ti">
      <h1>SOLICITUD AL AREA TI</h1>

      <div className="campo">
        <label>Nombre Solicitante</label>
        <input name="solicitante" value={formData.solicitante} onChange={handleChange} required />
      </div>

      <div className="botones">
        <button className="btn-am">Usuario y Equipo</button>
        <button className="btn">Inactivación de Usuario</button>
        <button className="btn">Asignación de Equipo</button>
        <button className="btn">Asignación de Correo</button>
      </div>

      <div className="panel">
        <section className="nuevo">
          <h2>Usuario Nuevo</h2>
          <input name="nombreNuevo" placeholder="Nombre" value={formData.nombreNuevo} onChange={handleChange} required />
          <input name="cedulaNuevo" placeholder="Cédula" value={formData.cedulaNuevo} onChange={handleChange} required />
          <input name="empresa" placeholder="Empresa" value={formData.empresa} onChange={handleChange} required />
          <input name="ciudad" placeholder="Ciudad" value={formData.ciudad} onChange={handleChange} required />

          <div className="checks">
            <label><input type="checkbox" name="sorttime" checked={formData.sistemas.sorttime} onChange={handleChange} /> SORTTIME</label>
            <label><input type="checkbox" name="sap" checked={formData.sistemas.sap} onChange={handleChange} /> SAP</label>
            <label><input type="checkbox" name="tr3" checked={formData.sistemas.tr3} onChange={handleChange} /> TR3</label>
            <label><input type="checkbox" name="solvix" checked={formData.sistemas.solvix} onChange={handleChange} /> SOLVIX</label>
          </div>
        </section>

        <section className="reemplazo">
          <h2>Usuario a Reemplazar</h2>
          <input name="nombreReemplazo" placeholder="Nombre" value={formData.nombreReemplazo} onChange={handleChange} />
          <div className="reemplazo-checks">
            <label><input type="checkbox" name="equipo" checked={formData.equipo} onChange={handleChange} /> Equipo</label>
            <label><input type="checkbox" name="celular" checked={formData.celular} onChange={handleChange} /> Celular</label>
            <label><input type="checkbox" name="correo" checked={formData.correo} onChange={handleChange} /> Correo</label>
          </div>
        </section>
      </div>

      <button type="submit" className="btn-enviar">Enviar</button>
    </form>
  );
}
