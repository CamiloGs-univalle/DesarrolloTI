// src/models/hooks/usePeticionesPendientes.js
import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export function usePeticionesPendientes() {
    const [peticiones, setPeticiones] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        try {
            const q = query(
                collection(db, 'peticiones'),
                where('estado', '==', 'PENDIENTE'),
                orderBy('TIMESTAMP', 'desc')
            );

            // 👂 Escucha en tiempo real los cambios
            const unsubscribe = onSnapshot(
                q,
                (snapshot) => {
                    const peticionesData = snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    }));
                    setPeticiones(peticionesData);
                    setLoading(false);
                },
                (err) => {
                    console.error('❌ Error al escuchar peticiones pendientes:', err);
                    setError(`Error al escuchar peticiones: ${err.message}`);
                    setLoading(false);
                }
            );

            // 🧹 Limpieza al desmontar el componente
            return () => unsubscribe();
        } catch (err) {
            setError(`Error al cargar peticiones pendientes: ${err.message}`);
            setLoading(false);
        }
    }, []);

    return {
        peticiones,
        loading,
        error,
    };
}
