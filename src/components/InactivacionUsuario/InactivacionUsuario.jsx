// ============================================================================
// 📄 src/components/InactivacionUsuario/InactivacionUsuario.jsx
// ============================================================================

import { useState } from 'react';
import { Autocomplete, TextField, CircularProgress } from '@mui/material';
import './InactivacionUsuario.css';
import { useUsuarios } from '../../hooks/useUsuarios';
import { enviarPeticionAAppsScript } from '../../services/PeticionGoogleExcel';
import { FirestoreService } from '../../firebase/firebaseService';

/**
 * 🧩 Componente principal: Inactivación de Usuario
 * Este formulario permite seleccionar un usuario activo y generar
 * una solicitud de inactivación. Los datos se envían tanto a Firebase
 * como a Google Sheets (Peticiones).
 */
export default function InactivacionUsuario() {

  // ==============================================================
  // 🧠 Estado local del formulario
  // ==============================================================
  const [formData, setFormData] = useState({
    nombre: '',
    cedula: '',
    ciudad: '',
    correo: '',
    cargo: '',
    empresa: '',
    fechaRetiro: '',
    comentario: '',
  });

  // 🔎 Función para detectar el logo según el correo o la empresa
  const getLogoEmpresa = (texto) => {
    if (!texto) return null;
    const valor = texto.toLowerCase();

    if (valor.includes("proservis")) return "/logo/ProservisTemporales.png";
    if (valor.includes("affine")) return "/logo/Affine.png";
    if (valor.includes("siamo")) return "/logo/Siamo.png";
    if (valor.includes("mendiola")) return "/logo/Mendiola.png";
    if (valor.includes("anfibia")) return "/logo/Anfibia.png";
    if (valor.includes("samalo")) return "/logo/Samalo.png";

    return null;
  };

  // ✅ Se evalúa dinámicamente en cada render (reacciona a cambios en formData)
  const logoEmpresa =
    getLogoEmpresa(formData.empresa) ||
    getLogoEmpresa(formData.correo);


  // ==============================================================
  // 🔄 Hook personalizado que obtiene la lista de usuarios
  // ==============================================================
  const { usuarios, loading } = useUsuarios();

  // ==============================================================
  // 🖊️ Maneja cambios en los campos de texto
  // ==============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ==============================================================
  // 👤 Maneja la selección de un usuario desde el Autocomplete
  // ==============================================================
  const handleUsuarioSeleccionado = (usuario) => {
    if (usuario) {
      setFormData((prev) => ({
        ...prev,
        // ✅ Mapeo correcto de las claves reales del Google Sheet
        nombre: usuario["NOMBRE / APELLIDO"] || '',
        cedula: usuario["CEDULA"] || '',
        ciudad: usuario["CIUDAD"] || '',
        correo: usuario["CORREO"] || '',
        cargo: usuario["CARGO"] || '',
        empresa: usuario["EMPRESA"] || '',
      }));
    }
  };

  // ==============================================================
  // 📤 Envía los datos del formulario a Firebase y Google Sheets
  // ==============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // 1️⃣ Guardar en Firebase
      await FirestoreService.guardarInactivacion(formData);

      // 2️⃣ Enviar a Google Sheets (PETICIONES)
      await enviarPeticionAAppsScript({
        action: 'nueva_peticion',
        motivo: 'inactivacion_usuario',
        ...formData
      });

      // ✅ Notificar éxito y limpiar formulario
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
      alert('❌ Error al enviar la solicitud. Revisa la consola.');
    }
  };

  // ==============================================================
  // 🎨 Renderizado del formulario
  // ==============================================================
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>

        {/* 📦 Secciones principales */}
        <div className="secciones">

          {/* ======================================================
              🧍 Sección: Datos del Usuario
          ====================================================== */}
          <div className="seccion">
            <div className="titulo-seccion">
              <span>Usuario</span>
            </div>

            <div className="grupo-campos">

              {/* 🔍 Campo de búsqueda con Autocomplete */}
              <label htmlFor="buscar">Buscar usuario</label>
              <div className="campo_autocomplete">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Autocomplete
                    options={usuarios}
                    // 👇 Se muestra el nombre correctamente
                    getOptionLabel={(option) => option["NOMBRE / APELLIDO"] || ''}
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

              {/* 🪪 Campo: Cédula */}
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

              {/* 🪪 Campo: Cargo */}
              <div className="campo">
                <label htmlFor="cargo">Cargo</label>
                <input
                  type="text"
                  name="cargo"
                  id="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* 👇 Aquí se muestra dinámicamente el logo de la empresa */}
              {logoEmpresa && (
                <div
                  className="campo logo-empresa"
                  style={{
                    textAlign: "center",
                    marginTop: "10px",
                  }}
                >
                  <img
                    src={logoEmpresa}
                    alt="Logo de la empresa"
                    style={{
                      width: "180px",
                      maxWidth: "100%",
                      height: "auto",
                      borderRadius: "10px",
                      objectFit: "contain",
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          {/* ======================================================
              🗂️ Sección: Información adicional del usuario
          ====================================================== */}
          <div className="seccion">
            <div className="titulo-seccion">
              <span>Datos Usuario</span>
            </div>

            <div className="grupo-campos">
              {/* 🏙️ Ciudad */}
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

              {/* ✉️ Correo */}
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

              {/* 🏢 Empresa */}
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

              {/* 📅 Fecha de retiro */}
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

              {/* 💬 Comentario */}
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

        {/* 🚀 Botón de envío */}
        <div className="submit-container">
          <button type="submit" className="enviar-btn">
            Enviar
          </button>
        </div>
      </form>
    </div>
  );
}
