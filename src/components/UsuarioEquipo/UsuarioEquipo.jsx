// src/components/UsuarioEquipo/UsuarioEquipo.jsx
import { useState } from 'react';
import './UsuarioEquipo.css';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase';

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

  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosFinales = {
      solicitante: formData.nombre,
      nombreNuevo: formData.nombre,
      cedulaNuevo: formData.cedula,
      empresa: formData.empresa,
      ciudad: formData.ciudad,
      nombreReemplazo: formData.usuarioReemplazar,
      equipo: formData.equipo,
      celular: formData.celular,
      correo: formData.correo,
      sistemas: {
        sorttime: formData.sortime,
        tr3: formData.tr3,
        sap: formData.sap,
        solvix: formData.solvix
      }
    };

    try {
      const docRef = await addDoc(collection(db, 'usuarios'), datosFinales);
      console.log('✅ Guardado en Firebase con ID:', docRef.id);

      const response = await fetch('/api/enviar-a-sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(datosFinales),
      });

      const resultado = await response.json();
      console.log('✅ Respuesta Sheets:', resultado);

      alert('✅ Datos guardados en Firebase y Sheets correctamente');
    } catch (error) {
      console.error('❌ Error al enviar datos:', error);
      alert('❌ Error al guardar datos. Revisa la consola.');
    }
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>
        <div className="secciones">
          <div className="seccion seccion-usuario">
            <h2 className="titulo-seccion">Usuario Nuevo</h2>
            <div className="grupo-campos">
              <div className="campo">
                <label htmlFor="nombre">Nombre</label>
                <input type="text" id="nombre" name="nombre" value={formData.nombre} onChange={handleInputChange} required />
              </div>
              <div className="campo">
                <label htmlFor="cedula">Cédula</label>
                <input type="text" id="cedula" name="cedula" value={formData.cedula} onChange={handleInputChange} required />
              </div>
              <div className="campo">
                <label htmlFor="empresa">Empresa</label>
                <input type="text" id="empresa" name="empresa" value={formData.empresa} onChange={handleInputChange} required />
              </div>
              <div className="campo">
                <label htmlFor="ciudad">Ciudad</label>
                <input type="text" id="ciudad" name="ciudad" value={formData.ciudad} onChange={handleInputChange} required />
              </div>
            </div>

            <div className="checkboxes">
              {['sortime', 'tr3', 'sap', 'solvix'].map((sistema) => (
                <div className="checkbox-group" key={sistema}>
                  <input type="checkbox" id={sistema} name={sistema} onChange={handleInputChange} />
                  <label htmlFor={sistema}>{sistema.toUpperCase()}</label>
                </div>
              ))}
            </div>
          </div>

          <div className="seccion seccion-reemplazo">
            <div className="titulo-seccion">Usuario a Reemplazar <span className="dropdown-icon">▼</span></div>

            {showReemplazo && (
              <>
                <div className="campo">
                  <label htmlFor="usuarioReemplazar">Nombre</label>
                  <input type="text" id="usuarioReemplazar" name="usuarioReemplazar" value={formData.usuarioReemplazar} onChange={handleInputChange} required />
                </div>

                {['equipo', 'celular', 'correo'].map((campo) => (
                  <div className="campo-editable" key={campo}>
                    <div className="campo-info">
                      <label htmlFor={campo}>{campo.charAt(0).toUpperCase() + campo.slice(1)}</label>
                      <input type="text" id={campo} name={campo} value={formData[campo]} onChange={handleInputChange} />
                    </div>
                    <button type="button" className="edit-btn">Editar</button>
                  </div>
                ))}
              </>
            )}
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="enviar-btn">Enviar</button>
        </div>
      </form>
    </div>
  );
}
