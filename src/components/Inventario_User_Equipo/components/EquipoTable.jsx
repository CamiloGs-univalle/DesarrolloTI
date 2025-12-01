// src/components/Inventario_User_Equipo/components/EquipoTable.jsx
import React from 'react';
import { Laptop, Eye, Edit } from 'lucide-react';

// Configuración de estados
const defaultEstadosConfig = {
  'ASIGNADO': { badge: 'bg-green-100 text-green-800', emoji: '💼' },
  'DISPONIBLE': { badge: 'bg-blue-100 text-blue-800', emoji: '✅' },
  'MANTENIMIENTO': { badge: 'bg-yellow-100 text-yellow-800', emoji: '🔧' },
  'BAJA': { badge: 'bg-red-100 text-red-800', emoji: '❌' },
  'SIN ASIGNAR': { badge: 'bg-gray-100 text-gray-800', emoji: '⏸️' }
};

const EquipoTable = ({ equiposFiltrados, userMode, setSelectedEquipo, setShowDetailModal, setShowModal }) => {

    if (!equiposFiltrados || equiposFiltrados.length === 0) {
        return (
            <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100 p-8 text-center">
                <p className="text-gray-500 text-lg">No se encontraron equipos</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden border-2 border-gray-100">
            <div className="overflow-x-auto">
                <table className="w-full">
                    <thead className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
                        <tr>
                            <th className="px-4 py-4 text-left font-black text-sm">EQUIPO</th>
                            <th className="px-4 py-4 text-left font-black text-sm">CÓDIGO</th>
                            <th className="px-4 py-4 text-left font-black text-sm">USUARIO</th>
                            <th className="px-4 py-4 text-left font-black text-sm">CARGO</th>
                            <th className="px-4 py-4 text-left font-black text-sm">SUCURSAL</th>
                            <th className="px-4 py-4 text-left font-black text-sm">ESTADO</th>
                            <th className="px-4 py-4 text-left font-black text-sm">ACCIONES</th>
                        </tr>
                    </thead>
                    <tbody>
                        {equiposFiltrados.map((equipo, idx) => {

                            // ✔ Usamos la configuración correcta
                            const estadoConfig = defaultEstadosConfig[equipo.estado] ||
                                                 defaultEstadosConfig['SIN ASIGNAR'];

                            return (
                                <tr 
                                    key={equipo.id} 
                                    className={`border-b hover:bg-blue-50 transition-colors ${idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}
                                >
                                    <td className="px-4 py-4">
                                        <div className="flex items-center gap-2">
                                            <Laptop size={20} className="text-blue-600" />
                                            <div>
                                                <p className="font-bold text-gray-800">{equipo.marca}</p>
                                                <p className="text-xs text-gray-500">{equipo.tipoEquipo}</p>
                                            </div>
                                        </div>
                                    </td>

                                    <td className="px-4 py-4 font-bold text-gray-700">{equipo.codigoActivo}</td>
                                    <td className="px-4 py-4 font-semibold text-gray-800">{equipo.usuarioActual}</td>
                                    <td className="px-4 py-4 text-sm text-gray-600">{equipo.cargo}</td>
                                    <td className="px-4 py-4 text-sm font-semibold text-gray-700">{equipo.sucursal}</td>

                                    <td className="px-4 py-4">
                                        <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-bold ${estadoConfig.badge}`}>
                                            {estadoConfig.emoji} {equipo.estado}
                                        </span>
                                    </td>

                                    <td className="px-4 py-4">
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => {
                                                    setSelectedEquipo(equipo);
                                                    setShowDetailModal(true);
                                                }}
                                                className="p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                                                title="Ver detalles"
                                            >
                                                <Eye size={16} className="text-gray-700" />
                                            </button>

                                            {userMode === 'admin' && (
                                                <button
                                                    onClick={() => {
                                                        setSelectedEquipo(equipo);
                                                        setShowModal(true);
                                                    }}
                                                    className="p-2 bg-blue-100 rounded-lg hover:bg-blue-200 transition-colors"
                                                    title="Editar equipo"
                                                >
                                                    <Edit size={16} className="text-blue-700" />
                                                </button>
                                            )}
                                        </div>
                                    </td>

                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default EquipoTable;
