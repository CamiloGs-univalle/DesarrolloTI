// ============================================================================
// 📄 Componente: FormInactivacion.jsx
// ----------------------------------------------------------------------------
// ✅ Permite seleccionar un usuario existente y generar una solicitud
//    de inactivación, guardándola en Firebase y Google Sheets, y
//    abriendo un correo preformateado en Gmail.
// ----------------------------------------------------------------------------
// 🔧 Dependencias:
// - Material UI → Autocomplete, TextField, CircularProgress
// - Hook personalizado useUsuarios → carga lista de usuarios desde Sheets
// - Función getLogoEmpresa → muestra el logo de la empresa según correo/nombre
// - enviarInactivacionCorreo → abre Gmail con los datos del usuario
// - guardarPeticionConUsuarioSiNoExiste → guarda en Firebase + Sheets
// ============================================================================

import { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useUsuarios } from "../../../hooks/useUsuarios";
import { getLogoEmpresa } from "../../../LogoEmpresa/LogoEmpresa";
import { enviarSolicitudCorreoinactivacio } from "../../../utils/sendEmailInactivacion"; // ✅ Importa la función corregida

export default function FormInactivacion({ onSubmitSuccess }) {
  // ============================================================
  // 🧩 1. Estado global del formulario
  // ------------------------------------------------------------
  // formData contiene todos los datos del usuario y del retiro.
  // ============================================================
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

  // ============================================================
  // ✏️ 2. Maneja los cambios manuales en los campos del formulario
  // ------------------------------------------------------------
  // Se actualiza el campo correspondiente en formData.
  // ============================================================
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ============================================================
  // 🔍 3. Rellena datos al seleccionar un usuario del Autocomplete
  // ------------------------------------------------------------
  // Carga automáticamente nombre, cédula, correo, etc.
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
  // 📤 4. Envía el formulario
  // ------------------------------------------------------------
  // 1️⃣ Valida los datos requeridos
  // 2️⃣ Guarda la solicitud en Firebase + Sheets
  // 3️⃣ Abre Gmail con la información del correo lista
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 🔸 Validación mínima antes de continuar
    if (!formData.nombre || !formData.fechaRetiro) {
      alert("Por favor completa el nombre y la fecha de retiro antes de enviar.");
      return;
    }

    try {
      // 1️⃣ Crea los datos de la petición
      const datosPeticion = {
        tipo: "Inactivación",
        estado: "Pendiente",
        fechaRetiro: formData.fechaRetiro,
        comentario: formData.comentario || "",
      };

      // 3️⃣ Genera el correo y abre Gmail
      enviarSolicitudCorreoinactivacio("aprendiz.ti1@proservis.com.co","auxiliar.ti@proservis.com.co", formData);

      // 4️⃣ Notifica al componente padre (si lo hay)
      if (onSubmitSuccess) onSubmitSuccess(formData);

    } catch (error) {
      console.error("❌ Error en el proceso de inactivación:", error);
      alert("Ocurrió un error al guardar o generar el correo.");
    }
  };

  // ============================================================
  // 🏢 5. Obtiene el logo de la empresa según correo o nombre
  // ============================================================
  const logoEmpresa =
    getLogoEmpresa(formData.empresa) || getLogoEmpresa(formData.correo);

  // ============================================================
  // 🧱 6. Renderizado visual del formulario
  // ------------------------------------------------------------
  // El formulario está dividido en dos secciones:
  // - Izquierda: usuario, cédula, cargo y logo
  // - Derecha: datos adicionales, fecha y comentario
  // ============================================================
  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="secciones">
          {/* ===================================================== */}
          {/* 🟦 SECCIÓN IZQUIERDA - Datos del usuario */}
          {/* ===================================================== */}
          <div className="seccion">
            <div className="titulo-seccion"><span>Usuario</span></div>

            <div className="grupo-campos">
              {/* 🔸 Campo de búsqueda de usuario */}
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

              {/* 🔸 Cédula */}
              <div className="campo">
                <label>Cédula</label>
                <input
                  name="cedula"
                  value={formData.cedula}
                  onChange={handleChange}
                />
              </div>

              {/* 🔸 Cargo */}
              <div className="campo">
                <label>Cargo</label>
                <input
                  name="cargo"
                  value={formData.cargo}
                  onChange={handleChange}
                />
              </div>

              {/* 🔸 Logo de empresa */}
              {logoEmpresa && (
                <div className="campo logo-empresa">
                  <img src={logoEmpresa} alt="logo empresa" width="180" />
                </div>
              )}
            </div>
          </div>

          {/* ===================================================== */}
          {/* 🟩 SECCIÓN DERECHA - Datos adicionales */}
          {/* ===================================================== */}
          <div className="seccion">
            <div className="titulo-seccion"><span>Datos Usuario</span></div>
            <div className="grupo-campos">
              {/* 🔸 Ciudad */}
              <div className="campo">
                <label>Ciudad</label>
                <input
                  name="ciudad"
                  value={formData.ciudad}
                  onChange={handleChange}
                />
              </div>

              {/* 🔸 Correo */}
              <div className="campo">
                <label>Correo</label>
                <input
                  type="email"
                  name="correo"
                  value={formData.correo}
                  onChange={handleChange}
                />
              </div>

              {/* 🔸 Empresa */}
              <div className="campo">
                <label>Empresa</label>
                <input
                  name="empresa"
                  value={formData.empresa}
                  onChange={handleChange}
                />
              </div>

              {/* 🔸 Fecha de retiro */}
              <div className="campo">
                <label>Fecha Retiro</label>
                <input
                  type="date"
                  name="fechaRetiro"
                  value={formData.fechaRetiro}
                  onChange={handleChange}
                />
              </div>

              {/* 🔸 Comentario adicional */}
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

        {/* ===================================================== */}
        {/* 🟨 BOTÓN FINAL DE ENVÍO */}
        {/* ===================================================== */}
        <div className="submit-container">
          <button type="submit" className="enviar-btn">
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
