import { useMemo } from "react";
import { CAPACIDAD_TOTAL } from "../constants/capacidades";

/**
 * Hook para manejar filtrado de usuarios y estadísticas
 */
export function useCapacidades(usuarios, filtros) {
    const { filtroEmpresa, filtroCiudad, busqueda } = filtros;

    // 🔍 Filtrar usuarios activos y pendientes
    const usuariosFiltrados = useMemo(() => {
        if (!usuarios || usuarios.length === 0) return [];

        return usuarios.filter(usuario => {
            const estado = (usuario.ESTADO || usuario.estado || "").toUpperCase();
            if (estado === "INACTIVO") return false;

            const empresa = usuario.EMPRESA || usuario.empresa || "";
            const ciudad = usuario.CIUDAD || usuario.ciudad || "";
            const nombre = usuario["NOMBRE / APELLIDO"] || usuario.nombre || "";
            const correo = usuario.CORREO || usuario.correo || "";
            const cedula = usuario.CEDULA || usuario.cedula || "";

            const matchEmpresa =
                filtroEmpresa === "TODAS" ||
                empresa.toUpperCase().includes(filtroEmpresa.toUpperCase());
            const matchCiudad =
                filtroCiudad === "TODAS" ||
                ciudad.toUpperCase().includes(filtroCiudad.toUpperCase());
            const matchBusqueda =
                busqueda === "" ||
                nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
                correo.toLowerCase().includes(busqueda.toLowerCase()) ||
                cedula.includes(busqueda);

            return matchEmpresa && matchCiudad && matchBusqueda;
        });
    }, [usuarios, filtroEmpresa, filtroCiudad, busqueda]);

    // 📊 Estadísticas globales
    const estadisticasGlobales = useMemo(() => {
        if (!usuarios || usuarios.length === 0)
            return { activos: 0, pendientes: 0, totalCapacidad: 0 };

        const activos = usuarios.filter(
            u => (u.ESTADO || u.estado || "").toUpperCase() !== "INACTIVO"
        ).length;

        const pendientes = usuarios.filter(
            u => (u.ESTADO || u.estado || "").toUpperCase() === "PENDIENTE"
        ).length;

        const totalCapacidad = Object.values(CAPACIDAD_TOTAL).reduce(
            (a, b) => a + b,
            0
        );

        return { activos, pendientes, totalCapacidad };
    }, [usuarios]);

    // 📈 Capacidad por empresa
    const capacidadesPorEmpresa = useMemo(() => {
        if (!usuarios) return [];
        const empresas =
            filtroEmpresa === "TODAS"
                ? Object.keys(CAPACIDAD_TOTAL)
                : [filtroEmpresa];

        return empresas.map(empresa => {
            const usuariosEmpresa = usuarios.filter(u => {
                const empresaU = (u.EMPRESA || u.empresa || "").toUpperCase();
                const ciudadU = u.CIUDAD || u.ciudad || "";
                const estadoU = (u.ESTADO || u.estado || "").toUpperCase();

                return (
                    empresaU.includes(empresa.toUpperCase()) &&
                    estadoU !== "INACTIVO" &&
                    (filtroCiudad === "TODAS" ||
                        ciudadU.toUpperCase().includes(filtroCiudad.toUpperCase()))
                );
            });

            const activos = usuariosEmpresa.filter(
                u =>
                    (u.ESTADO || u.estado || "").toUpperCase() === "ACTIVO" ||
                    (u.ESTADO || u.estado || "") === ""
            ).length;

            const pendientes = usuariosEmpresa.filter(
                u => (u.ESTADO || u.estado || "").toUpperCase() === "PENDIENTE"
            ).length;

            const capacidadTotal = CAPACIDAD_TOTAL[empresa] || activos;

            return { empresa, activos, pendientes, capacidadTotal };
        });
    }, [usuarios, filtroEmpresa, filtroCiudad]);

    return { usuariosFiltrados, estadisticasGlobales, capacidadesPorEmpresa };
}
