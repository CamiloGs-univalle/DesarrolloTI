import { useState } from 'react';
import './UsuarioEquipo.css';

export default function UsuarioEquipo() {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    empresa: '',
    ciudad: '',
    usuarioReemplazar: '',
    equipo: '',
    celular: '',
    correo: '',
    sortime: false,
    tr3: false,
    sap: false,
    solvix: false,
  });

  const [showReemplazo, setShowReemplazo] = useState(true);

  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Formulario enviado:', formData);
    alert('✅ Enviado con éxito!');
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="secciones">
          {/* Sección Usuario Nuevo */}
          <div className="seccion seccion-usuario">
            <h2 className="titulo-seccion">Usuario Nuevo</h2>

            <div className="grupo-campos">
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input
                  type="text"
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="campo">
                <label htmlFor="cedula">Cédula</label>
                <input
                  type="text"
                  id="cedula"
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="campo">
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  id="empresa"
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleInputChange}
                  required
                />
              </div>
              <div className="campo">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  id="ciudad"
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleInputChange}
                  required
                />
              </div>
            </div>

            <div className="checkboxes">
              <div className="checkbox-group">
                <input type="checkbox" id="sortime" name="sortime" onChange={handleInputChange} />
                <label htmlFor="sortime">SORTTIME</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="tr3" name="tr3" onChange={handleInputChange} />
                <label htmlFor="tr3">TR3</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="sap" name="sap" onChange={handleInputChange} />
                <label htmlFor="sap">SAP</label>
              </div>
              <div className="checkbox-group">
                <input type="checkbox" id="solvix" name="solvix" onChange={handleInputChange} />
                <label htmlFor="solvix">SOLVIX</label>
              </div>
            </div>
          </div>

          {/* Sección Usuario a Reemplazar */}
          <div className="seccion seccion-reemplazo">
            <div className="titulo-seccion">
              Usuario a Reemplazar <span className="dropdown-icon">▼</span>
            </div>

            {showReemplazo && (
              <>
                <div className="campo">
                  <label htmlFor="usuarioReemplazar">Nombre</label>
                  <input
                    type="text"
                    id="usuarioReemplazar"
                    name="usuarioReemplazar"
                    value={formData.usuarioReemplazar}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div className="campo-editable">
                  <div className="campo-info">
                    <label htmlFor="equipo">Equipo</label>
                    <input
                      type="text"
                      id="equipo"
                      name="equipo"
                      value={formData.equipo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="button" className="edit-btn">Editar</button>
                </div>

                <div className="campo-editable">
                  <div className="campo-info">
                    <label htmlFor="celular">Celular</label>
                    <input
                      type="text"
                      id="celular"
                      name="celular"
                      value={formData.celular}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="button" className="edit-btn">Editar</button>
                </div>

                <div className="campo-editable">
                  <div className="campo-info">
                    <label htmlFor="correo">Correo</label>
                    <input
                      type="text"
                      id="correo"
                      name="correo"
                      value={formData.correo}
                      onChange={handleInputChange}
                    />
                  </div>
                  <button type="button" className="edit-btn">Editar</button>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Botón enviar */}
        <div className="submit-container">
          <button type="submit" className="enviar-btn">Enviar</button>
        </div>
      </form>
    </div>
  );
}
