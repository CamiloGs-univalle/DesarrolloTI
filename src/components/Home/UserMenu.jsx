import { useState, useRef, useEffect } from "react";
import { auth, signInWithGoogle } from "../../firebase/authService";
import "./UserMenu.css";

export default function UserMenu({ user, nombreSolicitante }) {
  const [isOpen, setIsOpen] = useState(false);
  const menuRef = useRef();
  const [avatarUrl, setAvatarUrl] = useState("");

  // Efecto para manejar la URL del avatar
  useEffect(() => {
    if (!user) return;

    // Verificar si hay photoURL válida
    if (user?.photoURL?.trim()) {
      setAvatarUrl(user.photoURL);
    } else {
      // Generar avatar inicial con las iniciales
      const name = user?.displayName || "Usuario";
      const generatedUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
      setAvatarUrl(generatedUrl);
    }
  }, [user]);

  // Cierra el menú si se da clic fuera
  useEffect(() => {
    function handleClickOutside(event) {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleImageError = (e) => {
    const name = user?.displayName || "Usuario";
    e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
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
          <button onClick={() => auth.signOut()}>Cerrar sesión</button>
        </div>
      )}
    </div>
  );
}