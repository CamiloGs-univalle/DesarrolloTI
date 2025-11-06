// src/utils/sendEmail.js
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
 * Construye el cuerpo del correo en base al tipo de solicitud
 */
export function buildSolicitudEmailBody(data) {
  const fechaTexto = formatDateToSpanishUpper(data.fechaIngreso);
  const tipo = data.formType || "Nuevo Usuario";

  if (tipo === "Cargo Nuevo") {
    // ✉️ Correo para CARGO NUEVO
    return (
      `Cordial saludo Equipo TI.
Por favor tu apoyo con la gestión de Permisos, Equipo y Correo para la siguiente persona que ingresa el día ${fechaTexto}, en la ciudad de ${data.ciudad}.

  Nombre: ${data.nombre}
  C.C: ${data.cedula}
  Cargo: ${data.cargo}
  Ciudad: ${data.ciudad}
  Empresa: ${data.empresa}
  Licencia: Utilizaba ${data.usuarioReemplazar || "Los que utiliza " + data.cargo || 'N/A'}
  Permisos: Utilizaba ${data.usuarioReemplazar || "Los que utiliza " + data.cargo || 'N/A'}
  Correo: ${data.correo || data.nuevoCorreo || 'N/A'}

Muchas gracias, quedamos atentos.`
    );
  }

  // ✉️ Correo para NUEVO USUARIO
  return (
    `Cordial saludo, Equipo TI.
Por favor tu apoyo con la gestión de Permisos, Equipo y Correo para la siguiente persona que ingresa el día ${fechaTexto}, en la ciudad de ${data.ciudad}.

  Nombre: ${data.nombre}
  C.C: ${data.cedula}
  Cargo: ${data.cargo}
  Ciudad: ${data.ciudad}
  Empresa: ${data.empresa}
  Licencia: Utilizaba ${data.usuarioReemplazar || "Los que utiliza " + data.cargo || 'N/A'}
  Permisos: Utilizaba ${data.usuarioReemplazar || "Los que utiliza " + data.cargo || 'N/A'}
  Correo: ${data.correo || data.nuevoCorreo || 'N/A'}

Muchas gracias, quedamos atentos.`
  );
}

/**
 * Abre Gmail (forzando que se use la cuenta logueada en Firebase)
 */
export function enviarSolicitudCorreo(destinatarios, data) {
  const tipo = data.formType || "Nuevo Usuario";
  const subject = `SOLICITUD USUARIO Y EQUIPO - ${data.nombre}`;
  const body = buildSolicitudEmailBody(data);

  // 🔑 Obtener correo del usuario autenticado
  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "";

  // 📧 URL de Gmail con la sesión correcta
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    destinatarios
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}${userEmail ? `&authuser=${encodeURIComponent(userEmail)}` : ""}`;

  // 🪟 Abre Gmail en una ventana nueva
  window.open(
    gmailURL,
    "_blank",
    "width=850,height=650,left=200,top=100,noopener,noreferrer"
  );
}
