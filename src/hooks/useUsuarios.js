import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../models/firebase/firebase";

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function cargar() {
      try {
        const querySnapshot = await getDocs(collection(db, "usuarios"));
        const lista = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setUsuarios(lista);
      } catch (e) {
        console.error("Error leyendo usuarios:", e);
      } finally {
        setLoading(false);
      }
    }
    cargar();
  }, []);

  return { usuarios, loading };
}
