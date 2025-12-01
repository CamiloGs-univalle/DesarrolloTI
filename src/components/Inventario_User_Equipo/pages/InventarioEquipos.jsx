// src/components/Inventario_User_Equipo/pages/InventarioEquipos.jsx
import React, { useState, useMemo } from 'react';
import { AlertCircle } from 'lucide-react';
import HeaderInventario from '../components/HeaderInventario';
import EstadisticaCard from '../components/EstadisticaCard';
import FiltrosEquipos from '../components/FiltrosEquipos';
import EquipoCard from '../components/EquipoCard';
import EquipoTable from '../components/EquipoTable';
import ModalDetalles from '../components/ModalDetalles';
import ModalAdministracion from '../components/ModalAdmin';

// Importa el hook que combina datos de Firebase
import { useInventarioData } from '../../../models/hooks/useInventarioData';
import FondoHomeAnimado from '../../FondosAnimados/FondoHomeAnimado';

// SOLUCIÓN: Usar solo una definición de estadosConfig
// Opción 1: Si tienes el archivo ../data/estadosConfig.js, úsalo:
// import { estadosConfig } from '../data/estadosConfig';

// Opción 2: Definir localmente (elimina la importación conflictiva)
const estadosConfig = {
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
  'SIN ASIGNAR': {
    color: 'from-gray-500 to-slate-600',
    badge: 'bg-gray-100 text-gray-800',
    emoji: '⏸️'
  }
};





const InventarioEquipos = () => {
  const [userMode, setUserMode] = useState('viewer');
  const { equipos, loading } = useInventarioData();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('todos');
  const [filterSucursal, setFilterSucursal] = useState('todas');
  const [filterEmpresa, setFilterEmpresa] = useState('todas');
  const [selectedEquipo, setSelectedEquipo] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [viewMode, setViewMode] = useState('cards');
  const [showDetailModal, setShowDetailModal] = useState(false);

  // Obtener listas únicas para filtros con manejo seguro
  const sucursales = useMemo(() =>
    [...new Set(equipos.map(e => e.sucursal).filter(Boolean))],
    [equipos]
  );

  const empresas = useMemo(() =>
    [...new Set(equipos.map(e => e.empresa).filter(Boolean))],
    [equipos]
  );

  // Filtrar equipos - MEJORADO con manejo seguro
  const equiposFiltrados = useMemo(() => {
    if (!equipos || !Array.isArray(equipos)) return [];

    return equipos.filter(eq => {
      const searchLower = searchTerm.toLowerCase();
      const matchSearch =
        eq.serial?.toLowerCase().includes(searchLower) ||
        eq.tipoEquipo?.toLowerCase().includes(searchLower) ||
        eq.codigoActivo?.toLowerCase().includes(searchLower) ||
        (eq.usuarioActual || '').toLowerCase().includes(searchLower) ||
        (eq.cargo || '').toLowerCase().includes(searchLower) ||
        (eq.anydesk || '').toLowerCase().includes(searchLower) ||
        eq.marca?.toLowerCase().includes(searchLower);

      const matchEstado = filterEstado === 'todos' || eq.estado === filterEstado;
      const matchSucursal = filterSucursal === 'todas' || eq.sucursal === filterSucursal;
      const matchEmpresa = filterEmpresa === 'todas' || eq.empresa === filterEmpresa;

      return matchSearch && matchEstado && matchSucursal && matchEmpresa;
    });
  }, [equipos, searchTerm, filterEstado, filterSucursal, filterEmpresa]);

  // Estadísticas dinámicas basadas en filtros - MEJORADO
  const stats = useMemo(() => {
    const byEstado = {};
    Object.keys(estadosConfig).forEach(estado => {
      byEstado[estado] = equiposFiltrados.filter(e => e.estado === estado).length;
    });

    return {
      total: equiposFiltrados.length,
      ...byEstado
    };
  }, [equiposFiltrados]);

  // Funciones de administración - ACTUALIZARÁN FIREBASE
  const cambiarEstadoEquipo = async (equipoId, nuevoEstado) => {
    console.log(`Cambiando estado del equipo ${equipoId} a ${nuevoEstado}`);
    // Implementar llamada a Firebase
  };

  const liberarEquipo = async (equipoId) => {
    console.log(`Liberando equipo ${equipoId}`);
    // Implementar llamada a Firebase
  };

  const asignarUsuario = async (equipoId, nombre, cargo) => {
    console.log(`Asignando equipo ${equipoId} a ${nombre} (${cargo})`);
    // Implementar llamada a Firebase
  };

  const exportarExcel = () => {
    alert('Exportando inventario a Excel... (En producción se generaría el archivo)');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white text-xl">Cargando inventario...</div>
      </div>
    );
  }

  return (

    <div className="min-h-screen relative">
      
      {/* Header */}
      <HeaderInventario
        userMode={userMode}
        setUserMode={setUserMode}
        viewMode={viewMode}
        setViewMode={setViewMode}
        exportarExcel={exportarExcel}
      />


      <div className="max-w-7xl mx-auto px- py-4 space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
          <EstadisticaCard
            titulo="TOTAL EQUIPOS"
            valor={stats.total}
            isTotal={true}
          />

          

          {Object.entries(estadosConfig).map(([key, config]) => (
            <EstadisticaCard
              key={key}
              titulo={key}
              valor={stats[key] || 0}
              config={config}
              onClick={() => setFilterEstado(key)}
            />
          ))}
        </div>
        

        {/* Filtros */}
        <FiltrosEquipos
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          filterEstado={filterEstado}
          setFilterEstado={setFilterEstado}
          filterSucursal={filterSucursal}
          setFilterSucursal={setFilterSucursal}
          filterEmpresa={filterEmpresa}
          setFilterEmpresa={setFilterEmpresa}
          sucursales={sucursales}
          empresas={empresas}
          equiposFiltrados={equiposFiltrados.length}
          totalEquipos={equipos.length}
          userMode={userMode}
          estadosConfig={estadosConfig}
        />

        {/* Vista de Cards */}
        {viewMode === 'cards' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {equiposFiltrados.map(equipo => (
              <EquipoCard
                key={equipo.id}
                equipo={equipo}
                userMode={userMode}
                estadosConfig={estadosConfig}
                onVerMas={() => {
                  setSelectedEquipo(equipo);
                  setShowDetailModal(true);
                }}
                onEditar={() => {
                  setSelectedEquipo(equipo);
                  setShowModal(true);
                }}
              />
            ))}
          </div>
        )}

        {/* Vista de Tabla */}
        {viewMode === 'table' && (
          <EquipoTable
            equiposFiltrados={equiposFiltrados}
            userMode={userMode}
            setSelectedEquipo={setSelectedEquipo}
            setShowDetailModal={setShowDetailModal}
            setShowModal={setShowModal}
            estadosConfig={estadosConfig} // ← IMPORTANTE: Pasar estadosConfig
          />
        )}

        {equiposFiltrados.length === 0 && (
          <div className="text-center py-16 bg-white rounded-2xl shadow-2xl border-2 border-gray-100">
            <AlertCircle className="mx-auto text-gray-400 mb-4" size={64} />
            <p className="text-xl font-bold text-gray-600">No se encontraron equipos</p>
            <p className="text-gray-500 mt-2">Intenta ajustar los filtros de búsqueda</p>
          </div>
        )}
      </div>

      {/* Modales */}
      {showDetailModal && (
        <ModalDetalles
          equipo={selectedEquipo}
          onClose={() => setShowDetailModal(false)}
          estadosConfig={estadosConfig}
        />
      )}

      {showModal && userMode === 'admin' && (
        <ModalAdministracion
          equipo={selectedEquipo}
          onClose={() => setShowModal(false)}
          onLiberar={liberarEquipo}
          onCambiarEstado={cambiarEstadoEquipo}
          onAsignar={asignarUsuario}
        />
      )}
    </div>
  );
};

export default InventarioEquipos;