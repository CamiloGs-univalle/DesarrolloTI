import React, { useEffect, useRef } from "react";
import "./MascotaLogin.css";

export default function MascotaLogin() {
  const containerRef = useRef(null);
  const leftEyeRef = useRef(null);
  const rightEyeRef = useRef(null);
  const leftPupilRef = useRef(null);
  const rightPupilRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    const leftEye = leftEyeRef.current;
    const rightEye = rightEyeRef.current;
    const leftPupil = leftPupilRef.current;
    const rightPupil = rightPupilRef.current;

    // === 🖱️ Movimiento de ojos ===
    const handleMouseMove = (e) => {
      const rect = container.getBoundingClientRect();
      const centerX = rect.left + rect.width / 2;
      const centerY = rect.top + rect.height / 2;

      const dx = e.clientX - centerX;
      const dy = e.clientY - centerY;
      const angle = Math.atan2(dy, dx);
      const distance = Math.min(Math.sqrt(dx * dx + dy * dy) / 30, 5);

      const moveX = Math.cos(angle) * distance;
      const moveY = Math.sin(angle) * distance;

      leftEye.style.transform = `translate(${moveX}px, ${moveY}px)`;
      rightEye.style.transform = `translate(${moveX}px, ${moveY}px)`;
    };

    window.addEventListener("mousemove", handleMouseMove);

    // === 👁️ Parpadeo natural ===
    const blink = () => {
      [leftPupil, rightPupil].forEach((p) => {
        p.classList.add("blink");
        setTimeout(() => p.classList.remove("blink"), 150);
      });
    };
    const blinkInterval = setInterval(() => blink(), 2000 + Math.random() * 1500);

    // === 😉 Guiño aleatorio ===
    const wink = () => {
      const p = Math.random() > 0.5 ? leftPupil : rightPupil;
      p.classList.add("wink");
      setTimeout(() => p.classList.remove("wink"), 250);
    };
    const winkInterval = setInterval(() => wink(), 5000 + Math.random() * 4000);

    // === 😊 Expresiones variadas ===
    const moods = ["happy", "surprised", "sad", "angry", "curious"];
    const randomExpression = () => {
      const mood = moods[Math.floor(Math.random() * moods.length)];
      [leftPupil, rightPupil].forEach((p) => p.classList.add(mood));
      setTimeout(() => [leftPupil, rightPupil].forEach((p) => p.classList.remove(mood)), 800);
    };
    const moodInterval = setInterval(() => randomExpression(), 7000 + Math.random() * 4000);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      clearInterval(blinkInterval);
      clearInterval(winkInterval);
      clearInterval(moodInterval);
    };
  }, []);

  return (
    <div className="mascota-login" ref={containerRef}>
      <div className="ojo" ref={leftEyeRef}>
        <div className="pupila" ref={leftPupilRef}></div>
      </div>
      <div className="ojo" ref={rightEyeRef}>
        <div className="pupila" ref={rightPupilRef}></div>
      </div>
    </div>
  );
}
