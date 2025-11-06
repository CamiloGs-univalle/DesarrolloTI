// src/utils/sendInactivacionEmail.js

// 🔹 Importamos la autenticación desde Firebase (para obtener el correo del usuario logueado)
import { auth } from "../models/firebase/authService";

/**
 * 🗓️ Convierte una fecha ISO (YYYY-MM-DD) en formato español "10 OCTUBRE 2025"
 * @param {string} dateISO - Fecha en formato ISO (por ejemplo "2025-10-27")
 * @returns {string} - Fecha formateada en español y mayúsculas.
 */
export function formatDateToSpanishUpper(dateISO) {
  if (!dateISO) return ""; // Si no hay fecha, retornamos vacío

  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE",
  ];

  const d = new Date(dateISO); // Creamos un objeto Date con la fecha
  const day = String(d.getDate()).padStart(2, "0"); // Obtenemos día con dos dígitos
  const month = meses[d.getMonth()]; // Obtenemos el nombre del mes
  const year = d.getFullYear(); // Obtenemos el año

  return `${day} ${month} ${year}`; // Retornamos la fecha formateada
}

/**
 * 📄 Construye el cuerpo del correo para la solicitud de inactivación
 * @param {object} data - Datos del usuario (nombre, cédula, empresa, etc.)
 * @returns {string} - Texto completo del correo
 */
export function buildInactivacionEmailBody(data) {
  const fechaRetiro = formatDateToSpanishUpper(data.fechaRetiro);

  // Retornamos el texto con formato para Gmail
  return (
`Cordial saludo, equipo de TI.

Agradezco tu atención a esta solicitud.

Por favor, te solicito proceder con la inactivación de los usuarios correspondientes al personal que se encuentra laborando hasta el día ${fechaRetiro}.

Nombre: ${data.nombre || ""}
Cédula: ${data.cedula || ""}
Cargo: ${data.cargo || ""}
Ciudad: ${data.ciudad || ""}
Empresa: ${data.empresa || ""}
Fecha de retiro: ${fechaRetiro || ""}

Muchas gracias, quedamos atentos.`
  );
}

/**
 * 📧 Abre Gmail en una nueva ventana emergente con los datos del correo listos para enviar.
 * @param {string} destinatarios - Lista de correos destinatarios separados por coma
 * @param {object} data - Datos del usuario para rellenar el cuerpo del correo
 */
export function enviarSolicitudCorreoinactivacio(destinatarios, data) {
  // 📌 Asunto del correo
  const subject = `Solicitud inactivación de usuario - ${data.nombre}`;

  // 📜 Cuerpo del correo (usamos la función anterior)
  const body = buildInactivacionEmailBody(data);

  // 👤 Obtenemos el correo del usuario autenticado en Firebase
  const currentUser = auth.currentUser;
  const userEmail = currentUser?.email || "";

  // 🔗 Creamos la URL de Gmail con todos los parámetros necesarios
  const gmailURL = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    destinatarios
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(
    body
  )}${userEmail ? `&authuser=${encodeURIComponent(userEmail)}` : ""}`;

  // 🪟 Abrimos una ventana emergente de Gmail lista para enviar el correo
  window.open(
    gmailURL,
    "_blank",
    "width=850,height=650,left=200,top=100,noopener,noreferrer"
  );
}
