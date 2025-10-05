import React, { useState, useEffect } from "react";
import { auth, signInWithGoogle, logout } from "../firebase/authService";
import { onAuthStateChanged } from "firebase/auth";

// 📬 Correos fijos de destino (pueden ser varios separados por coma)
const DESTINATARIOS = "auxiliar.ti@proservis.com.co";

/**
 * 🗓️ Convierte una fecha ISO (YYYY-MM-DD) en formato: "06 SEPTIEMBRE 2025"
 */
function formatDateToSpanishUpper(dateISO) {
  if (!dateISO) return "";
  const meses = [
    "ENERO", "FEBRERO", "MARZO", "ABRIL", "MAYO", "JUNIO",
    "JULIO", "AGOSTO", "SEPTIEMBRE", "OCTUBRE", "NOVIEMBRE", "DICIEMBRE"
  ];
  const d = new Date(dateISO);
  const day = String(d.getDate()).padStart(2, "0");
  const month = meses[d.getMonth()];
  const year = d.getFullYear();
  return `${day} ${month} ${year}`;
}

export default function EnviarCorreo() {
  // 👤 Usuario autenticado (Firebase)
  const [user, setUser] = useState(null);

  // 📝 Datos del formulario
  const [formData, setFormData] = useState({
    nombre: "",
    cedula: "",
    cargo: "",
    ciudad: "",
    fechaIngreso: "",
    usuarioReemplazar: "",
    nota: "Esta es una prueba de envío."
  });

  // 👀 Detecta si hay sesión activa al cargar el componente
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      console.log("👤 Sesión detectada:", firebaseUser?.email || "No autenticado");
    });
    return () => unsubscribe();
  }, []);

  // ✍️ Actualiza estado cuando se escriben los campos
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // 🔐 Login con Google
  const handleLogin = async () => {
    try {
      const loggedUser = await signInWithGoogle();
      setUser(loggedUser);
    } catch (err) {
      console.error("❌ Error iniciando sesión:", err);
    }
  };

  // 🚪 Logout
  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  /**
   * 🧾 Construye el cuerpo del correo con la plantilla oficial
   */
  const buildBody = (data) => {
    const fechaTexto = formatDateToSpanishUpper(data.fechaIngreso);
    return (
`Buen día.

Por favor tu apoyo con la gestión de Permisos, Equipo y Correo para la siguiente persona que ingresa el día ${fechaTexto}, en la ciudad de ${data.ciudad}.

Nombre: ${data.nombre}
C.C.: ${data.cedula}
Cargo: ${data.cargo}
Ciudad: ${data.ciudad}

Licencia: Utilizaba ${data.usuarioReemplazar}
Permisos: Utilizaba ${data.usuarioReemplazar}
Correo: Utilizaba ${data.usuarioReemplazar}

Nota: ${data.nota}

Muchas gracias quedamos atentos.`
    );
  };

  /**
   * 📤 Maneja el envío → construye mailto y abre en ventana emergente
   */
  const handleSubmit = (e) => {
    e.preventDefault();

    if (!user) {
      alert("Debes iniciar sesión con tu cuenta corporativa antes de enviar.");
      return;
    }

    // 🧠 Log para debug como pro
    console.log("✅ Preparando envío de correo...");
    console.log("📨 Destinatario:", DESTINATARIOS);
    console.log("👤 Usuario que envía:", user.email);
    console.log("📋 Datos del formulario:", formData);

    const subject = `Solicitud nuevo usuario - ${formData.nombre}`;
    const body = buildBody(formData);

    // 📎 Construcción segura de mailto
    const mailto = `mailto:${DESTINATARIOS}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

    console.log("🔗 URL mailto generada:", mailto);

    // 🪟 ✨ Abrimos el Gmail en una ventanita emergente personalizada
    window.open(
      mailto,
      "_blank",
      "width=850,height=650,left=200,top=100,noopener,noreferrer"
    );
  };

  return (
    <div className="max-w-md mx-auto p-4 bg-gray-50 rounded shadow mt-8">
      <h2 className="text-xl font-bold mb-4">✉️ Envío de Solicitud - Ventana Emergente</h2>

      {/* 🔐 Login / Logout */}
      {!user ? (
        <button
          onClick={handleLogin}
          className="bg-blue-600 text-white px-4 py-2 rounded mb-4 w-full"
        >
          Iniciar sesión con Google
        </button>
      ) : (
        <div className="mb-4 p-2 bg-green-50 border rounded">
          <p className="mb-2 text-sm">Sesión iniciada como: <b>{user.email}</b></p>
          <button
            onClick={handleLogout}
            className="bg-gray-600 text-white px-3 py-1 rounded text-sm"
          >
            Cerrar sesión
          </button>
        </div>
      )}

      {/* 📝 Formulario */}
      <form onSubmit={handleSubmit} className="flex flex-col gap-2">
        <input
          name="nombre"
          placeholder="Nombre completo"
          value={formData.nombre}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="cedula"
          placeholder="C.C."
          value={formData.cedula}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="cargo"
          placeholder="Cargo"
          value={formData.cargo}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="ciudad"
          placeholder="Ciudad"
          value={formData.ciudad}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          type="date"
          name="fechaIngreso"
          value={formData.fechaIngreso}
          onChange={handleChange}
          required
          className="border p-2 rounded"
        />
        <input
          name="usuarioReemplazar"
          placeholder="Usuario que se reemplaza"
          value={formData.usuarioReemplazar}
          onChange={handleChange}
          className="border p-2 rounded"
        />
        <textarea
          name="nota"
          value={formData.nota}
          onChange={handleChange}
          rows={3}
          className="border p-2 rounded"
        />

        <button
          type="submit"
          className="bg-green-600 text-white p-2 rounded mt-2"
        >
          ✉ Enviar Solicitud
        </button>
      </form>
    </div>
  );
}
