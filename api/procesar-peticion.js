// pages/api/procesar-peticion.js
import { PeticionController } from '../../src/controllers/peticionController';

export default async function handler(req, res) {
  // Solo permitir POST
  if (req.method !== 'POST') {
    return res.status(405).json({ 
      error: 'Método no permitido',
      allowedMethods: ['POST']
    });
  }

  try {
    const { usuario, peticion } = req.body;

    // Validar que lleguen los datos requeridos
    if (!usuario || !peticion) {
      return res.status(400).json({
        error: 'Faltan datos requeridos',
        required: ['usuario', 'peticion']
      });
    }

    // Procesar la petición
    const resultado = await PeticionController.procesarPeticion(usuario, peticion);

    return res.status(200).json({
      success: true,
      data: resultado,
      timestamp: new Date().toISOString()
    });

  } catch (error) {
    console.error('❌ Error en API:', error.message);
    
    return res.status(500).json({
      error: 'Error interno del servidor',
      message: error.message,
      timestamp: new Date().toISOString()
    });
  }
}