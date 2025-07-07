// src/components/Home/Home.jsx
import { useState } from 'react';
import './Home.css';
import UsuarioEquipo from '../UsuarioEquipo/UsuarioEquipo';

export default function Home({ user }) {
  const [currentView, setCurrentView] = useState(null);
  const [nombreSolicitante, setNombreSolicitante] = useState('');
  const [solicitanteActive, setSolicitanteActive] = useState(false);

  const renderView = () => {
    switch(currentView) {
      case 'usuario-equipo':
        return <UsuarioEquipo />;
      case 'inactivacion-usuario':
        return <div className="form-view">Formulario de Inactivación de Usuario</div>;
      case 'asignacion-equipo':
        return <div className="form-view">Formulario de Asignación de Equipo</div>;
      case 'asignacion-correo':
        return <div className="form-view">Formulario de Asignación de Correo</div>; 
      default:
        return <div className="empty-view">Seleccione una opción del menú</div>;
    }
  };

  return (
    <div className="app-container">
      <h1>SOLICITUD AL AREA TI</h1>
      
      {user && (
        <div className="user-info">
          <img src={user.photoURL} alt={user.displayName} />
          <p>👤 {user.displayName}</p>
          <p>✉️ {user.email}</p>
        </div>
      )}
      
      <div className="solicitante-field">
        <label>Nombre Solicitante</label>
        <input
          type="text"
          value={nombreSolicitante}
          onChange={(e) => setNombreSolicitante(e.target.value)}
          className={solicitanteActive || nombreSolicitante ? 'active' : ''}
          onFocus={() => setSolicitanteActive(true)}
          onBlur={() => setSolicitanteActive(false)}
        />
      </div>
      
      <div className="main-panel">
        <div className="button-panel">
          <button 
            onClick={() => setCurrentView('usuario-equipo')}
            className={currentView === 'usuario-equipo' ? 'active' : ''}
          >
            Usuario y Equipo
          </button>
          <button 
            onClick={() => setCurrentView('inactivacion-usuario')}
            className={currentView === 'inactivacion-usuario' ? 'active' : ''}
          >
            Inactivación de Usuario
          </button>
          <button 
            onClick={() => setCurrentView('asignacion-equipo')}
            className={currentView === 'asignacion-equipo' ? 'active' : ''}
          >
            Asignación de Equipo
          </button>
          <button 
            onClick={() => setCurrentView('asignacion-correo')}
            className={currentView === 'asignacion-correo' ? 'active' : ''}
          >
            Asignación de Correo
          </button>
        </div>
        
        <div className="form-panel">
          {renderView()}
        </div>
      </div>
    </div>
  );
}
