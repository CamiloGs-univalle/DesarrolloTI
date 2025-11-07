import { Autocomplete, TextField, CircularProgress } from "@mui/material";
import { useUsuarios } from "../../../models/hooks/useUsuarios";
import { getLogoEmpresa } from "../../../../public/LogoEmpresa/LogoEmpresa";
import React from "react";

export default function UsuarioReemplazoForm({ formData, onChange, onUsuarioSeleccionado }) {
  const { usuarios, loading } = useUsuarios();

  const handleSeleccion = (evento, nuevoValor) => {
    if (nuevoValor) {
      onUsuarioSeleccionado(nuevoValor);
    }
  };

  // ============================================================
  // 🏢 Logo de la empresa
  // ============================================================
  const logoEmpresa = getLogoEmpresa(formData.empresa) || getLogoEmpresa(formData.correo);

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
              getOptionLabel={(option) =>
                option["NOMBRE / APELLIDO"] || option.nombre || "Sin nombre"
              }
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
            onChange={(e) => {
              e.target.value = e.target.value.toUpperCase();
              onChange(e);
            }}
          />
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

        {logoEmpresa && (
          <div className="campo logo-empresa">
            <img src={logoEmpresa} alt="logo empresa" width="180" />
          </div>
        )}
      </div>
    </div>
  );
}
