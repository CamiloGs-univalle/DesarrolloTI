import { useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import './InactivacionUsuario.css';
import { useUsuarios } from '../../hooks/useUsuarios';
import { enviarPeticionAAppsScript } from '../../services/PeticionGoogleExcel';
import {FirestoreService} from '../../firebase/firebaseService';

/**
 * Componente para gestionar la inactivación de usuarios
 * Envia datos a Firebase y a Google Sheets (peticiones)
 */
export default function InactivacionUsuario() {
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    ciudad: '',
    correo: '',
    empresa: '',
    fechaRetiro: '',
    comentario: '',
  });

  const { usuarios, loading } = useUsuarios();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleUsuarioSeleccionado = (usuario) => {
    if (usuario) {
      setFormData((prev) => ({
        ...prev,
        nombre: usuario.nombre || '',
        cedula: usuario.cedula || '',
        ciudad: usuario.ciudad || '',
        correo: usuario.correo || '',
        empresa: usuario.empresa || '',
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1. Guardar en Firebase
      await FirestoreService.guardarInactivacion(formData);

      // 2. Enviar a Google Sheets (PETICIONES)
      await enviarPeticionAAppsScript({
        action: 'nueva_peticion',
        motivo: 'inactivacion_usuario',
        ...formData
      });

      alert('✅ Solicitud de inactivación enviada correctamente.');
      setFormData({
        nombre: '',
        cedula: '',
        ciudad: '',
        correo: '',
        empresa: '',
        fechaRetiro: '',
        comentario: '',
      });
    } catch (error) {
      console.error('❌ Error al enviar solicitud:', error);
      alert('Error al enviar la solicitud. Revisa la consola.');
    }
  };

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="tipo-selector">
          <button type="button" className="active">Inactivación de Usuario</button>
        </div>

        <div className="secciones">
          {/* Sección Usuario */}
          <div className="seccion">
            <div className="titulo-seccion">
              <span>Usuario</span>
            </div>

            <div className="grupo-campos">
              <label htmlFor="buscar">Buscar usuario</label>
              <div className="campo_autocomplete">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Autocomplete
                    options={usuarios}
                    getOptionLabel={(option) => option.nombre || ''}
                    onChange={(e, value) => handleUsuarioSeleccionado(value)}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder="Escribe el nombre del usuario"
                        variant="outlined"
                        fullWidth
                        InputProps={{
                          ...params.InputProps,
                          style: { color: 'red', fontSize: '16px' },
                        }}
                      />
                    )}
                  />
                )}
              </div>

              <div className="campo">
                <label htmlFor="cedula">Cédula</label>
                <input
                  type="text"
                  name="cedula"
                  id="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          {/* Sección Datos Usuario */}
          <div className="seccion">
            <div className="titulo-seccion">
              <span>Datos Usuario</span>
            </div>

            <div className="grupo-campos">
              <div className="campo">
                <label htmlFor="ciudad">Ciudad</label>
                <input
                  type="text"
                  name="ciudad"
                  id="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>

              <div className="campo">
                <label htmlFor="correo">Correo</label>
                <input
                  type="email"
                  name="correo"
                  id="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              <div className="campo">
                <label htmlFor="empresa">Empresa</label>
                <input
                  type="text"
                  name="empresa"
                  id="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />
              </div>

              <div className="campo">
                <label htmlFor="fechaRetiro">Fecha Retiro</label>
                <input
                  type="date"
                  name="fechaRetiro"
                  id="fechaRetiro"
                  value={formData.fechaRetiro}
                  onChange={handleChange}
                />
              </div>

              <div className="campo campo-full">
                <label htmlFor="comentario">Comentario</label>
                <textarea
                  name="comentario"
                  id="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  rows={4}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="submit-container">
          <button type="submit" className="enviar-btn">Enviar</button>
        </div>
      </form>
    </div>
  );
}
