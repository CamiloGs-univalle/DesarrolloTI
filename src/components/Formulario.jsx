import { useState } from "react";
import { guardarUsuario } from "../controllers/userController";

export default function Formulario() {
  const [nombre, setNombre] = useState("");
  const [edad, setEdad] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await guardarUsuario({ nombre, edad });
    setNombre("");
    setEdad("");
  };

  return (
    <form onSubmit={handleSubmit}>
      <input value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Nombre" required />
      <input type="number" value={edad} onChange={e => setEdad(e.target.value)} placeholder="Edad" required />
      <button type="submit">Guardar</button>
    </form>
  );
}
