// src/components/Inventario_User_Equipo/components/FiltrosEquipos.jsx

import React from 'react';
import { Search } from 'lucide-react';

const FiltrosEquipos = ({ 
  searchTerm, 
  setSearchTerm, 
  filterEstado, 
  setFilterEstado, 
  filterSucursal, 
  setFilterSucursal,
  filterEmpresa,
  setFilterEmpresa,
  sucursales, 
  empresas,
  equiposFiltrados, 
  totalEquipos,
  userMode,
  estadosConfig = {}
}) => {
  return (
    <div className="bg-white rounded-2xl shadow-2xl p-6 mb-6 border-2 border-gray-100">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2">
          <label className="block text-sm font-bold text-gray-700 mb-2 flex items-center gap-2">
            <Search size={18} />
            Búsqueda Inteligente
          </label>
          <input
            type="text"
            placeholder="Serial, usuario, cargo, AnyDesk, código..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium"
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Estado</label>
          <select
            value={filterEstado}
            onChange={(e) => setFilterEstado(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium"
          >
            <option value="todos">🔍 Todos</option>
            {Object.keys(estadosConfig).map(estado => (
              <option key={`estado-${estado}`} value={estado}>
                {estadosConfig[estado]?.emoji} {estado}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">Sucursal</label>
          <select
            value={filterSucursal}
            onChange={(e) => setFilterSucursal(e.target.value)}
            className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none font-medium"
          >
            <option value="todas">📍 Todas</option>
            {sucursales.map((suc, index) => (
              <option key={`sucursal-${suc}-${index}`} value={suc}>
                {suc}
              </option>
            ))}
          </select>
        </div>
      </div>

      {userMode === 'viewer' && (
        <div className="mt-4">
          <label className="block text-sm font-bold text-gray-700 mb-2">Empresa (Puede modificar)</label>
          <select
            value={filterEmpresa}
            onChange={(e) => setFilterEmpresa(e.target.value)}
            className="w-full px-4 py-3 border-2 border-blue-300 rounded-xl focus:border-blue-500 focus:outline-none font-medium bg-blue-50"
          >
            <option value="todas">🏢 Todas las Empresas</option>
            {empresas.map((emp, index) => (
              <option key={`empresa-${emp}-${index}`} value={emp}>
                {emp}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="mt-4 text-center">
        <span className="text-sm font-bold text-gray-600">
          Mostrando <span className="text-blue-600">{equiposFiltrados}</span> de <span className="text-blue-600">{totalEquipos}</span> equipos
        </span>
      </div>
    </div>
  );
};

export default FiltrosEquipos;