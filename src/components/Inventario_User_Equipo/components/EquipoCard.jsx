  // src/components/Inventario_User_Equipo/components/EquipoCard.jsx

  import React from 'react';
  import { Laptop, User, History, Eye, Edit } from 'lucide-react';

  const EquipoCard = ({ equipo, userMode, onVerMas, onEditar, estadosConfig = {} }) => {
    const estadoConfig = estadosConfig[equipo.estado] || {};
    const Icon = estadoConfig.icon;
    const tieneUsuario = equipo.usuarioActual && equipo.usuarioActual !== 'Sin asignar';
    const usuarioAnterior = equipo.historial && equipo.historial.length > 0 ? equipo.historial[equipo.historial.length - 1] : null;
    
    return (
      <div className="bg-white rounded-2xl shadow-xl hover:shadow-2xl transition-all overflow-hidden border-2 border-gray-100 group hover:scale-105">
        {/* Header con gradiente según estado */}
        <div className={`bg-gradient-to-r ${estadoConfig.color || 'from-gray-500 to-slate-500'} p-4 text-white`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Laptop size={28} className="drop-shadow" />
              <div>
                <h3 className="text-xl font-black">{equipo.usuarioActual  }</h3>
                <p className="text-xs font-semibold opacity-90">{equipo.tipoEquipo}</p>
              </div>
            </div>
            <span className="text-3xl">{estadoConfig.emoji || '❓'}</span>
          </div>
        </div>

        {/* Contenido */}
        <div className="p-5">
          {/* Badge de estado */}
          <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border-2 ${estadoConfig.badge || 'bg-gray-100 text-gray-800 border-gray-300'} font-bold text-xs mb-4`}>
            {Icon && <Icon size={16} />}
            {equipo.estado}
          </div>

          {/* Resto del código igual... */}
          <div className="space-y-3">
            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs font-bold text-gray-500 mb-1">CÓDIGO ACTIVO</p>
              <p className="text-lg font-black text-gray-800">{equipo.codigoActivo}</p>
            </div>

            <div className="bg-gray-50 p-3 rounded-xl">
              <p className="text-xs font-bold text-gray-500 mb-1">SERIAL</p>
              <p className="text-sm font-bold text-gray-800">{equipo.serial}</p>
            </div>

            {tieneUsuario && (
              <div className="bg-gradient-to-r from-blue-50 to-cyan-50 p-3 rounded-xl border-2 border-blue-200">
                <p className="text-xs font-bold text-blue-700 mb-1 flex items-center gap-1">
                  <User size={14} /> USUARIO ACTUAL
                </p>
                <p className="text-sm font-black text-blue-900">{equipo.usuarioActual}</p>
                <p className="text-xs text-blue-700 mt-1">{equipo.cargo}</p>
              </div>
            )}

            {/* Mostrar usuario anterior si está disponible o en Paz y Salvo */}
            {!tieneUsuario && usuarioAnterior && (equipo.estado === 'Disponible' || equipo.estado === 'Paz y Salvo') && (
              <div className="bg-gradient-to-r from-yellow-50 to-orange-50 p-3 rounded-xl border-2 border-yellow-300">
                <p className="text-xs font-bold text-orange-700 mb-1 flex items-center gap-1">
                  <History size={14} /> ÚLTIMO USUARIO (PRIORIDAD)
                </p>
                <p className="text-sm font-black text-orange-900">{usuarioAnterior.usuario}</p>
                <p className="text-xs text-orange-700 mt-1">{usuarioAnterior.cargo}</p>
                <p className="text-xs text-orange-600 mt-1 italic">💡 Recomendado para reemplazo en este cargo</p>
              </div>
            )}

            <div className="grid grid-cols-2 gap-2">
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  📍 Sucursal
                </p>
                <p className="text-xs font-bold text-gray-800">{equipo.sucursal}</p>
              </div>
              <div className="bg-gray-50 p-2 rounded-lg">
                <p className="text-xs font-bold text-gray-500 flex items-center gap-1">
                  🏢 Empresa
                </p>
                <p className="text-xs font-bold text-gray-800">{equipo.empresa}</p>
              </div>
            </div>

            {equipo.anydesk && (
              <div className="bg-purple-50 p-2 rounded-lg border border-purple-200">
                <p className="text-xs font-bold text-purple-700">🖥️ AnyDesk</p>
                <p className="text-sm font-black text-purple-900">{equipo.anydesk}</p>
              </div>
            )}
          </div>

          {/* Botones de acción */}
          <div className="mt-4 flex gap-2">
            <button
              onClick={onVerMas}
              className="flex-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 font-bold text-sm flex items-center justify-center gap-2"
            >
              <Eye size={16} /> Ver Más
            </button>
            
            {userMode === 'admin' && (
              <button
                onClick={onEditar}
                className="px-3 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 font-bold text-sm flex items-center gap-2"
              >
                <Edit size={16} /> Editar
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  export default EquipoCard;