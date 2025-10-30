// ======================================================
// LoginButton.jsx
// Botón que inicia sesión con Google (usa signInWithGoogle desde tu servicio firebase)
// ======================================================

import React, { useState } from "react";
// importa tu función real de autenticación con Google desde tu servicio Firebase
import { signInWithGoogle } from "../../firebase/authService";
// icono y spinner (material icons)
// si no usas MUI, reemplaza por cualquier icono / texto simple
import GoogleIcon from "@mui/icons-material/Google";
import CircularProgress from "@mui/material/CircularProgress";

// exportamos el botón con props: setError y onLoginSuccess
export default function LoginButton({ setError, onLoginSuccess }) {
  // estado de carga para mostrar spinner y deshabilitar
  const [loading, setLoading] = useState(false);

  // función que ejecuta el proceso de login
  const handleLogin = async () => {
    // limpiamos errores previos
    setError("");
    // activamos loading
    setLoading(true);
    try {
      // llamamos a la función que abre popup de Google (implementa en tu authService)
      const user = await signInWithGoogle();
      // pasamos el usuario al handler del padre
      onLoginSuccess(user);
    } catch (err) {
      // si hay error, mostramos mensaje amigable
      console.error("Error en login Google:", err);
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      // siempre desactivamos loading
      setLoading(false);
    }
  };

  return (
    // botón con disabled cuando está en loading
    <button
      className="google-btn"
      onClick={handleLogin}
      disabled={loading}
      aria-label="Iniciar sesión con Google"
    >
      {/* mostramos spinner si carga, si no mostramos icono + texto */}
      {loading ? (
        <CircularProgress size={20} style={{ color: "white" }} />
      ) : (
        <>
          <GoogleIcon fontSize="small" />
          <span>Iniciar sesión con Google</span>
        </>
      )}
    </button>
  );
}
