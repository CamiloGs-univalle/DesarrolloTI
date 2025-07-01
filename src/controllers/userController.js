import { db } from '../firebase/firebase';
import { collection, addDoc } from 'firebase/firestore';

export async function guardarUsuario(datosFinales) {
  // Guarda en Firebase
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
}
