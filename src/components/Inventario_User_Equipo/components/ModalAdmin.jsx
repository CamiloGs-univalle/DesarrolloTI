// src/components/Inventario_User_Equipo/components/ModalAdmin.jsx
import React from 'react';
import { Laptop, Edit, Clock, Wrench, CheckCircle } from 'lucide-react';
import { estadosConfig } from '../data/estadosConfig';

const ModalAdministracion = ({ equipo, onClose, onLiberar, onCambiarEstado, onAsignar }) => {
  if (!equipo) return null;
  
  const estadoConfig = estadosConfig[equipo.estado];
  const usuarioAnterior = equipo.historial && equipo.historial.length > 0 ? equipo.historial[equipo.historial.length - 1] : null;
  
  const handleAsignar = () => {
    const nombre = document.getElementById('nuevoUsuario').value;
    const cargo = document.getElementById('nuevoCargo').value;
    if (nombre && cargo) {
      onAsignar(equipo.id, nombre, cargo);
      onClose();
    } else {
      alert('Por favor completa todos los campos');
    }
  };

  const handleAsignarReemplazo = () => {
    if (usuarioAnterior) {
      const nuevoNombre = prompt(`Ingresa el nombre del nuevo ${usuarioAnterior.cargo}:`);
      if (nuevoNombre) {
        onAsignar(equipo.id, nuevoNombre, usuarioAnterior.cargo);
        onClose();
      }
    }
  };
  
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-6 text-white rounded-t-3xl">
          <h3 className="text-3xl font-black flex items-center gap-3">
            <Edit size={32} />
            Panel de Administración TI
          </h3>
          <p className="text-white/90 mt-1 font-semibold">Gestión del equipo: {equipo.codigoActivo}</p>
        </div>

        <div className="p-6">
          {/* Info del equipo */}
          <div className="bg-gray-50 p-4 rounded-xl mb-6 border-2 border-gray-200">
            <div className="flex items-center gap-3 mb-3">
              <Laptop size={28} className="text-blue-600" />
              <div>
                <p className="font-black text-xl text-gray-800">{equipo.marca} - {equipo.tipoEquipo}</p>
                <p className="text-sm text-gray-600">Serial: {equipo.serial}</p>
              </div>
            </div>
            <div className={`inline-flex items-center gap-2 px-3 py-2 rounded-full ${estadoConfig.badge} font-bold text-sm`}>
              {estadoConfig.emoji} {equipo.estado}
            </div>
          </div>

          {/* Acciones según estado */}
          <div className="space-y-4">
            <h4 className="font-black text-lg text-gray-800">⚡ Acciones Disponibles</h4>

            {/* Si está activo */}
            {equipo.estado === 'Activo' && (
              <div className="space-y-3">
                <button
                  onClick={() => {
                    if(confirm(`¿Deseas liberar el equipo de ${equipo.usuarioActual}? El equipo pasará a estado "Paz y Salvo" para inspección.`)) {
                      onLiberar(equipo.id);
                      onClose();
                    }
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-xl font-bold hover:from-orange-500 hover:to-red-500 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Clock size={24} />
                  🔍 Inactivar Usuario y Enviar a Paz y Salvo
                </button>
                <button
                  onClick={() => {
                    if(confirm('¿Enviar equipo directamente a reparación?')) {
                      onCambiarEstado(equipo.id, 'En Reparación');
                      onClose();
                    }
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-amber-500 to-orange-500 text-white rounded-xl font-bold hover:from-amber-600 hover:to-orange-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Wrench size={24} />
                  Enviar a Reparación
                </button>
              </div>
            )}

            {/* Si está disponible */}
            {equipo.estado === 'Disponible' && (
              <div className="space-y-3">
                {/* Mostrar opción de reemplazo prioritario */}
                {usuarioAnterior && (
                  <div className="bg-yellow-50 p-4 rounded-xl border-2 border-yellow-300 mb-4">
                    <p className="text-sm font-bold text-yellow-800 mb-2 flex items-center gap-2">
                      ⭐ ASIGNACIÓN PRIORITARIA
                    </p>
                    <p className="text-xs text-yellow-700 mb-3">
                      Este equipo fue usado por <strong>{usuarioAnterior.usuario}</strong> en el cargo de <strong>{usuarioAnterior.cargo}</strong>
                    </p>
                    <button
                      onClick={handleAsignarReemplazo}
                      className="w-full px-6 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg font-bold hover:from-yellow-600 hover:to-orange-600 transition-all shadow-lg"
                    >
                      ⭐ Asignar a Reemplazo de {usuarioAnterior.cargo}
                    </button>
                  </div>
                )}

                <div className="bg-blue-50 p-4 rounded-xl border-2 border-blue-300">
                  <p className="text-sm font-bold text-blue-700 mb-3">ASIGNAR A NUEVO USUARIO</p>
                  <input
                    type="text"
                    placeholder="Nombre completo del usuario"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 font-semibold"
                    id="nuevoUsuario"
                  />
                  <input
                    type="text"
                    placeholder="Cargo"
                    className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg mb-3 font-semibold"
                    id="nuevoCargo"
                  />
                  <button
                    onClick={handleAsignar}
                    className="w-full px-6 py-3 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-lg font-bold hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg"
                  >
                    ✅ Asignar Equipo
                  </button>
                </div>
              </div>
            )}

            {/* Si está en Paz y Salvo */}
            {equipo.estado === 'Paz y Salvo' && (
              <div className="space-y-3">
                <div className="bg-orange-50 p-4 rounded-xl border-2 border-orange-300 mb-4">
                  <p className="text-sm font-bold text-orange-700 mb-2">🔍 EQUIPO EN INSPECCIÓN</p>
                  <p className="text-sm text-orange-600">
                    El equipo fue liberado del usuario anterior y está siendo revisado.
                  </p>
                  {usuarioAnterior && (
                    <p className="text-xs text-orange-600 mt-2">
                      <strong>Último usuario:</strong> {usuarioAnterior.usuario} ({usuarioAnterior.cargo})
                    </p>
                  )}
                  <p className="text-xs text-orange-700 mt-2 font-bold">
                    ⚠️ No se puede asignar hasta completar inspección
                  </p>
                </div>
                <button
                  onClick={() => {
                    if(confirm('¿El equipo pasó la inspección y está en buen estado?')) {
                      onCambiarEstado(equipo.id, 'Disponible');
                      onClose();
                    }
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <CheckCircle size={24} />
                  ✅ Aprobar - Está en Buen Estado
                </button>
                <button
                  onClick={() => {
                    if(confirm('¿El equipo requiere reparación?')) {
                      onCambiarEstado(equipo.id, 'En Reparación');
                      onClose();
                    }
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-orange-500 to-red-500 text-white rounded-xl font-bold hover:from-orange-600 hover:to-red-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <Wrench size={24} />
                  🔧 Requiere Reparación
                </button>
              </div>
            )}

            {/* Si está en Reparación */}
            {equipo.estado === 'En Reparación' && (
              <div className="space-y-3">
                <div className="bg-red-50 p-4 rounded-xl border-2 border-red-300 mb-4">
                  <p className="text-sm font-bold text-red-700 mb-2">🔧 EQUIPO EN MANTENIMIENTO</p>
                  <p className="text-sm text-red-600">Este equipo está congelado y no se puede asignar.</p>
                  {usuarioAnterior && (
                    <p className="text-xs text-red-600 mt-2">
                      <strong>Último usuario:</strong> {usuarioAnterior.usuario}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => {
                    if(confirm('¿El equipo fue reparado exitosamente?')) {
                      onCambiarEstado(equipo.id, 'Disponible');
                      onClose();
                    }
                  }}
                  className="w-full px-6 py-4 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-bold hover:from-emerald-600 hover:to-green-600 transition-all shadow-lg flex items-center justify-center gap-3"
                >
                  <CheckCircle size={24} />
                  ✅ Marcar como Reparado
                </button>
              </div>
            )}

            {/* Si está Alquilado */}
            {equipo.estado === 'Alquilado' && (
              <div className="bg-purple-50 p-4 rounded-xl border-2 border-purple-300">
                <p className="text-sm font-bold text-purple-700 mb-2">🔗 EQUIPO ALQUILADO</p>
                <p className="text-sm text-purple-600">Este equipo pertenece a un proveedor externo.</p>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 bg-gray-50 border-t-2 border-gray-200 rounded-b-3xl">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-300 text-gray-700 rounded-xl font-bold hover:bg-gray-400 transition-all"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalAdministracion;