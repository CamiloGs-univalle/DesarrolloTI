export function EstadoBadge({ estado }) {
    const estadoUpper = estado.toUpperCase();

    if (estadoUpper === "ACTIVO" || estadoUpper === "") {
        return (
            <span className="badge badge-activo">
                <span className="badge-dot"></span>Activo
            </span>
        );
    }

    if (estadoUpper === "PENDIENTE") {
        return (
            <span className="badge badge-pendiente">
                <span className="badge-dot"></span>Pendiente
            </span>
        );
    }

    return <span className="badge badge-otro">{estadoUpper}</span>;
}
