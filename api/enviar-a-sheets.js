// api/enviar-a-sheets.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycby_om7lhUi8o3kJy1lVMdwN0nRXT6ObcpkZtZLg9QoGXBJ39iEvLjNIRSLSFnuNuWhv/exec';

  try {
    const response = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    return res.status(200).json({ mensaje: 'Datos enviados a Google Sheets', respuesta: data });
  } catch (error) {
    console.error('❌ Error:', error);
    return res.status(500).json({ error: 'Error al reenviar a Apps Script' });
  }
}
