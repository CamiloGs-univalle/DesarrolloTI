import { CheckCircle, AlertCircle, Users } from "lucide-react";

export function MetricasGlobales({ stats }) {
    const { activos, pendientes, totalCapacidad } = stats;

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
                    <span className="metrica-valor">{pendientes}</span>
                </div>
                <p className="metrica-titulo">Pendientes TI</p>
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
