// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LoginPage from "./components/Login/LoginPage";
import Home from "./components/Home/Home";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase/authService";
//import PruebaGoogle from "./components/PruebaGoogle";

export default function App() {
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      setUser(firebaseUser);
      setLoadingUser(false);
    });

    return () => unsubscribe(); // limpiar listener
  }, []);

  if (loadingUser) return <div>Cargando usuario...</div>;

  return (
    <Router>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route path="/home" element={<Home user={user} />} />
      </Routes>
    </Router>
  );
}

//     <Route path="/components" element={<PruebaGoogle />} />    