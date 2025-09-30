// src/components/UsuarioEquipo/UsuarioReemplazoForm.jsx
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

        <div className="campo_autocomplete">
          {loading ? (
            <CircularProgress size={24} />
          ) : (
            <Autocomplete
              options={usuarios}
              getOptionLabel={(option) => option['NOMBRE / APELLIDO'] || option.nombre || "Sin nombre"}
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
          <label htmlFor="cargo">Cargo</label>
          <input
            type="text"
            id="cargo"
            name="cargo"
            value={formData.cargo}
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
          <label htmlFor="correo">Correo</label>
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