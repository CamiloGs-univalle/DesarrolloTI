import { useEffect, useRef, useState } from 'react';
import './Home.css';
import UsuarioEquipo from '../UsuarioEquipo/UsuarioEquipo';
import { auth, signInWithGoogle } from '../../firebase/authService';
import InactivacionUsuario from '../InactivacionUsuario/InactivacionUsuario';

// Logger configurado para desarrollo
const logger = {
  log: (...args) => console.log('%c[LOG]', 'color: #2196F3; font-weight: bold', ...args),
  error: (...args) => console.error('%c[ERROR]', 'color: #F44336; font-weight: bold', ...args)
};

export default function Home({ user }) {
  // Estados
  const [currentView, setCurrentView] = useState(null);
  const [nombreSolicitante, setNombreSolicitante] = useState('');
  const [solicitanteActive, setSolicitanteActive] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState('');
  const [avatarLoadError, setAvatarLoadError] = useState(false);
  const menuRef = useRef(null);

  // Efecto para manejar cambios en el usuario
  useEffect(() => {
    logger.log('🔄 Efecto de usuario activado', { user });

    if (!user) {
      logger.log('🔴 No hay usuario autenticado');
      setAvatarUrl('');
      return;
    }

    // Establecer nombre solicitante
    if (user.displayName) {
      setNombreSolicitante(user.displayName);
      logger.log(`✏️ Nombre solicitante: ${user.displayName}`);
    }

    // Manejar avatar del usuario
    handleUserAvatar(user);
  }, [user]);

  // Manejo del avatar con verificación
  const handleUserAvatar = (user) => {
    try {
      if (user?.photoURL?.trim()) {
        logger.log(`🖼️ Intentando cargar avatar: ${user.photoURL}`);
        verifyImage(user.photoURL).then(isValid => {
          if (isValid) {
            setAvatarUrl(user.photoURL);
            setAvatarLoadError(false);
            logger.log('✅ Avatar cargado correctamente');
          } else {
            generateFallbackAvatar(user);
            logger.error('❌ La URL del avatar no es accesible');
          }
        });
      } else {
        generateFallbackAvatar(user);
        logger.log('🔄 Generando avatar con iniciales');
      }
    } catch (error) {
      logger.error('Error al manejar avatar', error);
      generateFallbackAvatar(user);
    }
  };

  // Verificar si la imagen es accesible
  const verifyImage = (url) => {
    return new Promise((resolve) => {
      const img = new Image();
      img.onload = () => resolve(true);
      img.onerror = () => resolve(false);
      img.src = url;
    });
  };

  // Generar avatar de fallback
  const generateFallbackAvatar = (user) => {
    const name = user?.displayName || user?.email?.split('@')[0] || 'Usuario';
    const fallbackUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`;
    setAvatarUrl(fallbackUrl);
    setAvatarLoadError(true);
  };

  // Cerrar menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Manejo de errores de imagen
  const handleImageError = (e) => {
    logger.error('Error al cargar avatar', e.target.src);
    generateFallbackAvatar(user);
  };

  // Renderizado de vistas
  const renderView = () => {
    switch (currentView) {
      case 'usuario-equipo':
        return <UsuarioEquipo user={user} />;
      case 'inactivacion-usuario':
        return <InactivacionUsuario />;
      case 'asignacion-equipo':
        return <div className="form-view">Formulario de Asignación de Equipo</div>;
      case 'asignacion-correo':
        return <div className="form-view">Formulario de Asignación de Correo</div>;
      default:
        return <div className="empty-view">Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="home-wrapper">
      <header className="app-header">
        <h1 className="header-title">Solicitud al Área TI</h1>
        <div className="header-left">
          {user && (
            <img
              src={avatarUrl}
              alt={user.displayName || user.email}
              className={`header-avatar ${avatarLoadError ? 'avatar-fallback' : ''}`}
              onClick={() => setMenuOpen(!menuOpen)}
              onError={handleImageError}
              loading="lazy"
            />
          )}

        </div>


        {user ? (
          menuOpen && (
            <div className="dropdown-menu" ref={menuRef}>
              <div className="dropdown-user-info">
                <strong>{user.displayName || 'Usuario'}</strong>
                <p>{user.email || 'No tiene email'}</p>
              </div>
              <button onClick={signInWithGoogle}>Cambiar de cuenta</button>
              <button onClick={() => auth.signOut()}>Cerrar sesión</button>
            </div>
          )
        ) : (
          <div className="user-loading">Autenticando...</div>
        )}
      </header>


      <div className="app-container">


        <div className="main-panel">
          <div className="button-panel">
            <button
              onClick={() => setCurrentView('usuario-equipo')}
              className={currentView === 'usuario-equipo' ? 'active' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%', // opcional, para que ocupe todo el ancho disponible
              }}
            >
              Usuario y Equipo
              <img
                src="/public/logo/icono_usuario.png"
                alt="Icono Usuario"
                style={{ width: '25px', height: '25px', marginRight: '8px', verticalAlign: 'middle' }}
              />

            </button>

            <button
              onClick={() => setCurrentView('inactivacion-usuario')}
              className={currentView === 'inactivacion-usuario' ? 'active' : ''}
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                width: '100%', // opcional, para que ocupe todo el ancho disponible
              }}
            >
              Inactivar Usuario
              <img
                src="/logo/icono-inactivar usuario.png"
                alt="Icono derecha"
                style={{ width: '25px', height: '25px', marginRight: '8px', verticalAlign: 'middle' }}
              />

            </button>
          </div>

          <div className="form-panel">{renderView()}</div>
        </div>
      </div>
    </div>
  );
}