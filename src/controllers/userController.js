import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { enviarAFirebaseAAppsScript } from "../services/googleSheetsService";

export const guardarUsuario = async (usuario) => {
  try {
    const usuarioObj = {
      nombre: usuario.nombre,
      edad: usuario.edad,
      fecha: new Date().toLocaleDateString()
    };

    const docRef = await addDoc(collection(db, "usuarios"), usuarioObj);
    console.log("✅ Usuario guardado en Firebase con ID:", docRef.id);

    await enviarAFirebaseAAppsScript(usuarioObj);
    console.log("📤 Usuario enviado a Google Sheets");
  } catch (error) {
    console.error("❌ Error guardando usuario:", error);
  }
};
