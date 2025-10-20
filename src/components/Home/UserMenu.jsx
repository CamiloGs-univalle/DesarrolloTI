import { useState, useRef, useEffect } from "react";
import { auth, signInWithGoogle } from "../../firebase/authService";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

export default function UserMenu({ user, nombreSolicitante }) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [error, setError] = useState(null);
  const menuRef = useRef();
  const navigate = useNavigate();

  // Generar avatar o usar foto del usuario
  useEffect(() => {
    if (!user) return;

    const name = user.displayName?.trim() || "Usuario";
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;

    setAvatarUrl(user.photoURL?.trim() || fallbackUrl);
  }, [user]);

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Fallback si falla la imagen
  const handleImageError = (e) => {
    const name = user?.displayName || "Usuario";
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;
  };

  // Cerrar sesión y redirigir al login
  const handleSignOut = async () => {
    if (isSigningOut) return;

    try {
      setIsSigningOut(true);
      setIsOpen(false);

      await auth.signOut();
      navigate("/"); // 🔹 Redirige correctamente al LoginPage
    } catch (err) {
      console.error("Error al cerrar sesión:", err);
      setError("Hubo un problema al cerrar sesión. Intenta de nuevo.");
    } finally {
      setIsSigningOut(false);
    }
  };

  // Mostrar mensaje mientras carga el usuario
  if (!user) {
    return <div className="user-menu-loading">Cargando usuario...</div>;
  }

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <img
        src={avatarUrl}
        alt="Foto de usuario"
        className="user-avatar"
        onClick={() => setIsOpen((prev) => !prev)}
        onError={handleImageError}
      />

      {isOpen && (
        <div className="user-dropdown-menu">
          <div className="menu-info">
            <strong>{user.displayName || "Usuario"}</strong>
            <p>{user.email || "No tiene email"}</p>
          </div>
          <hr />

          <button onClick={signInWithGoogle}>Cambiar de cuenta</button>
          <button onClick={handleSignOut} disabled={isSigningOut}>
            {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
          </button>

          {error && <p className="error-message">{error}</p>}
        </div>
      )}
    </div>
  );
}
