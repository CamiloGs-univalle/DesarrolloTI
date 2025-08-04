import { useState, useRef, useEffect } from "react";
import { auth, signInWithGoogle } from "../../firebase/authService";
import { useNavigate } from "react-router-dom";
import "./UserMenu.css";

export default function UserMenu({ user, nombreSolicitante }) {
  const [isOpen, setIsOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState("");
  const menuRef = useRef();
  const navigate = useNavigate();

  // Generar avatar o usar foto del usuario
  useEffect(() => {
    if (!user) return;

    if (user?.photoURL?.trim()) {
      setAvatarUrl(user.photoURL);
    } else {
      const name = user?.displayName || "Usuario";
      const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
        name
      )}&background=random`;
      setAvatarUrl(fallbackUrl);
    }
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

  // Fallback de imagen si falla el avatar
  const handleImageError = (e) => {
    const name = user?.displayName || "Usuario";
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(
      name
    )}&background=random`;
  };

  // Cerrar sesión y redirigir al login
  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login"); // Redirecciona al login
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
    }
  };

  if (!user) {
    return <div className="user-menu-loading">Cargando usuario...</div>;
  }

  return (
    <div className="user-menu-wrapper" ref={menuRef}>
      <img
        src={avatarUrl}
        alt="Foto de usuario"
        className="user-avatar"
        onClick={() => setIsOpen(!isOpen)}
        onError={handleImageError}
      />

      {isOpen && (
        <div className="user-dropdown-menu">
          <div className="menu-info">
            <strong>{user.displayName || "Usuario"}</strong>
            <p>{user.email || "No tiene email"}</p>
            <p>
              <em>Solicitante:</em> {nombreSolicitante || "No definido"}
            </p>
          </div>
          <hr />
          <button onClick={signInWithGoogle}>Cambiar de cuenta</button>
          <button onClick={handleSignOut}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}
