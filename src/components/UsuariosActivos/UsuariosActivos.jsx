import { useState } from "react";
import { useUsuarios } from "../../models/hooks/useUsuarios";
import { useCapacidades } from "./hooks/useCapacidades";
import { CAPACIDAD_TOTAL } from "./constants/capacidades";
import { MetricasGlobales } from "./subcomponents/MetricasGlobales";
import { EmpresaCard } from "./subcomponents/EmpresaCard";
import { FiltrosUsuarios } from "./subcomponents/FiltrosUsuarios";
import { TablaUsuarios } from "./subcomponents/TablaUsuarios";
import "./UsuariosActivos.css";

export default function UsuariosActivos() {
    const { usuarios, loading } = useUsuarios();

    const [filtros, setFiltros] = useState({
        filtroEmpresa: "TODAS",
        filtroCiudad: "TODAS",
        busqueda: ""
    });

    const { usuariosFiltrados, estadisticasGlobales, capacidadesPorEmpresa } =
        useCapacidades(usuarios, filtros);

    const empresas = ["TODAS", ...Object.keys(CAPACIDAD_TOTAL)];
    const ciudades = ["TODAS", ...new Set(usuarios?.map(u => u.CIUDAD || u.ciudad))];

    if (loading)
        return (
            <div className="usuarios-loading">
                <div className="spinner"></div>
                <p>Cargando usuarios...</p>
            </div>
        );

    return (
        <div className="modulo-usuarios-activos">
            <MetricasGlobales stats={estadisticasGlobales} />

            <div className="capacidad-empresas-grid">
                {capacidadesPorEmpresa.map(e => (
                    <EmpresaCard key={e.empresa} {...e} />
                ))}
            </div>

            <FiltrosUsuarios
                filtroEmpresa={filtros.filtroEmpresa}
                setFiltroEmpresa={v => setFiltros({ ...filtros, filtroEmpresa: v })}
                filtroCiudad={filtros.filtroCiudad}
                setFiltroCiudad={v => setFiltros({ ...filtros, filtroCiudad: v })}
                busqueda={filtros.busqueda}
                setBusqueda={v => setFiltros({ ...filtros, busqueda: v })}
                empresas={empresas}
                ciudades={ciudades}
                total={usuariosFiltrados.length}
            />

            <TablaUsuarios usuarios={usuariosFiltrados} />
        </div>
    );
}
