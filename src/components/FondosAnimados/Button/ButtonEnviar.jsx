// ======================================================
// ButtonEnviar.jsx
// Botón "Enviar" con animación de avión y check (fluida)
// Solo se anima cuando el formulario está completo.
// ======================================================

import React, { useState } from "react";
import "./ButtonEnviar.css";

const ButtonEnviar = ({ onClick, isFormValid }) => {
    const [isFlying, setIsFlying] = useState(false);
    const [isComplete, setIsComplete] = useState(false);

    const handleClick = () => {
        // 🚫 Si el formulario está incompleto o el botón ya está animando, no hace nada
        if (!isFormValid || isFlying || isComplete) return;

        setIsFlying(true);

        // ✅ Animación de vuelo
        setTimeout(() => setIsComplete(true), 2500);

        // ✈️ Regreso del avión
        setTimeout(() => {
            const plane = document.querySelector(".plane-icon");
            if (plane) plane.style.animation = "returnPlane 1.5s ease-out forwards";
        }, 3800);

        // 🔄 Reinicia el botón a su estado original
        setTimeout(() => {
            setIsFlying(false);
            setIsComplete(false);
            const plane = document.querySelector(".plane-icon");
            if (plane) plane.style.animation = "none";
        }, 5200);

        // Ejecuta la acción del padre (ej. enviar datos)
        if (onClick) onClick();
    };

    return (
        <button
            className={`send-button ${isFlying ? "flying" : ""} ${isComplete ? "complete" : ""
                } ${!isFormValid ? "disabled" : ""}`}
            onClick={handleClick}
            disabled={!isFormValid}
        >
            <div className="button-content">
                {/* ✈️ Ícono SVG del avión */}
                <svg
                    className="plane-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <line x1="22" y1="2" x2="11" y2="13" />
                    <polygon points="22 2 15 22 11 13 2 9 22 2" />
                </svg>

                <span className="text-enviar">Enviar</span>

                {/* Pista del avión */}
                <div className="runway"></div>

                {/* Texto final con check */}
                <span className="text-listo">
                    <span className="checkmark">✓</span>Listo
                </span>
            </div>
        </button>
    );
};

export default ButtonEnviar;
