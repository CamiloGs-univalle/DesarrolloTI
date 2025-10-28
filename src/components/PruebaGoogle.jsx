import React, { useEffect, useRef } from "react";
import "./PruebaGoogle.css";

const PruebaGoogle = () => {
  const fondoCanvasRef = useRef(null);

  useEffect(() => {
    const canvasFondo = fondoCanvasRef.current;
    const ctxFondo = canvasFondo.getContext("2d");
    let anchoVentana = (canvasFondo.width = window.innerWidth);
    let altoVentana = (canvasFondo.height = window.innerHeight);

    // 🎨 Crear las burbujas animadas del fondo
    const burbujasAnimadas = Array.from({ length: 25 }).map(() => ({
      posX: Math.random() * anchoVentana,
      posY: Math.random() * altoVentana,
      radio: 40 + Math.random() * 90,
      velX: (Math.random() - 0.5) * 1.2, // más rápido y natural
      velY: (Math.random() - 0.5) * 1.2,
      colorRGBA: `rgba(${40 + Math.random() * 80}, ${
        160 + Math.random() * 60
      }, ${40 + Math.random() * 80}, 0.25)`
    }));

    const animarFondo = () => {
      ctxFondo.clearRect(0, 0, anchoVentana, altoVentana);

      burbujasAnimadas.forEach((b) => {
        ctxFondo.beginPath();
        const gradiente = ctxFondo.createRadialGradient(
          b.posX,
          b.posY,
          b.radio * 0.2,
          b.posX,
          b.posY,
          b.radio
        );
        gradiente.addColorStop(0, b.colorRGBA);
        gradiente.addColorStop(1, "transparent");
        ctxFondo.fillStyle = gradiente;
        ctxFondo.arc(b.posX, b.posY, b.radio, 0, Math.PI * 2);
        ctxFondo.fill();

        // Movimiento continuo
        b.posX += b.velX;
        b.posY += b.velY;

        // Rebote suave
        if (b.posX - b.radio < 0 || b.posX + b.radio > anchoVentana)
          b.velX *= -1;
        if (b.posY - b.radio < 0 || b.posY + b.radio > altoVentana)
          b.velY *= -1;
      });

      requestAnimationFrame(animarFondo);
    };

    animarFondo();

    // Ajustar tamaño al redimensionar
    const ajustarCanvas = () => {
      anchoVentana = canvasFondo.width = window.innerWidth;
      altoVentana = canvasFondo.height = window.innerHeight;
    };

    window.addEventListener("resize", ajustarCanvas);
    return () => window.removeEventListener("resize", ajustarCanvas);
  }, []);

  return (
    <div className="fondo-prueba-contenedor">
      {/* Fondo animado */}
      <canvas ref={fondoCanvasRef} className="fondo-animado"></canvas>

      {/* Contenido principal */}
      <div className="contenido-superior">
        <div className="formulario-fondo">
          <h2>Formulario de Solicitud</h2>
          <p>Ejemplo de animación verde con movimiento dinámico 🌿</p>
        </div>
      </div>
    </div>
  );
};

export default PruebaGoogle;
