// ======================================================
// LoginPage.jsx
// Página principal del login con layout tipo "Welcome / Sign in"
// ======================================================

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoginButton from "./LoginButton";
import "./Login.css";
import MascotaLogin from "../FondosAnimados/MascotaLogin";
import Login_Fondo from "../FondosAnimados/Login_Fondo";

// ======================================================
// Lista de mensajes motivadores (puedes agregar o modificar los que quieras)
// ======================================================
const mensajesMotivadores = [
  "Cada inicio de sesión es una nueva oportunidad para crecer 🌱",
  "¡Bienvenido! Hoy es un gran día para lograr algo increíble 🚀",
  "El trabajo en equipo transforma los retos en éxitos 💪",
  "Tu esfuerzo impulsa el éxito de toda la organización 🌟",
  "Confía en ti, el cambio comienza contigo ✨",
  "Gracias por ser parte de Proservis TI. ¡Sigamos creciendo juntos! 🤝",
  "Grandes cosas suceden cuando trabajamos con pasión 💼",
  "Tu dedicación hace la diferencia cada día 💙",
  "El éxito no se logra solo, se construye en equipo 🧩",
  "Hoy puede ser el día en que superes tus propios límites 🔥",
  "Cada meta alcanzada comienza con una decisión: intentarlo 🌈",
  "Tu actitud positiva es el motor del cambio 💫",
  "Haz de cada día una nueva oportunidad para aprender 📘",
  "Juntos hacemos que las ideas se conviertan en logros 🧠",
  "Sonríe, estás a un paso de algo genial 😄",
  "El esfuerzo de hoy es el éxito de mañana 🕒",
  "Tu compromiso inspira a quienes te rodean 💪",
  "Pequeñas acciones crean grandes resultados 🌟",
  "Nunca subestimes el poder de una buena actitud 🌞",
  "Haz lo mejor que puedas, donde estés, con lo que tengas 💡",
  "Cada desafío es una oportunidad para crecer 🌿",
  "Confía en el proceso, estás avanzando 💭",
  "Las grandes historias comienzan con un primer paso 👣",
  "Eres parte esencial de este equipo 🤝",
  "Sigue adelante, el esfuerzo siempre da frutos 🍀",
  "Hoy es un buen día para empezar algo nuevo 🌅",
  "Cree en ti tanto como nosotros creemos en ti 💙",
  "El éxito llega cuando la preparación se encuentra con la oportunidad 🎯",
  "Tu trabajo impulsa el crecimiento de todos 💼",
  "Lo que haces con pasión deja huella 💖",
  "Nada grande se logra sin entusiasmo 💥",
  "Comparte tu energía positiva con el mundo ✨",
  "Tus ideas construyen el futuro de Proservis TI 💡",
  "Sé la razón por la que alguien sonría hoy 😊",
  "Aprende, mejora y sigue brillando 🌟",
  "Los pequeños avances también cuentan 🧩",
  "Eres más capaz de lo que imaginas 💭",
  "Haz de tu trabajo una historia que valga la pena contar 📘",
  "Cada inicio marca un nuevo capítulo 📖",
  "Tu talento es el corazón de esta organización ❤️",
  "Juntos llegamos más lejos 🚀",
  "La excelencia se construye día a día 🛠️",
  "Tu energía hace la diferencia ⚡",
  "Los retos son oportunidades disfrazadas 💎",
  "Gracias por dar siempre lo mejor de ti 🙌",
  "Un pequeño esfuerzo extra marca una gran diferencia 🌈",
  "El entusiasmo es contagioso, ¡espárcelo! 😄",
  "Sé constante, los resultados llegarán 🕰️",
  "La innovación comienza con una buena idea 💭",
  "Confía en tu capacidad para resolver cualquier reto 💪",
  "Tu tiempo y dedicación son valiosos ⏳",
  "Celebra tus logros, por pequeños que sean 🎉",
  "El éxito se construye con disciplina y pasión 🔧",
  "Hoy es el momento perfecto para avanzar 🚶‍♂️",
  "Lo mejor está por venir ✨",
  "Comparte tu conocimiento, multiplica el éxito 📚",
  "Gracias por ser parte de esta historia 💙",
  "Eres una pieza clave en nuestro crecimiento 🧩",
  "Trabajar con propósito cambia todo 💫",
  "Tu compromiso inspira a los demás 🔥",
  "Pequeños pasos crean grandes caminos 👣",
  "Haz que cada día cuente 🕊️",
  "Proservis TI crece contigo 🚀",
  "Donde hay colaboración, hay éxito 🤝",
  "No hay límites para quien se esfuerza 🌠",
  "Tu talento nos impulsa a seguir mejorando 💡",
  "Con actitud y pasión, todo es posible 💪",
  "El cambio comienza con una acción 👏",
  "Haz de cada día una obra maestra 🎨",
  "Cree, crea y crece 🌱",
  "Tu esfuerzo no pasa desapercibido 👀",
  "El trabajo en equipo nos hace invencibles 💥",
  "Aprender nunca termina 📖",
  "Lo imposible solo tarda un poco más ⏱️",
  "Hazlo con amor o no lo hagas ❤️",
  "Tus logros inspiran a otros 🌟",
  "Nada se compara con la satisfacción del deber cumplido 🏆",
  "Sigue construyendo el futuro que sueñas 🏗️",
  "Tu tiempo aquí vale oro 💛",
  "Proservis TI avanza gracias a ti 💙",
  "Mantén la mente abierta y el corazón dispuesto 💭💖",
  "El éxito comienza con una buena actitud ☀️",
  "Aporta tu chispa, enciende el cambio 🔥",
  "Cada día es una nueva oportunidad de mejora 🌅",
  "El esfuerzo constante vence al talento distraído ⚙️",
  "Tu dedicación es inspiración para todos 🙌",
  "Haz que tu trabajo hable por ti 🎯",
  "Los grandes equipos se construyen con grandes personas 🤝",
  "Sigue adelante, estás haciendo un gran trabajo 💪",
  "Progresar es avanzar, aunque sea un paso a la vez 👣",
  "Deja tu huella positiva en todo lo que haces ✨",
  "Eres parte fundamental del éxito colectivo 🧩",
  "Nunca es tarde para reinventarte 🔄",
  "La motivación te inicia, la constancia te lleva al éxito 💼",
  "Tu pasión es contagiosa 🔥",
  "Hazlo con propósito, hazlo con corazón ❤️",
  "Cada día es una oportunidad de superación 🌞",
  "Proservis TI: creciendo contigo, para ti 💙",
  "Tu mejor versión comienza hoy 🌟",
  "El éxito se construye paso a paso 👣",
  "Sigue soñando, sigue creando 🚀",
  "Gracias por aportar tu talento y energía cada día 🙏"
];
// ======================================================

// Componente principal de la página de login

export default function LoginPage() {
  const [error, setError] = useState("");
  const [mensaje, setMensaje] = useState(""); // mensaje motivador
  const navigate = useNavigate();

  // Al cargar el componente, seleccionamos un mensaje al azar
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * mensajesMotivadores.length);
    setMensaje(mensajesMotivadores[randomIndex]);
  }, []);

  // Función que se llama cuando el login es exitoso
  const handleLoginSuccess = (user) => {
    navigate("/home");
  };

  return (
    <div className="login-wrapper">
      <Login_Fondo />

      <div className="login-container">
        {/* ===================== IZQUIERDA (WELCOME) ===================== */}
        <div className="welcome-section">
          <div className="welcome-content">
            <h1 className="welcome-title">BIENVENIDO</h1>
            <div className="welcome-underline" />

            {/* 💬 Mostramos el mensaje motivador dinámico */}
            <p className="welcome-text">{mensaje}</p>

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
          <div className="top-logo">
            <MascotaLogin />
          </div>

          <div className="login-card">
            <h2 className="card-title">Iniciar Sesión</h2>
            <p className="card-subtitle">Accede usando tu cuenta de Google</p>

            <LoginButton setError={setError} onLoginSuccess={handleLoginSuccess} />

            {error && <div className="error">{error}</div>}

            <div className="socials">
              <span className="social-dot" aria-hidden="true" />
              <span className="social-dot" aria-hidden="true" />
              <span className="social-dot" aria-hidden="true" />
            </div>
          </div>

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
