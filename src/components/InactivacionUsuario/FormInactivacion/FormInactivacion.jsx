// ============================================================================
// 📄 Componente: FormInactivacion.jsx - VERSIÓN CORREGIDA
// ============================================================================

import { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useUsuarios } from "../../../hooks/useUsuarios";
import { getLogoEmpresa } from "../../../../public/LogoEmpresa/LogoEmpresa";
import { enviarSolicitudCorreoinactivacio } from "../../../utils/sendEmailInactivacion";
import { guardarPeticionConUsuarioSiNoExiste } from "../../../controllers/userController";
import { inactivarUsuarioEnSheets } from "../../../services/UserGoogleExcel";

export default function FormInactivacion({ onSubmitSuccess }) {
  const { usuarios, loading } = useUsuarios();

  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    ciudad: "",
    correo: "",
    cargo: "",
    empresa: "",
    fechaRetiro: "",
    comentario: "",
  });

  const [enviando, setEnviando] = useState(false);

  // ============================================================
  // ✏️ Manejo de cambios manuales
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // 🔍 Selección automática de usuario
  // ============================================================
  const handleUsuarioSeleccionado = (usuario) => {
    if (!usuario) return;
    setFormData({
      nombre: usuario["NOMBRE / APELLIDO"] || "",
      cedula: usuario["CEDULA"] || "",
      ciudad: usuario["CIUDAD"] || "",
      correo: usuario["CORREO"] || "",
      cargo: usuario["CARGO"] || "",
      empresa: usuario["EMPRESA"] || "",
      fechaRetiro: "",
      comentario: "",
    });
  };

  // ============================================================
  // 📤 Envío del formulario (inactivar → guardar → correo)
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ✅ Validaciones
    if (!formData.nombre || !formData.fechaRetiro) {
      alert("Por favor completa el nombre y la fecha de retiro antes de enviar.");
      return;
    }

    if (!formData.cedula) {
      alert("No se puede inactivar un usuario sin cédula.");
      return;
    }

    setEnviando(true);

    try {
      // 1️⃣ INACTIVAR USUARIO EN GOOGLE SHEETS
      //console.log("🔄 Inactivando usuario en Google Sheets...", formData.cedula);
      await inactivarUsuarioEnSheets(formData.cedula);
      
      // 2️⃣ Datos del usuario para Firebase
      const usuarioData = {
        nombre: formData.nombre,
        cedula: formData.cedula,
        correo: formData.correo,
        cargo: formData.cargo,
        empresa: formData.empresa,
        ciudad: formData.ciudad,
        proceso: "GESTION HUMANA",
        estado: "INACTIVO"
      };

      // 3️⃣ Datos de la petición
      const peticionData = {
        tipoSolicitud: "INACTIVACION",
        fechaIngreso: formData.fechaRetiro,
        comentario: formData.comentario,
        solicitante: formData.nombre,
        estado: "PENDIENTE",
        sistemas: { 
          solvix: false, 
          tr3: false, 
          sap: false, 
          sortime: false 
        },
        usuarioReemplazar: {
          nombre: formData.nombre,
          correo: formData.correo,
          celular: "",
          equipo: formData.cargo,
          cedula: formData.cedula
        },
      };

//      console.log("📦 Enviando datos a Firebase...");

      // 4️⃣ Guardar en Firebase
      const resultadoFirebase = await guardarPeticionConUsuarioSiNoExiste(
        usuarioData,
        peticionData
      );

      if (resultadoFirebase.success) {
       // console.log("✅ Solicitud de inactivación guardada correctamente");
        
        // 5️⃣ Enviar el correo de notificación
        enviarSolicitudCorreoinactivacio(
          "aprendiz.ti1@proservis.com.co,auxiliar.ti@proservis.com.co",
          formData
        );

        // 6️⃣ Limpiar formulario
        setFormData({
          nombre: "",
          cedula: "",
          ciudad: "",
          correo: "",
          cargo: "",
          empresa: "",
          fechaRetiro: "",
          comentario: "",
        });

        // 7️⃣ Notificar éxito
        alert("✅ Usuario inactivado correctamente. Solicitud enviada al área de TI.");

        // 8️⃣ Notificar al componente padre
        if (onSubmitSuccess) {
          onSubmitSuccess(resultadoFirebase);
        }

      } else {
        throw new Error(resultadoFirebase.message || "Error al guardar en Firebase");
      }

    } catch (error) {
      console.error("❌ Error en la solicitud de inactivación:", error);
      alert(`Error al procesar la solicitud: ${error.message}`);
    } finally {
      setEnviando(false);
    }
  };

  // ============================================================
  // 🏢 Logo de la empresa
  // ============================================================
  const logoEmpresa = getLogoEmpresa(formData.empresa) || getLogoEmpresa(formData.correo);

  // ============================================================
  // 🧱 Renderizado del formulario
  // ============================================================
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="secciones">
          {/* 🟦 SECCIÓN IZQUIERDA */}
          <div className="seccion">
            <div className="titulo-seccion"><span>Usuario</span></div>

            <div className="grupo-campos">
              <label>Buscar usuario</label>
              <div className="campo_autocomplete">
                {loading ? (
                  <CircularProgress size={24} />
                ) : (
                  <Autocomplete
                    options={usuarios}
                    getOptionLabel={(option) => option["NOMBRE / APELLIDO"] || ""}
                    onChange={(e, val) => handleUsuarioSeleccionado(val)}
                    renderInput={(params) => (
                      <TextField 
                        {...params} 
                        placeholder="Escribe el nombre del usuario" 
                        fullWidth 
                      />
                    )}
                  />
                )}
              </div>

              <div className="campo">
                <label>Cédula</label>
                <input 
                  name="cedula" 
                  value={formData.cedula} 
                  onChange={handleChange} 
                  readOnly 
                />
              </div>

              <div className="campo">
                <label>Cargo</label>
                <input 
                  name="cargo" 
                  value={formData.cargo} 
                  onChange={handleChange} 
                  readOnly 
                />
              </div>

              {logoEmpresa && (
                <div className="campo logo-empresa">
                  <img src={logoEmpresa} alt="logo empresa" width="180" />
                </div>
              )}
            </div>
          </div>

          {/* 🟩 SECCIÓN DERECHA */}
          <div className="seccion">
            <div className="titulo-seccion"><span>Datos Usuario</span></div>

            <div className="grupo-campos">
              <div className="campo">
                <label>Ciudad</label>
                <input 
                  name="ciudad" 
                  value={formData.ciudad} 
                  onChange={handleChange} 
                  readOnly 
                />
              </div>

              <div className="campo">
                <label>Correo</label>
                <input 
                  type="email" 
                  name="correo" 
                  value={formData.correo} 
                  onChange={handleChange} 
                  readOnly 
                />
              </div>

              <div className="campo">
                <label>Empresa</label>
                <input 
                  name="empresa" 
                  value={formData.empresa} 
                  onChange={handleChange} 
                  readOnly 
                />
              </div>

              <div className="campo">
                <label>Fecha Retiro *</label>
                <input 
                  type="date" 
                  name="fechaRetiro" 
                  value={formData.fechaRetiro} 
                  onChange={handleChange} 
                  required 
                />
              </div>

              <div className="campo campo-full">
                <label>Comentario</label>
                <textarea
                  name="comentario"
                  value={formData.comentario}
                  onChange={handleChange}
                  rows={4}
                  placeholder="Motivo o detalles adicionales..."
                />
              </div>
            </div>
          </div>
        </div>

        {/* BOTÓN DE ENVÍO */}
        <div className="submit-container">
          <button 
            type="submit" 
            className="enviar-btn"
            disabled={enviando}
          >
            {enviando ? "Inactivando usuario..." : "Inactivar usuario"}
          </button>
        </div>
      </form>
    </div>
  );
}