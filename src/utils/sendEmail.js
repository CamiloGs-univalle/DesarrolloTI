// src/utils/sendEmail.js

/**
 * Convierte una fecha ISO (YYYY-MM-DD) en "06 SEPTIEMBRE 2025"
 */
export function formatDateToSpanishUpper(dateISO) {
  if (!dateISO) return "";
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
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
`Buen día.

Por favor tu apoyo con la gestión de Permisos, Equipo y Correo para la siguiente persona que ingresa el día ${fechaTexto}, en la ciudad de ${data.ciudad}.

Nombre: ${data.nombre}
C.C.: ${data.cedula}
Cargo: ${data.cargo}
Ciudad: ${data.ciudad}

Licencia: Utilizaba ${data.usuarioReemplazar || 'N/A'}
Permisos: Utilizaba ${data.usuarioReemplazar || 'N/A'}
Correo: Utilizaba ${data.usuarioReemplazar || 'N/A'}

Comentario: ${data.comentario || 'Sin comentarios'}

Muchas gracias, quedamos atentos.`
  );
}

/**
 * Abre Gmail/cliente de correo con mailto
 */
export function enviarSolicitudCorreo(destinatarios, data) {
  const subject = `Solicitud nuevo usuario - ${data.nombre}`;
  const body = buildSolicitudEmailBody(data);

  const mailtoURL = `mailto:${destinatarios}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // 🪟 Ventana emergente para Gmail
  window.open(
    mailtoURL,
    "_blank",
    "width=850,height=650,left=200,top=100,noopener,noreferrer"
  );
}
