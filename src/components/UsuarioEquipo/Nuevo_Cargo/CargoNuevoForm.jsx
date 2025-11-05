import { useState } from "react";
import "./CargoNuevoForm.css";
import { guardarPeticionConUsuarioSiNoExiste } from "../../../controllers/userController.js";

export default function CargoNuevoForm({ formData, onChange, formType = "Cargo Nuevo" }) {
  const [estadoEnvio, setEstadoEnvio] = useState("idle");
  const [loading, setLoading] = useState(false);
  const esCorporativo = formData.correoCorporativo;


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

  // --- MANEJO DE ENVÍO ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setEstadoEnvio("enviando");

    try {
      const datosUsuario = {
        nombre: formData.nombre.trim(),
        cedula: formData.cedula.trim(),
        correo: formData.correo.trim(),
        cargo: formData.cargo.trim(),
        empresa: formData.empresa.trim(),
        ciudad: formData.ciudad.trim(),
        fechaIngreso: formData.fechaIngreso,
      };

      const datosPeticion = {
        solicitante: formData.nombre.trim(),
        tipoSolicitud: formType,
        cargo: formData.cargo.trim(),
        empresa: formData.empresa.trim(),
        ciudad: formData.ciudad.trim(),
        comentario: formData.comentario || "",
        correoCorporativo: formData.correoCorporativo,
        nuevoCorreo: formData.nuevoCorreo,
      };

      const resultado = await guardarPeticionConUsuarioSiNoExiste(datosUsuario, datosPeticion);
      console.log("✅ Proceso completado. Cargo guardado:", resultado.cargo);

      setEstadoEnvio("enviado");
    } catch (error) {
      console.error("❌ Error:", error);
      setEstadoEnvio("error");
    } finally {
      setLoading(false);
    }
  };

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
            onChange={onChange}
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

        {/* CORREO CORPORATIVO */}
        <div className="campo">
          <label>
            <p>{esCorporativo ? "Correo Corporativo" : "Correo Gratuito"}</p>
          </label>
          <label className="switch">
            <input
              type="checkbox"
              name="correoCorporativo"
              checked={formData.correoCorporativo}
              onChange={onChange}
            />
            <span className="slider round"></span>
          </label>
          <p style={{ fontSize: "0.9em", color: "#555" }}>
            {esCorporativo
              ? "Se enviará solicitud a gerencia para crear este correo corporativo."
              : "Se enviará solicitud a TI para crear un correo gratuito."}
          </p>
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

        {/* COMENTARIO */}
        <div className="campo">
          <label htmlFor="comentario">Comentario</label>
          <textarea
            id="comentario"
            name="comentario"
            value={formData.comentario}
            onChange={onChange}
            placeholder="Comentarios adicionales sobre el cargo nuevo"
          ></textarea>
        </div>

        {/* BOTÓN DE ENVÍO */}
        <div className="campo">
          <button
            type="button"
            className="boton-enviar"
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Enviando..." : "Enviar Solicitud"}
          </button>
        </div>

        {estadoEnvio === "enviado" && (
          <p className="mensaje-enviado">✅ Solicitud enviada.</p>
        )}
        {estadoEnvio === "error" && (
          <p className="mensaje-error">❌ Error al enviar. Intenta nuevamente.</p>
        )}
      </div>
    </div>
  );
}
