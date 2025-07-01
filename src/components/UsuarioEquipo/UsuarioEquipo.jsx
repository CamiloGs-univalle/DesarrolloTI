import { useState } from 'react';
import './UsuarioEquipo.css';
import { guardarUsuario } from '../../controllers/userController';
import { enviarAFirebaseAAppsScript } from '../../services/googleSheetsService';
import UsuarioNuevoForm from './nuevo_usuario/UsuarioNuevoForm';
import UsuarioReemplazoForm from './Remplazo/UsuarioReemplazoForm';
import CargoNuevoForm from './Nuevo_Cargo/CargoNuevoForm';

export default function UsuarioEquipo() {
  const [formType, setFormType] = useState('reemplazo');

  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    empresa: '',
    ciudad: '',
    fechaIngreso: '',

    usuarioReemplazar: '',
    equipo: '',
    celular: '',
    correo: '',

    cargo: '',
    alquilar: false,
    asignar: false,
    nuevoCorreo: '',
    nombreGerente: '',
    comentario: '',

    sortime: false,
    tr3: false,
    sap: false,
    solvix: false,
  });

  // ✅ Actualiza campos cuando se selecciona un usuario del autocompletado
  const handleUsuarioSeleccionado = (usuario) => {
    setFormData((prev) => ({
      ...prev,
      usuarioReemplazar: usuario.nombre || '',
      equipo: usuario.cargo || '',
      cedula: usuario.cedula || '',
      empresa: usuario.empresa || '',
      ciudad: usuario.ciudad || '',
      proceso: usuario.proceso || ''
    }));
  };

  // ✅ Manejador de cambios para todos los inputs
  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  // ✅ Envía datos a Firebase y Google Sheets
  const handleSubmit = async (e) => {
    e.preventDefault();

    const datosFinales = {
      solicitante: formData.nombre,
      tipoSolicitud: formType,
      fechaIngreso: formData.fechaIngreso,

      nombreNuevo: formData.nombre,
      cedulaNuevo: formData.cedula,
      empresa: formData.empresa,
      ciudad: formData.ciudad,

      usuarioReemplazar: {
        nombre: formData.usuarioReemplazar,
        equipo: formData.equipo,
        celular: formData.celular,
        correo: formData.correo
      },

      cargoNuevo: {
        cargo: formData.cargo,
        alquilar: formData.alquilar,
        asignar: formData.asignar,
        nuevoCorreo: formData.nuevoCorreo,
        nombreGerente: formData.nombreGerente,
        comentario: formData.comentario
      },

      sistemas: {
        sortime: formData.sortime,
        tr3: formData.tr3,
        sap: formData.sap,
        solvix: formData.solvix
      }
    };

    try {
      await guardarUsuario(datosFinales);
      await enviarAFirebaseAAppsScript(datosFinales);
      alert('✅ Datos guardados en Firebase y Sheets correctamente');
    } catch (error) {
      console.error('❌ Error al enviar datos:', error);
      alert('❌ Error al guardar datos. Revisa la consola.');
    }
  };

  return (
    <div className="form-container">
      <form className="formulario" onSubmit={handleSubmit}>

        <div className="tipo-selector">
          <button
            type="button"
            className={formType === 'reemplazo' ? 'active' : ''}
            onClick={() => setFormType('reemplazo')}
          >
            Usuario a Reemplazar
          </button>
          <button
            type="button"
            className={formType === 'cargo' ? 'active' : ''}
            onClick={() => setFormType('cargo')}
          >
            Cargo Nuevo
          </button>
        </div>

        <div className="secciones">
          <UsuarioNuevoForm
            formData={formData}
            onChange={handleInputChange}
          />

          {formType === 'reemplazo' && (
            <UsuarioReemplazoForm
              formData={formData}
              onChange={handleInputChange}
              onUsuarioSeleccionado={handleUsuarioSeleccionado} // ✅ AÑADIDO AQUÍ
            />
          )}

          {formType === 'cargo' && (
            <CargoNuevoForm
              formData={formData}
              onChange={handleInputChange}
            />
          )}
        </div>

        <div className="submit-container">
          <button type="submit" className="enviar-btn">Enviar</button>
        </div>
      </form>
    </div>
  );
}
