// src/components/Inventario_User_Equipo/components/ModalDetalles.jsx

import React from 'react';
import { Laptop, User, History, AlertCircle, XCircle, MapPin, Building2 } from 'lucide-react';

const ModalDetalles = ({ equipo, onClose, estadosConfig = {} }) => {
  if (!equipo) return null;
  
  // Configuración por defecto para estados
  const defaultEstadosConfig = {
    'ASIGNADO': { 
      color: 'from-green-500 to-emerald-600', 
      badge: 'bg-green-100 text-green-800',
      emoji: '💼'
    },
    'DISPONIBLE': { 
      color: 'from-blue-500 to-cyan-600', 
      badge: 'bg-blue-100 text-blue-800',
      emoji: '✅'
    },
    'MANTENIMIENTO': { 
      color: 'from-yellow-500 to-amber-600', 
      badge: 'bg-yellow-100 text-yellow-800',
      emoji: '🔧'
    },
    'BAJA': { 
      color: 'from-red-500 to-rose-600', 
      badge: 'bg-red-100 text-red-800',
      emoji: '❌'
    },
    'PAZ Y SALVO': { 
      color: 'from-gray-500 to-slate-600', 
      badge: 'bg-gray-100 text-gray-800',
      emoji: '⏸️'
    }
  };

  // Combinar configuraciones (usar la proporcionada o la por defecto)
  const configCompleta = { ...defaultEstadosConfig, ...estadosConfig };
  
  // Obtener configuración del estado actual, con valores por defecto
  const estadoConfig = configCompleta[equipo.estado] || configCompleta['SIN ASIGNAR'];

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50 animate-fadeIn">
      <div className="bg-white rounded-3xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header del modal con gradiente seguro */}
        <div className={`bg-gradient-to-r ${estadoConfig.color || 'from-blue-500 to-purple-600'} p-6 text-white relative`}>
          <button
            onClick={onClose}
            className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 p-2 rounded-full transition-all"
          >
            <XCircle size={24} />
          </button>
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-4 rounded-2xl">
              <Laptop size={40} />
            </div>
            <div>
              <h2 className="text-3xl font-black">{equipo.marca} {equipo.tipoEquipo}</h2>
              <p className="text-white/90 font-semibold mt-1">Código: {equipo.codigoActivo}</p>
            </div>
          </div>
        </div>

        {/* Contenido del modal */}
        <div className="p-6 space-y-6">
          {/* Estado y Serial */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 p-4 rounded-2xl border-2 border-blue-200">
              <p className="text-xs font-bold text-blue-700 mb-2">ESTADO ACTUAL</p>
              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${estadoConfig.badge || 'bg-gray-100 text-gray-800'} font-bold`}>
                {estadoConfig.emoji || '📱'} {equipo.estado}
              </div>
            </div>
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-4 rounded-2xl border-2 border-purple-200">
              <p className="text-xs font-bold text-purple-700 mb-2">SERIAL</p>
              <p className="text-xl font-black text-purple-900">{equipo.serial}</p>
            </div>
          </div>

          {/* Usuario Actual */}
          {equipo.usuarioActual && equipo.usuarioActual !== 'Sin asignar' && (
            <div className="bg-gradient-to-r from-emerald-50 to-green-50 p-5 rounded-2xl border-2 border-emerald-300">
              <p className="text-sm font-bold text-emerald-700 mb-3 flex items-center gap-2">
                <User size={18} /> USUARIO ASIGNADO
              </p>
              <div className="space-y-2">
                <p className="text-2xl font-black text-emerald-900">{equipo.usuarioActual}</p>
                <p className="text-lg text-emerald-700 font-semibold">{equipo.cargo}</p>
                {equipo.fechaAsignacion !== '-' && (
                  <p className="text-sm text-emerald-600">📅 Asignado desde: {equipo.fechaAsignacion}</p>
                )}
              </div>
            </div>
          )}

          {/* Información Detallada */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
              <p className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-2">
                <MapPin size={14} /> SUCURSAL
              </p>
              <p className="text-lg font-black text-gray-800">{equipo.sucursal}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-xl border-2 border-gray-200">
              <p className="text-xs font-bold text-gray-600 mb-2 flex items-center gap-2">
                <Building2 size={14} /> EMPRESA
              </p>
              <p className="text-lg font-black text-gray-800">{equipo.empresa}</p>
            </div>
          </div>

          {/* AnyDesk */}
          {equipo.anydesk && (
            <div className="bg-gradient-to-r from-violet-50 to-purple-50 p-5 rounded-2xl border-2 border-violet-300">
              <p className="text-sm font-bold text-violet-700 mb-2">🖥️ ACCESO REMOTO - ANYDESK</p>
              <div className="flex items-center justify-between">
                <p className="text-3xl font-black text-violet-900">{equipo.anydesk}</p>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(equipo.anydesk);
                    alert('ID de AnyDesk copiado al portapapeles');
                  }}
                  className="px-4 py-2 bg-violet-600 text-white rounded-lg font-bold hover:bg-violet-700 transition-all"
                >
                  📋 Copiar
                </button>
              </div>
            </div>
          )}

          {/* Observaciones */}
          {equipo.observaciones && (
            <div className="bg-amber-50 p-5 rounded-2xl border-2 border-amber-300">
              <p className="text-sm font-bold text-amber-700 mb-2 flex items-center gap-2">
                <AlertCircle size={18} /> OBSERVACIONES
              </p>
              <p className="text-gray-700 font-medium">{equipo.observaciones}</p>
            </div>
          )}

          {/* Historial */}
          {equipo.historial && equipo.historial.length > 0 && (
            <div className="bg-slate-50 p-5 rounded-2xl border-2 border-slate-300">
              <p className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
                <History size={18} /> HISTORIAL DE USUARIOS
              </p>
              <div className="space-y-2">
                {equipo.historial.map((h, idx) => (
                  <div key={idx} className="bg-white p-3 rounded-lg border border-slate-200">
                    <p className="font-bold text-slate-800">{h.usuario}</p>
                    <p className="text-sm text-slate-600">Cargo: {h.cargo || 'No especificado'}</p>
                    <p className="text-sm text-slate-600">Periodo: {h.periodo}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer con acciones */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl font-bold hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalles;