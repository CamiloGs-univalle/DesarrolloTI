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

  // 🔎 Función para detectar el logo según el correo o la empresa
  const getLogoEmpresa = (texto) => {
    if (!texto) return null;
    const valor = texto.toLowerCase();

    if (valor.includes("proservis")) return "/logo/ProservisTemporales.png";
    if (valor.includes("affine")) return "/logo/Affine.png";
    if (valor.includes("siamo")) return "/logo/Siamo.png";
    if (valor.includes("mendiola")) return "/logo/Mendiola.png";
    if (valor.includes("anfibia")) return "/logo/Anfibia.png";
    if (valor.includes("samalo")) return "/logo/Samalo.png";

    return null;
  };

  const logoEmpresa =
    getLogoEmpresa(formData.empresa) || getLogoEmpresa(formData.correo);

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
            onChange={onChange}
          />
        </div>

        <div className="campo">
          <div className="checkboxes">
            {["sortime", "tr3", "sap", "solvix"].map((sistema) => (
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

        {/* 👇 Aquí se muestra dinámicamente el logo de la empresa */}
        {logoEmpresa && (
          <div
            className="campo logo-empresa"
            style={{
              textAlign: "center",
              marginTop: "10px",
            }}
          >
            <img
              src={logoEmpresa}
              alt="Logo de la empresa"
              style={{
                width: "180px",
                maxWidth: "100%",
                height: "auto",
                borderRadius: "10px",
                objectFit: "contain",
              }}
            />
          </div>
        )}
      </div>
    </div>
  );
}
