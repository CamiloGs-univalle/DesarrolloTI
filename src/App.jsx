import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/authService";

import LoginPage from "./components/Login/LoginPage";
import Home from "./components/Home/Home";
import HomeTI from "./componentsTI/HomeTI/HomeTI";


export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);
    });

    return () => unsubscribe();
  }, []);

  if (loadingUser) {
    return <div>Cargando usuario...</div>;
  }

  // 🔹 Función para detectar si es correo de TI
  const esUsuarioTI = (correo) =>
    correo?.toLowerCase() === "auxiliar.ti@proservis.com.co" ||
    correo?.toLowerCase() === "aprendiz.ti1@proservis.com.co"; // puedes agregar más

  return (
    <Router>
      <Routes>
        {/* LOGIN */}
        <Route
          path="/"
          element={!user ? <LoginPage /> : <Navigate to="/home" replace />}
        />

        {/* 🔹 RUTA GH (Gestión Humana) */}
        <Route
          path="/home"
          element={
            user ? (
              esUsuarioTI(user.email) ? (
                // Si es de TI → redirige a Interfaz TI
                <Navigate to="/ti" replace />
              ) : (
                // Si es GH → Home normal
                <Home user={user} />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* 🔹 RUTA TI */}
        <Route
          path="/ti"
          element={
            user ? (
              esUsuarioTI(user.email) ? (
                <HomeTI user={user} />
              ) : (
                // Si intenta entrar GH a TI, lo devolvemos
                <Navigate to="/HomeTI" replace />
              )
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* DEFAULT */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
