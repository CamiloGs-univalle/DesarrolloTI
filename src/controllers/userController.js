import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { enviarAFirebaseAAppsScript } from "../services/googleSheetsService";

export const guardarUsuario = async (datos) => {
  try {
    const usuarioObj = {
      ...datos,
      fecha: new Date().toLocaleDateString(),
    };

    const docRef = await addDoc(collection(db, "usuarios"), usuarioObj);
    console.log("✅ Datos guardados en Firebase con ID:", docRef.id);

    await enviarAFirebaseAAppsScript(usuarioObj);
    console.log("📤 Datos enviados a Google Sheets");
  } catch (error) {
    console.error("❌ Error guardando usuario:", error);
  }
};

