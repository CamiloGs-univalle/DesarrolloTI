import { Building2 } from "lucide-react";

export function EmpresaCard({ empresa, activos, pendientes, capacidadTotal }) {
    const porcentaje = capacidadTotal
        ? Math.round((activos / capacidadTotal) * 100)
        : 0;

    return (
        <div className="empresa-card">
            <div className="empresa-header">
                <div className="empresa-icon">
                    <Building2 size={20} />
                </div>
                <h3>{empresa}</h3>
            </div>

            <div className="empresa-capacidad">
                <span className="capacidad-numero-activo">{activos}</span>
                <span className="capacidad-separador">/</span>
                <span className="capacidad-numero-total">{capacidadTotal}</span>
            </div>

            <div className="empresa-progreso">
                <div className="progreso-barra" style={{ width: `${porcentaje}%` }} />
            </div>

            <div className="empresa-detalles">
                <span className="detalle-activos">✓ {activos} Activos</span>
                {pendientes > 0 && (
                    <span className="detalle-pendientes">⚠ {pendientes} Pendientes</span>
                )}
            </div>
        </div>
    );
}
