// src/components/UsuarioEquipo/Nuevo_Cargo/CargoNuevoForm.jsx
import { useState } from "react";
import "./CargoNuevoForm.css";
import { guardarPeticionConUsuarioSiNoExiste } from "../../../controllers/userController.js";
import { enviarSolicitudCorreo } from "../../../models/utils/sendEmail.js";
import { enviarUsuarioAAppsScript } from "../../../models/services/UserGoogleExcel.js"; // ✅ IMPORTA ESTA
import { getLogoEmpresa } from "../../../../public/LogoEmpresa/LogoEmpresa.js";

export default function CargoNuevoForm({
  formData,
  onChange,
  formType = "Cargo Nuevo",
}) {
  const [estadoEnvio, setEstadoEnvio] = useState("idle");
  const [loading, setLoading] = useState(false);

  const DESTINATARIOS_CORREO = [
    "aprendiz.ti1@proservis.com.co",
    "auxiliar.ti@proservis.com.co",
  ];

  const logoEmpresa =
    getLogoEmpresa(formData.empresa) || getLogoEmpresa(formData.correo);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstadoEnvio("enviando");

    try {
      // 🧾 Datos del usuario
      const datosUsuario = {
        nombre: formData.nombre?.trim().toUpperCase() || "",
        cedula: formData.cedula?.trim() || "",
        correo: formData.correo?.trim().toLowerCase() || "",
        cargo: formData.cargo?.trim().toUpperCase() || "",
        empresa: formData.empresa?.trim().toUpperCase() || "",
        ciudad: formData.ciudad?.trim().toUpperCase() || "",
        fechaIngreso: formData.fechaIngreso || "",
      };

      // 🧾 Datos de la petición
      const datosPeticion = {
        solicitante: formData.nombre?.trim().toUpperCase() || "",
        tipoSolicitud: formType,
        cargo: formData.cargo?.trim().toUpperCase() || "",
        empresa: formData.empresa?.trim().toUpperCase() || "",
        ciudad: formData.ciudad?.trim().toUpperCase() || "",
        comentario: formData.comentario?.trim() || "",
        correoCorporativo: formData.correoCorporativo || "",
        nuevoCorreo: formData.nuevoCorreo || "",
        fechaIngreso: formData.fechaIngreso || "",
      };

      // 💾 1️⃣ Guardar petición + usuario (en Firebase y Sheets de peticiones)
      const resultado = await guardarPeticionConUsuarioSiNoExiste(
        datosUsuario,
        datosPeticion
      );
      console.log("✅ Resultado de guardado:", resultado);

      // 💾 2️⃣ Guardar también en hoja de USUARIOS (Apps Script)
      await enviarUsuarioAAppsScript({
        action: "nuevo_usuario",
        ...datosUsuario,
        estado: "ACTIVO",
        observacion: "Cargo nuevo creado desde formulario",
      });
      console.log("📄 Usuario registrado en hoja de cálculo");

      // 📨 3️⃣ Enviar correo al área de TI
      enviarSolicitudCorreo(DESTINATARIOS_CORREO, {
        ...datosUsuario,
        ...datosPeticion,
      });

      setEstadoEnvio("enviado");
      alert("✅ Solicitud guardada, usuario registrado y correo enviado.");
    } catch (error) {
      console.error("❌ Error al enviar solicitud:", error);
      setEstadoEnvio("error");
      alert("❌ Error al guardar o enviar el correo.");
    } finally {
      setLoading(false);
    }
  };


  // --- LISTA DE CARGOS PARA AUTOCOMPLETAR ---
  const cargos = [
    "GERENTE",
    "SUPERVISOR",
    "DIRECTOR COMERCIAL",
    "DIRECTOR DE OPERACIONES",
    "COORDINADOR DE OPERACIONES",
    "LIDER COMERCIAL TALENTO HUMANO",
    "CONSULTOR DE SELECCION",
    "COORDINADOR DE OPERACION LOGISTICA",
    "SENA",
    "ANALISTA TI",
    "AUXILIAR TI",
    "LIDER DESARROLLO",
    "BACKUP",
    "DIRECTORA CONTABLE",
    "CONTADOR JUNIOR",
    "CONTADOR JUNIOR DE IMPUESTOS",
    "ANALISTA CONTABLE",
    "CONTROLLER FINANCIERO",
    "ANALISTA CONTABLE PT",
    "AUXILIAR DE ATRACCION DE TALENTO HUMANO",
    "PSICOLOGO DE ATRACCION Y TALENTO HUMANO",
    "ORIENTADOR DE CONTRATACION",
    "EMBAJADOR DE MARCA",
    "AUXILIAR ADMINISTRATIVO",
    "AUXILIAR DE CONTRATACION",
    "LIDER DE SELECCION",
    "DIRECTOR DE RECLUTAMIENTO-SELECCION Y CONTRATACION",
    "GESTOR DE SERVICIO DE TALENTO HUMANO",
    "CONSULTOR DE GESTION DE TALENTO HUMANO",
    "AUXILIAR DE RECEPCION",
    "ANALISTA DE EXPERIENCIA",
    "ANALISTA DE COMUNICACIONES",
    "DIRECTORA DE INNOVACION EXPERIENCIA",
    "AUXILIAR DE PAGOS",
    "DIRECTOR DE TESORERIA",
    "AUXILIAR DE TESORERIA",
    "AUXILIAR DE TESORERIA 2",
    "ANALISTA DE COMPRAS",
    "AUXILIAR DE FACTURACION",
    "EJECUTIVO DE SERVICIO",
    "EJECUTIVO DE TALENTO HUMANO",
    "GESTOR DE SERVICIO",
    "EJECUTIVO TH PEREIRA",
    "EJECUTIVO TH PASTO",
    "EJECUTIVO PROMOAMBIENTAL",
    "GESTOR PROMOAMBIENTAL",
    "GESTOR BANCOW",
    "GESTOR CARTAGENA",
    "EJECUTIVO BUGA",
    "EJECUTIVO IBAGUE",
    "EJECUTIVO BUCARAMANGA",
    "EJECUTIVO GIRARDOT",
    "AUXILIAR DE INCAPACIDADES",
    "AUXILIAR DE SEGURIDAD SOCIAL",
    "ANALISTA DE SEGURIDAD SOCIAL",
    "AUXILIAR DE NOMINA",
    "ANALISTA DE NOMINA",
    "ESPECIALISTA DE NOMINA Y SEGURIDAD SOCIAL",
    "DIRECTOR DE NOMINA Y SEGURIDAD SOCIAL",
    "DIRECTOR DE SEGURIDAD Y SALUD EN EL TRABAJO",
    "FISIOTERAPEUTA",
    "EJECUTIVO INTEGRAL",
    "ANALISTA DE PREVENCION",
    "GESTOR DE SEGURIDAD",
    "ASESOR EN PREVENCION",
    "ANALISTA EN MEDICINA LABORAL",
    "ANALISTA SEGURIDAD Y SALUD EN EL TRABAJO",
    "LIDER COMERCIAL SST",
    "DIRECTOR JURIDICO",
    "ANALISTA JURIDICO",
    "AUXILIAR DE GESTION HUMANA",
    "AUXILIAR GH 2",
    "DIRECTOR DE GESTION HUMANA",
    "AUDITORÍA Y CALIDAD",
    "ANALISTA DE CALIDAD",
    "LIDER OPERATIVO",
    "PRESIDENTE",
  ];

  // --- FILTRO DE AUTOCOMPLETADO ---
  const sugerenciasCargo = cargos.filter((c) =>
    c.toLowerCase().includes((formData.cargo || "").toLowerCase())
  );

  return (
    <div className="seccion seccion-dinamica">
      <div className="form-cargo">
        <h2 className="titulo-seccion">Cargo Nuevo</h2>

        {/* CARGO con autocompletado */}
        <div className="campo">
          <label htmlFor="cargo">Cargo</label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }}
            list="sugerenciasCargo"
            required
            placeholder="Escribe o selecciona un cargo"
          />
          <datalist id="sugerenciasCargo">
            {sugerenciasCargo.map((cargo, index) => (
              <option key={index} value={cargo} />
            ))}
          </datalist>
        </div>

        {/* NUEVO CORREO */}
        <div className="campo">
          <label htmlFor="nuevoCorreo">Correo a crear</label>
          <input
            type="email"
            id="nuevoCorreo"
            name="nuevoCorreo"
            value={formData.nuevoCorreo}
            onChange={onChange}
            required
            placeholder="Ej: usuario@empresa.com"
          />
        </div>

        {logoEmpresa && (
          <div className="campo logo-empresa">
            <img src={logoEmpresa} alt="logo empresa" width="180" />
          </div>
        )}
      </div>
    </div>
  );
}
