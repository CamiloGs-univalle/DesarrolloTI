// ============================================================================
// 📄 Componente contenedor: InactivacionUsuario.jsx
// ----------------------------------------------------------------------------
// ✅ Renderiza el formulario principal y muestra el modal de confirmación
//    cuando la solicitud ha sido generada correctamente.
// ============================================================================

import { useState } from "react";
import "./InactivacionUsuario.css";
import FormInactivacion from "./FormInactivacion/FormInactivacion";
import ModalCorreoInactivacion from "./FormInactivacion/ModalCorreoInactivacion";
import FondoHomeAnimado from "../FondosAnimados/FondoHomeAnimado";


export default function InactivacionUsuario() {
  const [formData, setFormData] = useState(null);
  const [mostrarModal, setMostrarModal] = useState(false);

  /** 🟢 Se ejecuta cuando el formulario se envía correctamente */
  const handleFormSubmit = (data) => {
    setFormData(data);
    setMostrarModal(true);
  };

  return (

    <div className="inactivacion-container">

      <FondoHomeAnimado />
      <FormInactivacion onSubmitSuccess={handleFormSubmit} />

      {/* Modal de confirmación */}
      {mostrarModal && (
        <ModalCorreoInactivacion
          data={formData}
          onClose={() => setMostrarModal(false)}
        />
      )}
    </div>

  );
}
