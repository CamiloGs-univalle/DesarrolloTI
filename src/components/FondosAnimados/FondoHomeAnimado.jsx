import { useEffect, useRef } from "react";
import "./FondoHomeAnimado.css";

/**
 * 🌿 FondoHomeAnimado
 * Fondo animado tipo “burbujas verdes” para pantallas de formulario o home.
 * Compatible con contenedores flexibles y sin interferir con el contenido superior.
 */
export default function FondoHomeAnimado() {
  const canvasRef = useRef(null);
  const burbujasRef = useRef([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // Ajuste dinámico del tamaño del canvas
    const redimensionarCanvas = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };
    redimensionarCanvas();
    window.addEventListener("resize", redimensionarCanvas);

    // 🌱 Generar burbujas iniciales
    const crearBurbujas = (cantidad) => {
      burbujasRef.current = Array.from({ length: cantidad }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radio: 30 + Math.random() * 60,
        dx: (Math.random() - 0.5) * 1.2, // más rápido y natural
        dy: (Math.random() - 0.5) * 1.2,
         color: `rgba(${150 + Math.random() * 30}, ${180 + Math.random() * 30}, ${180 + Math.random() * 30}, 0.25)`
      }));
    };

    crearBurbujas(25);

    // 🎨 Animación principal
    const animarFondo = () => {
      const gradiente = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradiente.addColorStop(0, "#eeededff");
      gradiente.addColorStop(1, "#d3d3d3ff");
      ctx.fillStyle = gradiente;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      burbujasRef.current.forEach((b) => {
        ctx.beginPath();
        const gradienteBurb = ctx.createRadialGradient(
          b.x,
          b.y,
          b.radio * 0.2,
          b.x,
          b.y,
          b.radio
        );
        gradienteBurb.addColorStop(0, b.color);
        gradienteBurb.addColorStop(1, "transparent");
        ctx.fillStyle = gradienteBurb;
        ctx.arc(b.x, b.y, b.radio, 0, Math.PI * 2);
        ctx.fill();

        // Movimiento continuo y natural
        b.x += b.dx;
        b.y += b.dy;

        // Rebote suave en los bordes
        if (b.x - b.radio < 0 || b.x + b.radio > canvas.width) b.dx *= -1;
        if (b.y - b.radio < 0 || b.y + b.radio > canvas.height) b.dy *= -1;
      });

      requestAnimationFrame(animarFondo);
    };

    animarFondo();

    return () => {
      window.removeEventListener("resize", redimensionarCanvas);
    };
  }, []);

  return <canvas ref={canvasRef} className="canvas-fondo-formulario"></canvas>;
}
