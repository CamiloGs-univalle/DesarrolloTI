// ======================================================
// LoginPage.jsx
// Página principal del login con layout tipo "Welcome / Sign in"
// ======================================================

// importaciones de React y hooks
import React, { useState } from "react";
// hook para navegar entre rutas (react-router-dom)
import { useNavigate } from "react-router-dom";
// componente del botón de Google (ya implementado abajo)
import LoginButton from "./LoginButton";
// fondo animado con formas
import FondoLogin from "../FondosAnimados/fondologin";
// estilos de la página
import "./Login.css";
import MascotaLogin from "../FondosAnimados/MascotaLogin";



// exportamos el componente principal
export default function LoginPage() {
  // estado para mensajes de error (vacío por defecto)
  const [error, setError] = useState("");

  // hook para redirigir al home después del login correcto
  const navigate = useNavigate();

  // función que se llamará cuando el login sea exitoso
  const handleLoginSuccess = (user) => {
    // mostramos en consola el nombre (útil para debugging)
    console.log("✅ Usuario logueado:", user?.displayName || user?.email || user);
    // redirigimos a la ruta /home (ajusta si tu ruta es otra)
    navigate("/home");
  };

  // JSX devuelto por el componente
  return (
    // contenedor general (envuelve fondo & contenido)
    <div className="login-wrapper">
      {/* componente que dibuja el fondo animado (círculos, líneas, degradado) */}
      <FondoLogin />

      {/* contenedor principal con el panel izquierdo (welcome) y derecho (login) */}
      <div className="login-container">
        {/* ===================== IZQUIERDA (WELCOME) ===================== */}
        <div className="welcome-section">
          {/* contenido de texto dentro de la izquierda */}
          <div className="welcome-content">
            {/* título grande tipo "Welcome!" */}
            <h1 className="welcome-title">Bienvenido!</h1>

            {/* subrayado corto (como en la imagen) */}
            <div className="welcome-underline" />

            {/* texto descriptivo */}
            <p className="welcome-text">
              Bienvenido a la plataforma Proservis TI.
              Podras crear e inactivar usuarios dentro de la Organización.
            </p>


            {/* logo de la empresa */}
            <div className="logo-container">
              <img
                src="/logo/ProservisTemporales.png"
                alt="Logo Proservis"
                className="logo-proservis"
              />
            </div>

          </div>
        </div>

        {/* ===================== DERECHA (LOGIN) ===================== */}
        <div className="login-section">
          {/* logo en la esquina superior derecha (puedes reemplazar por <img />) */}
          <div className="top-logo">
            <MascotaLogin />



          </div>

          {/* tarjeta con glassmorphism para el formulario */}
          <div className="login-card">
            {/* encabezado del formulario */}
            <h2 className="card-title">Iniciar Sesion</h2>

            {/* subtítulo o instrucción */}
            <p className="card-subtitle">Accede usando tu cuenta de Google</p>

            {/* componente botón de Google (muestra spinner cuando carga) */}
            <LoginButton setError={setError} onLoginSuccess={handleLoginSuccess} />

            {/* mostramos el error si existe */}
            {error && <div className="error">{error}</div>}

            {/* íconos de redes sociales o links auxiliares */}
            <div className="socials">
              <span className="social-dot" aria-hidden="true" />
              <span className="social-dot" aria-hidden="true" />
              <span className="social-dot" aria-hidden="true" />
            </div>
          </div>

          {/* footer inferior con marca */}
          <div className="bottom-footer">
            <p className="marca">
              PRO<span className="amarillo">SERVIS</span> © 2025
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
