// ======================================================
// FondoLogin.jsx
// src/components/FondosAnimados/fondologin.jsx
// Fondo animado con ondas irregulares y orgánicas
// Colores Proservis: verde y amarillo
// ======================================================

import "./FondoLogin.css";

export default function FondoLogin() {
  return (
    <div className="fondo-login" aria-hidden="true">
      {/* Patrón de fondo con puntos en forma de onda */}
      <div className="wave-grid" />
      
      {/* Contenedor de ondas principales irregulares */}
      <div className="waves-container">
        <div className="wave wave-1" />
        <div className="wave wave-2" />
        <div className="wave wave-3" />
        <div className="wave wave-4" />
        <div className="wave wave-5" />
      </div>
      
      {/* Líneas de onda que fluyen */}
      <div className="wave-line wave-line-1" />
      <div className="wave-line wave-line-2" />
      <div className="wave-line wave-line-3" />
      <div className="wave-line wave-line-4" />
      
      {/* Partículas que siguen patrones de onda */}
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      <div className="particle" />
      
      {/* Efectos de brillo con formas irregulares */}
      <div className="glow-effect glow-1" />
      <div className="glow-effect glow-2" />
      <div className="glow-effect glow-3" />
      
      {/* Overlay final para profundidad y suavizado */}
      <div className="overlay" />
    </div>
  );
}