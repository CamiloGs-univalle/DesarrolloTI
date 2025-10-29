// ============================================================================
// 📄 Componente: FormInactivacion.jsx
// ----------------------------------------------------------------------------
// ✅ Permite seleccionar un usuario existente y generar una solicitud
//    de inactivación, guardándola en Firebase y luego eliminándola.
//    También abre el correo preformateado para el área de TI.
// ----------------------------------------------------------------------------
// 🔧 Dependencias:
// - Material UI → Autocomplete, TextField, CircularProgress
// - Hook useUsuarios → carga lista de usuarios desde Sheets
// - getLogoEmpresa → obtiene el logo de la empresa
// - enviarSolicitudCorreoinactivacio → abre Gmail con los datos del usuario
// - guardarPeticionConUsuarioSiNoExiste → guarda la solicitud en Firebase
// - deleteDoc, doc → eliminan la solicitud de Firebase
// ============================================================================

import { useState } from "react";
import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useUsuarios } from "../../../hooks/useUsuarios";
import { getLogoEmpresa } from "../../../LogoEmpresa/LogoEmpresa";
import { enviarSolicitudCorreoinactivacio } from "../../../utils/sendEmailInactivacion";
import { guardarPeticionConUsuarioSiNoExiste } from "../../../controllers/userController";
import { deleteDoc, doc } from "firebase/firestore";
import { db } from "../../../firebase/firebase"; // ✅ Asegúrate de tener tu config correcta


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
  // 📤 Envío del formulario (guardar → correo → eliminar)
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nombre || !formData.fechaRetiro) {
      alert("Por favor completa el nombre y la fecha de retiro antes de enviar.");
      return;
    }

    try {
      // 1️⃣ Datos del usuario
      const usuarioData = {
        nombre: formData.nombre,
        cedula: formData.cedula,
        correo: formData.correo,
        cargo: formData.cargo,
        empresa: formData.empresa,
        ciudad: formData.ciudad,
        proceso: "GESTION HUMANA",
      };

      // 2️⃣ Datos de la petición
      const peticionData = {
        tipoSolicitud: "INACTIVACION",
        fechaIngreso: formData.fechaRetiro,
        comentario: formData.comentario,
        solicitante: formData.nombre,
        estado: "PENDIENTE",
        sistemas: { solvix: false, tr3: false, sap: false, sortime: false },
        usuarioReemplazar: {
          nombre: formData.nombre,
          correo: formData.correo,
          celular: "",
          equipo: formData.cargo,
        },
      };

      console.log("📦 Enviando datos a Firebase (INACTIVACION)...", {
        usuarioData,
        peticionData,
      });

      // 3️⃣ Guardar en Firebase
      const resultado = await guardarPeticionConUsuarioSiNoExiste(
        usuarioData,
        peticionData
      );

      if (resultado.success && resultado.id) {
        console.log("🟢 Solicitud guardada con ID:", resultado.id);
      } else {
        console.warn("⚠️ No se devolvió ID desde Firebase.");
      }

      // 4️⃣ Enviar el correo
      enviarSolicitudCorreoinactivacio(
        "aprendiz.ti1@proservis.com.co,auxiliar.ti@proservis.com.co",
        formData
      );

      // 5️⃣ Eliminar la solicitud guardada en Firebase (después de procesarla)
      if (resultado.success && resultado.id) {
        await deleteDoc(doc(db, "peticiones", resultado.id));
        console.log("🗑️ Solicitud eliminada de Firebase correctamente.");
      }

      // 6️⃣ Notificar éxito
      alert("✅ Solicitud de inactivación enviada y eliminada correctamente.");
      if (onSubmitSuccess) onSubmitSuccess(formData);


    } catch (error) {
      console.error("❌ Error en la solicitud de inactivación:", error);
      alert("Ocurrió un error al procesar la solicitud en Firebase.");
    }
  };

  // ============================================================
  // 🏢 Logo de la empresa
  // ============================================================
  const logoEmpresa =
    getLogoEmpresa(formData.empresa) || getLogoEmpresa(formData.correo);

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
                      <TextField {...params} placeholder="Escribe el nombre del usuario" fullWidth />
                    )}
                  />
                )}
              </div>

              <div className="campo">
                <label>Cédula</label>
                <input name="cedula" value={formData.cedula} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Cargo</label>
                <input name="cargo" value={formData.cargo} onChange={handleChange} />
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
                <input name="ciudad" value={formData.ciudad} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Correo</label>
                <input type="email" name="correo" value={formData.correo} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Empresa</label>
                <input name="empresa" value={formData.empresa} onChange={handleChange} />
              </div>

              <div className="campo">
                <label>Fecha Retiro</label>
                <input type="date" name="fechaRetiro" value={formData.fechaRetiro} onChange={handleChange} />
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
          <button type="submit" className="enviar-btn">
            Enviar solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
