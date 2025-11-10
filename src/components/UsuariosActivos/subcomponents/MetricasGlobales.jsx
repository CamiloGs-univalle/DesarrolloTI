// src/components/UsuariosActivos/subcomponents/MetricasGlobales.jsx - VERSIÓN ACTUALIZADA
import { CheckCircle, AlertCircle, Users } from "lucide-react";
import { usePeticionesPendientes } from "../../../models/hooks/usePeticionesPendientes"; // ← Importa el hook de peticiones

export function MetricasGlobales({ stats }) {
    const { activos, totalCapacidad } = stats;
    
    // 🔥 Obtener peticiones pendientes de TI
    const { peticiones: peticionesPendientes, loading } = usePeticionesPendientes();
    
    // Mostrar loading mientras se cargan las peticiones
    if (loading) {
        return (
            <div className="metricas-grid">
                <div className="metrica-card">
                    <div className="metrica-header">
                        <div className="metrica-icon bg-green">
                            <CheckCircle size={24} />
                        </div>
                        <span className="metrica-valor">{activos}</span>
                    </div>
                    <p className="metrica-titulo">Usuarios Activos</p>
                </div>

                <div className="metrica-card">
                    <div className="metrica-header">
                        <div className="metrica-icon bg-yellow">
                            <AlertCircle size={24} />
                        </div>
                        <span className="metrica-valor">...</span>
                    </div>
                    <p className="metrica-titulo">Cargando pendientes...</p>
                </div>

                <div className="metrica-card">
                    <div className="metrica-header">
                        <div className="metrica-icon bg-blue">
                            <Users size={24} />
                        </div>
                        <span className="metrica-valor">{totalCapacidad}</span>
                    </div>
                    <p className="metrica-titulo">Capacidad Total</p>
                </div>
            </div>
        );
    }

    return (
        <div className="metricas-grid">
            <div className="metrica-card">
                <div className="metrica-header">
                    <div className="metrica-icon bg-green">
                        <CheckCircle size={24} />
                    </div>
                    <span className="metrica-valor">{activos}</span>
                </div>
                <p className="metrica-titulo">Usuarios Activos</p>
            </div>

            <div className="metrica-card">
                <div className="metrica-header">
                    <div className="metrica-icon bg-yellow">
                        <AlertCircle size={24} />
                    </div>
                    <span className="metrica-valor">{peticionesPendientes.length}</span>
                </div>
                <p className="metrica-titulo">Pendientes TI</p>
                <p className="metrica-subtitulo">
                    {peticionesPendientes.length === 0 
                        ? "✅ Todas las solicitudes procesadas" 
                        : "📋 Solicitudes por atender"}
                </p>
            </div>

            <div className="metrica-card">
                <div className="metrica-header">
                    <div className="metrica-icon bg-blue">
                        <Users size={24} />
                    </div>
                    <span className="metrica-valor">{totalCapacidad}</span>
                </div>
                <p className="metrica-titulo">Capacidad Total</p>
            </div>
        </div>
    );
}