export async function enviarRespuesta(solicitud, respuesta) {
  try {
    const payload = {
      correoDestino: solicitud.correo,
      asuntoOriginal: solicitud.asunto, // 👈 El asunto original
      cuerpo: `
        <p>Buen día.</p>
        <p>${respuesta}</p>
        <p>Quedo atento a cualquier inquietud.<br>Muchas gracias.</p>
      `,
    };

    const res = await fetch(
      "/api/proxyEmail", // ⚙️ URL del Apps Script
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      }
    );

    const data = await res.json();
    console.log("📨 Resultado:", data);
    return data.ok;
  } catch (err) {
    console.error("❌ Error al enviar respuesta:", err);
    return false;
  }
}
