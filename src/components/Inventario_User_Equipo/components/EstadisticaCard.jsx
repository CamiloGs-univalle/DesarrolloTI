// src/components/Inventario_User_Equipo/components/EstadisticaCard.jsx

import React from 'react';

const EstadisticaCard = ({ titulo, valor, config, onClick, isTotal = false }) => {
  if (isTotal) {
    return (
      <div className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-5 shadow-xl border-2 border-gray-200 hover:scale-105 transition-transform">
        <div className="text-4xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          {valor}
        </div>
        <div className="text-sm text-gray-600 font-bold mt-2">{titulo}</div>
      </div>
    );  
  }

  return (
    <div 
      className={`rounded-2xl p-5 shadow-xl border-2 ${config.badge} hover:scale-105 transition-transform cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="text-3xl font-black">{valor}</div>
        <span className="text-2xl">{config.emoji}</span>
      </div>
      <div className="text-xs font-bold uppercase">{titulo}</div>
    </div>
  );
};

export default EstadisticaCard;