// 📁 src/components/PruebaGoogle.jsx

import React from 'react';
import { enviarAFirebaseAAppsScript } from '../services/googleSheetsService';

export default function PruebaGoogle() {

  // 🔽 Función que se ejecuta cuando se envía el formulario
  const handleSubmit = async () => {
    // 📦 Aquí defines los datos que deseas enviar
    const datos = {
      action: 'nuevo_usuario', // o 'nuevo_cargo', 'reemplazo'
      nombre: 'Camilo García',
      cedula: '1234567890',
      empresa: 'Proservis',
      ciudad: 'Bogotá',
      fechaIngreso: '2025-08-03' // Puedes usar new Date().toISOString() si quieres fecha actual
    };

    try {
      // 🚀 Enviar los datos a Google Sheets
      const respuesta = await enviarAFirebaseAAppsScript(datos);
      console.log('✅ Enviado correctamente:', respuesta);
    } catch (error) {
      console.error('🚨 Hubo un error al enviar los datos:', error);
    }
  };

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Formulario de Usuario</h2>
      <button onClick={handleSubmit}>Enviar datos</button>
    </div>
  );
}
