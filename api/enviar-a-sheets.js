const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycby_om7lhUi8o3kJy1lVMdwN0nRXT6ObcpkZtZLg9QoGXBJ39iEvLjNIRSLSFnuNuWhv/exec';

const datosFinales = {
  nombreNuevo: formData.nombre,
  cedulaNuevo: formData.cedula,
  empresa: formData.empresa,
  ciudad: formData.ciudad,
  sistemas: {
    sorttime: formData.sortime,
    sap: formData.sap,
    tr3: formData.tr3,
    solvix: formData.solvix,
  },
  nombreReemplazo: formData.usuarioReemplazar,
  equipo: formData.equipo,
  celular: formData.celular,
  correo: formData.correo,
  solicitante: "Nombre del solicitante", // Opcional si deseas agregarlo
};

const response = await fetch(URL_APPS_SCRIPT, {
  method: 'POST',
  body: JSON.stringify(datosFinales),
  headers: { 'Content-Type': 'application/json' },
});

const resultado = await response.json();
console.log("📋 Respuesta del servidor:", resultado);

if (resultado.exito) {
  alert("✅ Enviado correctamente");
} else {
  alert("❌ Falló el envío");
}
