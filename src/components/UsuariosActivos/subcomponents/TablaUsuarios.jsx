import { EstadoBadge } from "./EstadoBadge";

export function TablaUsuarios({ usuarios }) {
    if (usuarios.length === 0) {
        return (
            <div className="tabla-vacia">
                <p>No se encontraron usuarios con los filtros aplicados</p>
            </div>
        );
    }

    return (
        <table className="tabla-usuarios">
            <thead>
                <tr>
                    <th>Nombre</th>
                    <th>Correo</th>
                    <th>Cédula</th>
                    <th>Empresa</th>
                    <th>Ciudad</th>
                    <th>Estado</th>
                </tr>
            </thead>
            <tbody>
                {usuarios.map((u, i) => {
                    const nombre = u["NOMBRE / APELLIDO"] || u.nombre || "Sin nombre";
                    const correo = u.CORREO || u.correo || "Sin correo";
                    const cedula = u.CEDULA || u.cedula || "Sin cédula";
                    const empresa = u.EMPRESA || u.empresa || "Sin empresa";
                    const ciudad = u.CIUDAD || u.ciudad || "Sin ciudad";
                    const estado = (u.ESTADO || u.estado || "ACTIVO").toUpperCase();

                    return (
                        <tr key={i}>
                            <td>
                                <div className="usuario-info">
                                    <div className="usuario-avatar">
                                        {nombre.split(" ").slice(0, 2).map(n => n[0]).join("")}
                                    </div>
                                    <div>
                                        <div className="usuario-nombre">{nombre}</div>
                                        <div className="usuario-cargo">{u.CARGO || ""}</div>
                                    </div>
                                </div>
                            </td>
                            <td className="td-correo">{correo}</td>
                            <td>{cedula}</td>
                            <td>{empresa}</td>
                            <td>{ciudad}</td>
                            <td><EstadoBadge estado={estado} /></td>
                        </tr>
                    );
                })}
            </tbody>
        </table>
    );
}
