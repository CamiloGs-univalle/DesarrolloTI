// src/utils/sendEmail.js
import { auth } from "../models/firebase/authService";

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
 * Construye el cuerpo del correo en base a los datos del formulario
 */
export function buildSolicitudEmailBody(data) {
  const fechaTexto = formatDateToSpanishUpper(data.fechaIngreso);

return (
`Cordial saludo, Equipo TI.
Por favor tu apoyo con la gestión de Permisos, Equipo y Correo para la siguiente persona que ingresa el día ${fechaTexto}, en la ciudad de ${data.ciudad}.

Nombre: ${data.nombre}
C.C: ${data.cedula}
Cargo: ${data.cargo}
Ciudad: ${data.ciudad}
Empresa: ${data.empresa}
Licencia: Utilizaba ${data.usuarioReemplazar || 'N/A'}
Permisos: Utilizaba ${data.usuarioReemplazar || 'N/A'}
Correo: Utilizaba ${data.correo || 'N/A'}

Muchas gracias, quedamos atentos.`
  );
}

/**
 * Abre Gmail (forzando que se use la cuenta logueada en Firebase)
 */
export function enviarSolicitudCorreo(destinatarios, data) {
  const subject = `Solicitud nuevo usuario - ${data.nombre}`;
  const body = buildSolicitudEmailBody(data);

  // 🔑 Intentar obtener el correo del usuario autenticado en Firebase
  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "";

  // ✅ Usamos Gmail con el parámetro authuser para abrir la cuenta correcta
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    destinatarios
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}${userEmail ? `&authuser=${encodeURIComponent(userEmail)}` : ""}`;

  // 🪟 Ventana emergente de Gmail con el usuario correcto
  window.open(
    gmailURL,
    "_blank",
    "width=850,height=650,left=200,top=100,noopener,noreferrer"
  );
}
