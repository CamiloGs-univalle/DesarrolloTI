/**
 * Simulación mejorada de envío de correos electrónicos
 * @module sendEmail
 */

/**
 * Función para simular el envío de correos (en desarrollo)
 * @param {Object} params - Parámetros del correo
 * @param {string} params.to - Destinatario del correo
 * @param {string} params.subject - Asunto del correo
 * @param {string} params.body - Cuerpo del mensaje
 * @returns {Promise<Object>} Resultado de la operación
 */
async function sendEmail({ to, subject, body }) {
  console.group("📤 Simulación de Envío de Correo");
  console.log("➡️ Para:", to);
  console.log("✉️ Asunto:", subject);
  console.log("📝 Mensaje:\n", body);
  console.groupEnd();

  // Simulamos un retraso de red
  await new Promise(resolve => setTimeout(resolve, 1500));

  // En producción, aquí iría la conexión real con el servicio de correo
  return { success: true, message: "Correo simulado enviado con éxito" };
}

/**
 * Envía solicitud de correo corporativo
 * @param {string} nuevoCorreo - Dirección de correo a crear
 * @param {string} comentario - Justificación de la solicitud
 * @returns {Promise<Object>} Resultado del envío
 */
export async function enviarCorreoCorporativo(nuevoCorreo, comentario) {
  const cuerpoGerencia = `
    SOLICITUD DE APROBACIÓN - CORREO CORPORATIVO

    📌 Detalles de la solicitud:
    - Correo solicitado: ${nuevoCorreo}
    - Justificación: ${comentario || "No especificado"}

    Por favor responder con:
    - "APROBADO" para autorizar la creación
    - "RECHAZADO" si no se aprueba (indicar motivo)

    Atentamente,
    Gestión Humana
    Proservis S.A.
  `;

  const cuerpoTI = `
    NOTIFICACIÓN DE SOLICITUD RECIBIDA

    Se ha registrado una solicitud para creación de correo corporativo:

    - Dirección: ${nuevoCorreo}
    - Tipo: Corporativo
    - Estado: Pendiente de aprobación

    Por favor espere la confirmación de gerencia.
  `;

  // Envío a Gerencia (aprendiz.ti@proservis.com.co)
  const resultadoGerencia = await sendEmail({
    to: "aprendiz.ti@proservis.com.co",
    subject: `[SOLICITUD] Aprobación correo: ${nuevoCorreo}`,
    body: cuerpoGerencia
  });

  // Envío copia a Gestión Humana (camilo13369@gmail.com)
  const resultadoGH = await sendEmail({
    to: "camilo13369@gmail.com",
    subject: `[COPIA] Solicitud enviada para ${nuevoCorreo}`,
    body: cuerpoTI
  });

  return { resultadoGerencia, resultadoGH };
}

/**
 * Envía solicitud de correo gratuito
 * @param {string} nuevoCorreo - Dirección de correo a crear
 * @param {string} comentario - Justificación de la solicitud
 * @returns {Promise<Object>} Resultado del envío
 */
export async function enviarCorreoGratuito(nuevoCorreo, comentario) {
  const cuerpoTI = `
    SOLICITUD DE CORREO GRATUITO

    📌 Detalles de la solicitud:
    - Correo solicitado: ${nuevoCorreo}
    - Justificación: ${comentario || "No especificado"}

    Por favor proceder con la creación del correo.

    Atentamente,
    Gestión Humana
    Proservis S.A.
  `;

  return await sendEmail({
    to: "aprendiz.ti@proservis.com.co",
    subject: `[SOLICITUD] Creación correo gratuito: ${nuevoCorreo}`,
    body: cuerpoTI
  });
}