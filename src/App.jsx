import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/authService";

import LoginPage from "./components/Login/LoginPage";
import Home from "./components/Home/Home";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔹 Detecta si hay usuario logueado (o no)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Mientras carga el estado del usuario
  if (loadingUser) {
    return <div>Cargando usuario...</div>;
  }

  return (
    <Router>
      <Routes>
        {/* 🔹 Login principal */}
        <Route
          path="/"
          element={
            !user ? (
              <LoginPage />
            ) : (
              // Si ya está logueado, lo manda directo a /home
              <Navigate to="/home" replace />
            )
          }
        />

        {/* 🔹 Página principal protegida */}
        <Route
          path="/home"
          element={
            user ? (
              <Home user={user} />
            ) : (
              // Si no hay usuario, redirige al login
              <Navigate to="/" replace />
            )
          }
        />

        {/* 🔹 Ruta por defecto (si va a algo desconocido) */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

   