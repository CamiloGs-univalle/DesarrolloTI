import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useUsuarios } from "../../../hooks/useUsuarios";
import React from "react";

export default function UsuarioReemplazoForm({ formData, onChange, onUsuarioSeleccionado }) {
  const { usuarios, loading } = useUsuarios();

  const handleSeleccion = (evento, nuevoValor) => {
    if (nuevoValor) {
      onUsuarioSeleccionado(nuevoValor);
    }
  };

  return (
    <div className="seccion seccion-dinamica">
      <div className="form-reemplazo">
        <h2 className="titulo-seccion">Usuario a Reemplazar</h2>

        <div className="campo">
          <label htmlFor="usuarioReemplazar">Nombre</label>
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Autocomplete
              options={usuarios}
              getOptionLabel={(option) => option.nombre || ""}
              onChange={handleSeleccion}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Buscar usuario"
                  variant="outlined"
                  fullWidth
                />
              )}
            />
          )}
        </div>

        <div className="campo">
          <label htmlFor="equipo">Cargo</label>
          <input
            type="text"
            id="equipo"
            name="equipo"
            value={formData.equipo}
            onChange={onChange}
          />
        </div>

        <div className="campo">
          <div className="checkboxes">
            {['sortime', 'tr3', 'sap', 'solvix'].map((sistema) => (
              <div className="checkbox-group" key={sistema}>
                <input
                  type="checkbox"
                  id={sistema}
                  name={sistema}
                  checked={formData[sistema]}
                  onChange={onChange}
                />
                <label htmlFor={sistema}>{sistema.toUpperCase()}</label>
              </div>
            ))}
          </div>
        </div>

        <div className="campo">
          <label htmlFor="correo">Comentario</label>
          <input
            type="email"
            id="correo"
            name="correo"
            value={formData.correo}
            onChange={onChange}
          />
        </div>
      </div>
    </div>
  );
}
