import { auth } from "../firebase/authService";

/**
 * Convierte una fecha ISO (YYYY-MM-DD) en "06 SEPTIEMBRE 2025"
 */
export function formatDateToSpanishUpper(dateISO) {
  if (!dateISO) return "";
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
  ];
  const d = new Date(dateISO);
  const day = String(d.getDate()).padStart(2, "0");
  const month = meses[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

/**
 * Construye el cuerpo del correo (formato HTML) con todos los datos del formulario
 */
export function buildSolicitudEmailBody(data) {
  const fechaTexto = formatDateToSpanishUpper(data.fechaIngreso);

  // 🧩 Cuerpo del correo con HTML
  return `
<div style="font-family: Arial, sans-serif; color: #333; line-height: 1.5;">
  <p>Cordial saludo, <strong>Equipo TI</strong>.</p>

  <p>
    Por favor tu apoyo con la gestión de <strong>Permisos, Equipo y Correo</strong> para la siguiente persona que ingresa el día 
    <strong>${fechaTexto}</strong>, en la ciudad de <strong>${data.ciudad}</strong>.
  </p>

  <table style="border-collapse: collapse; margin-top: 10px;">
    <tr><td><strong>Nombre:</strong></td><td>${data.nombre}</td></tr>
    <tr><td><strong>C.C:</strong></td><td>${data.cedula}</td></tr>
    <tr><td><strong>Cargo:</strong></td><td>${data.cargo}</td></tr>
    <tr><td><strong>Ciudad:</strong></td><td>${data.ciudad}</td></tr>
    <tr><td><strong>Empresa:</strong></td><td>${data.empresa}</td></tr>
    <tr><td><strong>Licencia:</strong></td><td>${data.usuarioReemplazar || "N/A"}</td></tr>
    <tr><td><strong>Permisos:</strong></td><td>${data.usuarioReemplazar || "N/A"}</td></tr>
    <tr><td><strong>Correo a crear:</strong></td><td>${data.nuevoCorreo || data.correo || "N/A"}</td></tr>
  </table>

  <p style="margin-top: 15px;">Muchas gracias, quedamos atentos.</p>
</div>
`;
}

/**
 * Abre Gmail (forzando que se use la cuenta logueada en Firebase)
 */
export function enviarSolicitudCorreo(destinatarios, data) {
  const subject = `Solicitud nuevo usuario - ${data.nombre}`;
  const bodyHTML = buildSolicitudEmailBody(data);

  // 🔑 Intentar obtener el correo del usuario autenticado en Firebase
  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "";

  // 🧠 Gmail no permite abrir directamente un correo con HTML, así que usamos texto plano con saltos
  //    Gmail convertirá correctamente los saltos de línea (\n\n) a <br>
  const bodyText = bodyHTML
    .replace(/<[^>]+>/g, "") // eliminar etiquetas HTML
    .replace(/&nbsp;/g, " ") // limpiar espacios
    .replace(/\s+/g, " ")    // limpiar dobles espacios
    .trim();

  // ✅ URL de Gmail con datos prellenados
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    destinatarios
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    bodyText
  )}${userEmail ? `&authuser=${encodeURIComponent(userEmail)}` : ""}`;

  // 🪟 Abrir Gmail en ventana emergente
  window.open(
    gmailURL,
    "_blank",
    "width=850,height=650,left=200,top=100,noopener,noreferrer"
  );
}
