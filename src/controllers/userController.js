import { db } from '../firebase';
import { collection, addDoc } from 'firebase/firestore';

const handleSubmit = async (e) => {
  e.preventDefault();

  // Reestructura los datos como espera el Apps Script
  const datosFinales = {
    solicitante: formData.nombre,
    nombreNuevo: formData.nombre,
    cedulaNuevo: formData.cedula,
    empresa: formData.empresa,
    ciudad: formData.ciudad,
    nombreReemplazo: formData.usuarioReemplazar,
    equipo: formData.equipo,
    celular: formData.celular,
    correo: formData.correo,
    sistemas: {
      sorttime: formData.sortime,
      tr3: formData.tr3,
      sap: formData.sap,
      solvix: formData.solvix
    }
  };

  try {
    // Guardar en Firebase
    const docRef = await addDoc(collection(db, 'usuarios'), datosFinales);
    console.log('✅ Guardado en Firebase con ID:', docRef.id);

    // Enviar a Google Sheets
    const response = await fetch('/api/enviar-a-sheets', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datosFinales),
    });

    const resultado = await response.json();
    console.log('✅ Respuesta Sheets:', resultado);

    alert('✅ Datos guardados en Firebase y Sheets correctamente');
  } catch (error) {
    console.error('❌ Error al enviar datos:', error);
    alert('❌ Error al guardar datos. Revisa la consola.');
  }
};
