// src/App.jsx
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import Home from "./components/Home/Home";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/authService";
//import PruebaGoogle from "./components/PruebaGoogle";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  // 🔹 Escuchar cambios de autenticación (login / logout)
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  // 🔄 Mientras se obtiene el usuario desde Firebase
  if (loadingUser) return <div>Cargando usuario...</div>;

  return (
    <Router>
      <Routes>
        {/* 🔹 Ruta de Login */}
        <Route
          path="/"
          element={
            !user ? (
              <LoginPage />
            ) : (
              // Si ya hay sesión activa, redirigir a /home
              <Navigate to="/home" replace />
            )
          }
        />

        {/* 🔹 Ruta protegida /home */}
        <Route
          path="/home"
          element={
            user ? (
              <Home user={user} />
            ) : (
              // Si no hay usuario, redirigir al login
              <Navigate to="/" replace />
            )
          }
        />

        {/* 🔹 Ruta por defecto */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}


//<Route path="/components" element={<PruebaGoogle />} />   