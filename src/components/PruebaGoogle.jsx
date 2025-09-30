// 📁 src/components/PruebaGoogleSheets.jsx

import React, { useState, useEffect } from 'react';
import { GoogleSheetsService } from '../services/googleSheetsService';

export default function PruebaGoogleSheets() {
  const [formData, setFormData] = useState({
    cedula: '0000001',
    nombre: 'PRUEBA 1',
    correo: 'camilo@gmail.com',
    empresa: 'PROSERVIS TEMPORALES',
    ciudad: 'CALI',
    estado: 'ACTIVO',
    observacion: 'Prueba desde React'
  });
  
  const [respuesta, setRespuesta] = useState(null);
  const [cargando, setCargando] = useState(false);
  const [error, setError] = useState(null);
  const [conexion, setConexion] = useState(null);

  // Probar conexión al cargar el componente
  useEffect(() => {
    probarConexion();
  }, []);

  const probarConexion = async () => {
    try {
      setCargando(true);
      const resultado = await GoogleSheetsService.probarConexion();
      setConexion({ estado: 'conectado', datos: resultado });
    } catch (err) {
      setConexion({ estado: 'error', error: err.message });
    } finally {
      setCargando(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCargando(true);
    setError(null);
    setRespuesta(null);
    
    try {
      const resultado = await GoogleSheetsService.enviarUsuario(formData);
      setRespuesta(resultado);
      
      if (resultado.success) {
        setFormData({
          cedula: '',
          nombre: '',
          correo: '',
          empresa: '',
          ciudad: '',
          estado: 'ACTIVO',
          observacion: ''
        });
      }
      
    } catch (err) {
      setError(err.message);
      console.error('❌ Error en handleSubmit:', err);
    } finally {
      setCargando(false);
    }
  };

  const cargarDatosEjemplo = () => {
    setFormData({
      cedula: '000000' + Math.floor(Math.random() * 1000),
      nombre: 'PRUEBA ' + Math.floor(Math.random() * 100),
      correo: 'prueba' + Math.floor(Math.random() * 100) + '@gmail.com',
      empresa: 'PROSERVIS TEMPORALES',
      ciudad: 'CALI',
      estado: 'ACTIVO',
      observacion: 'Prueba automática desde React'
    });
  };

  return (
    <div className="prueba-container">
      <h2>🔧 Prueba de Envío a Google Sheets</h2>
      
      {/* Estado de conexión */}
      <div className={`conexion-estado ${conexion?.estado}`}>
        <strong>Estado de conexión:</strong> 
        {conexion?.estado === 'conectado' ? '✅ Conectado' : '❌ Error'}
        {conexion?.error && <span> - {conexion.error}</span>}
        <button onClick={probarConexion} className="btn-reintentar">
          🔄 Reintentar
        </button>
      </div>

      {/* Botón para cargar datos de ejemplo */}
      <button onClick={cargarDatosEjemplo} className="btn-ejemplo">
        📋 Cargar Datos de Ejemplo (igual al error)
      </button>

      {/* Formulario */}
      <form onSubmit={handleSubmit} className="formulario-prueba">
        <div className="campo">
          <label>Cédula *</label>
          <input
            type="text"
            name="cedula"
            value={formData.cedula}
            onChange={handleInputChange}
            required
            placeholder="0000001"
          />
        </div>
        
        <div className="campo">
          <label>Nombre Completo *</label>
          <input
            type="text"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            required
            placeholder="PRUEBA 1"
          />
        </div>
        
        <div className="campo">
          <label>Correo Electrónico *</label>
          <input
            type="email"
            name="correo"
            value={formData.correo}
            onChange={handleInputChange}
            required
            placeholder="camilo@gmail.com"
          />
        </div>
        
        <div className="campo">
          <label>Empresa</label>
          <input
            type="text"
            name="empresa"
            value={formData.empresa}
            onChange={handleInputChange}
            placeholder="PROSERVIS TEMPORALES"
          />
        </div>
        
        <div className="campo">
          <label>Ciudad</label>
          <input
            type="text"
            name="ciudad"
            value={formData.ciudad}
            onChange={handleInputChange}
            placeholder="CALI"
          />
        </div>
        
        <div className="campo">
          <label>Estado</label>
          <select name="estado" value={formData.estado} onChange={handleInputChange}>
            <option value="ACTIVO">ACTIVO</option>
            <option value="INACTIVO">INACTIVO</option>
          </select>
        </div>
        
        <div className="campo">
          <label>Observación</label>
          <textarea
            name="observacion"
            value={formData.observacion}
            onChange={handleInputChange}
            placeholder="Observaciones..."
            rows="3"
          />
        </div>
        
        <button type="submit" disabled={cargando} className="btn-enviar">
          {cargando ? '⏳ Enviando...' : '👤 Agregar Usuario'}
        </button>
      </form>

      {/* Resultados */}
      {error && (
        <div className="resultado error">
          <h3>❌ Error</h3>
          <p>{error}</p>
          <details>
            <summary>Detalles técnicos</summary>
            <pre>{error}</pre>
          </details>
        </div>
      )}
      
      {respuesta && (
        <div className={`resultado ${respuesta.success ? 'exito' : 'error'}`}>
          <h3>{respuesta.success ? '✅ Éxito' : '⚠️ Advertencia'}</h3>
          <p><strong>Mensaje:</strong> {respuesta.message}</p>
          {respuesta.fila && <p><strong>Fila:</strong> {respuesta.fila}</p>}
          {respuesta.datos_guardados && (
            <div>
              <strong>Datos guardados:</strong>
              <pre>{JSON.stringify(respuesta.datos_guardados, null, 2)}</pre>
            </div>
          )}
        </div>
      )}
    </div>
  );
}