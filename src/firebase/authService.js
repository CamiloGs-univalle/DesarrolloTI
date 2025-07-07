// src/firebase/authService.js
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { app } from "./firebase"; // ✅ Reutilizando la instancia de app

const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

/**
 * Inicia sesión con Google usando Firebase Auth
 * @returns {Promise<User>} usuario autenticado
 */
export async function signInWithGoogle() {
  try {
    const result = await signInWithPopup(auth, googleProvider);
    const user = result.user;
    console.log("✅ Usuario autenticado:", user);
    return user;
  } catch (error) {
    console.error("❌ Error en el login:", error);
    throw error;
  }
}

export { auth };
