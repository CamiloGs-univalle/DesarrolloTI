// src/components/Login/LoginPage.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import "./Login.css";

export default function LoginPage() {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLoginSuccess = (user) => {
    console.log("🚀 Usuario logueado:", user.displayName);
    navigate("/home"); // <- redirige al home
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <h1>Bienvenido a Proservis TI</h1>
          <p>Inicia sesión con tu cuenta Google para continuar</p>
        </div>

        <LoginButton setError={setError} onLoginSuccess={handleLoginSuccess} />

        {error && <div className="error">{error}</div>}

        <div className="login-footer">
          <p className="marca">
            PRO<span className="amarillo">SERVIS</span> © 2025
          </p>
        </div>
      </div>
    </div>
  );
}
