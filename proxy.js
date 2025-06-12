// proxy.js
import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
app.use(cors());
app.use(express.json());

const PORT = 4000;
const URL_APPS_SCRIPT = 'https://script.google.com/macros/s/AKfycbyeodFI7nM5VrTDXii6Nr6kxMvmyA1InIj1c74YMYE2Ju65BPf0dEw4_wVPagWAZU-2/exec';

app.post('/enviar-a-sheets', async (req, res) => {
  try {
    const response = await fetch(URL_APPS_SCRIPT, {
      method: 'POST',
      body: JSON.stringify(req.body),
      headers: { 'Content-Type': 'application/json' },
    });

    const data = await response.json();
    res.status(200).json({ mensaje: 'Datos enviados a Google Sheets', respuesta: data });
  } catch (error) {
    console.error('❌ Error al reenviar a Apps Script:', error);
    res.status(500).json({ error: 'Error al reenviar a Apps Script' });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Proxy escuchando en http://localhost:${PORT}`);
});
