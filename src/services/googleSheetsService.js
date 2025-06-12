export async function enviarAFirebaseAAppsScript(usuario) {
  try {
    const respuesta = await fetch('http://localhost:4000/enviar-a-sheets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(usuario)
    });

    const resultado = await respuesta.json();
    console.log('📤 Resultado desde Apps Script:', resultado);
  } catch (error) {
    console.error('❌ Error enviando a Sheets:', error);
  }
}
