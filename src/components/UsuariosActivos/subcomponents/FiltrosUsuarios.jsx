import { Search, Filter } from "lucide-react";

export function FiltrosUsuarios({
    filtroEmpresa,
    setFiltroEmpresa,
    filtroCiudad,
    setFiltroCiudad,
    busqueda,
    setBusqueda,
    empresas,
    ciudades,
    total
}) {
    return (
        <div className="filtros-container">
            <div className="filtro-busqueda">
                <Search className="filtro-icon" size={18} />
                <input
                    type="text"
                    placeholder="Buscar por nombre, correo o cédula..."
                    value={busqueda}
                    onChange={e => setBusqueda(e.target.value)}
                    className="filtro-input"
                />
            </div>

            <select
                value={filtroEmpresa}
                onChange={e => setFiltroEmpresa(e.target.value)}
                className="filtro-select"
            >
                {empresas.map(emp => (
                    <option key={emp} value={emp}>
                        {emp}
                    </option>
                ))}
            </select>

            <select
                value={filtroCiudad}
                onChange={e => setFiltroCiudad(e.target.value)}
                className="filtro-select"
            >
                {ciudades.map(ciudad => (
                    <option key={ciudad} value={ciudad}>
                        {ciudad}
                    </option>
                ))}
            </select>

            <div className="filtro-contador">
                <Filter size={14} />
                <span>Mostrando {total} usuarios</span>
            </div>
        </div>
    );
}
