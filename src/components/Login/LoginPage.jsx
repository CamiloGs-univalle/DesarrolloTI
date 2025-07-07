import React, { useState } from "react";
import LoginButton from "./LoginButton";
import "./Login.css";

export default function LoginPage() {
  const [error, setError] = useState("");

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-header">
          <img src="./public/logo/proservis.png" alt="Proservis" className="logo" />
          <h1>Bienvenido a Proservis TI</h1>
          <p>Inicia sesión con tu cuenta Google para continuar</p>
        </div>

        <LoginButton setError={setError} />

        {error && <div className="error">{error}</div>}

        <div className="login-footer">
          <p className="marca">PRO<span className="amarillo">SERVIS</span> © 2025</p>
        </div>
      </div>
    </div>
  );
}
