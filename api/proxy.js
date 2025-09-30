// api/proxy.js

export default async function handler(req, res) {
  // Solo aceptamos POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  try {
    // URL del Apps Script desplegado como Web App
    const scriptUrl = 'https://script.google.com/macros/s/AKfycbzCSRPqTvZWxbuaq8pRqbGlS-Bz2KMt3ZvkAHlRoS_XS_-KBmXrIvBTxpLnhGr_et0xlA/exec';

    // Reenviamos la petición con los mismos headers y body
    const respuesta = await fetch(scriptUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    const textoRespuesta = await respuesta.text();

    // Intentar parsear como JSON
    try {
      const json = JSON.parse(textoRespuesta);
      return res.status(respuesta.status).json(json);
    } catch {
      return res.status(respuesta.status).send(textoRespuesta);
    }

  } catch (error) {
    console.error('❌ Error en proxy:', error);
    return res.status(500).json({ error: 'Error en el proxy', detalles: error.message });
  }
}
