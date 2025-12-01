// src/components/Inventario_User_Equipo/components/HeaderInventario.jsx
import React from 'react';
import { Laptop, List, LayoutGrid, Download } from 'lucide-react';

const HeaderInventario = ({ userMode, setUserMode, viewMode, setViewMode, exportarExcel }) => {
  return (
    <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 shadow-2xl relative overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>
      <div className="max-w-7xl mx-auto px-6 py-6 relative z-10">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Laptop className="text-white" size={40} />
            </div>
            <div>
              <h1 className="text-4xl font-black text-white drop-shadow-lg">
                Inventario Tecnológico
              </h1>
              <p className="text-white/90 mt-1 font-medium">Sistema centralizado de gestión de equipos</p>
            </div>
          </div>
          
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => setViewMode(viewMode === 'cards' ? 'table' : 'cards')}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
            >
              {viewMode === 'cards' ? <List size={20} /> : <LayoutGrid size={20} />}
              {viewMode === 'cards' ? 'Vista Tabla' : 'Vista Cards'}
            </button>
            
            <button
              onClick={exportarExcel}
              className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-white font-semibold hover:bg-white/30 transition-all flex items-center gap-2"
            >
              <Download size={20} />
              Exportar
            </button>

            <div className="flex gap-2 bg-black/30 backdrop-blur-sm p-1 rounded-xl">
              <button
                onClick={() => setUserMode('viewer')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  userMode === 'viewer' 
                    ? 'bg-white text-blue-600 shadow-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                👀 Vista General
              </button>
              <button
                onClick={() => setUserMode('admin')}
                className={`px-4 py-2 rounded-lg font-semibold transition-all ${
                  userMode === 'admin' 
                    ? 'bg-gradient-to-r from-yellow-400 to-orange-500 text-white shadow-lg' 
                    : 'text-white/80 hover:text-white'
                }`}
              >
                ⚡ Admin TI
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeaderInventario;