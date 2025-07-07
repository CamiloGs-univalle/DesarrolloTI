import React, { useState } from "react";
import { signInWithGoogle } from "../../firebase/authService";
import GoogleIcon from "@mui/icons-material/Google";
import CircularProgress from "@mui/material/CircularProgress";


export default function LoginButton({ setError }) {
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    setError("");
    setLoading(true);
    try {
      await signInWithGoogle();
      // 🔥 Redirigir a la app
      window.location.href = "/dashboard";
    } catch (error) {
      setError("Error al iniciar sesión. Intenta nuevamente.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <button className="google-btn" onClick={handleLogin} disabled={loading}>
      {loading ? <CircularProgress size={24} /> : <>
        <GoogleIcon /> Iniciar sesión con Google
      </>}
    </button>
  );
}
