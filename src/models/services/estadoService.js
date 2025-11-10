// src/services/estadoService.js
import { doc, updateDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '../firebase/firebase';

export class EstadoService {
    /**
     * Cambia el estado de una petición y actualiza el usuario correspondiente
     * @param {string} peticionId - ID de la petición
     * @param {string} nuevoEstadoPeticion - Nuevo estado de la petición (COMPLETADA, RECHAZADA)
     * @param {string} nuevoEstadoUsuario - Nuevo estado del usuario (ACTIVO, INACTIVO)
     * @returns {Promise<Object>} Resultado de la operación
     */
    static async responderPeticion(peticionId, nuevoEstadoPeticion, nuevoEstadoUsuario) {
        try {
            // 1. Actualizar el estado de la petición
            const peticionRef = doc(db, 'peticiones', peticionId);
            await updateDoc(peticionRef, {
                estado: nuevoEstadoPeticion,
                fechaRespuesta: new Date().toISOString(),
                estadoRespuesta: nuevoEstadoPeticion
            });

            // 2. Obtener la cédula del usuario de la petición
            const peticionesQuery = query(
                collection(db, 'peticiones'),
                where('__name__', '==', peticionId)
            );
            const peticionSnapshot = await getDocs(peticionesQuery);
            
            if (peticionSnapshot.empty) {
                throw new Error('Petición no encontrada');
            }

            const peticionData = peticionSnapshot.docs[0].data();
            const cedulaUsuario = peticionData["CEDULA USUARIO"] || peticionData.cedulaUsuario;

            if (!cedulaUsuario) {
                throw new Error('No se pudo encontrar la cédula del usuario en la petición');
            }

            // 3. Buscar y actualizar el estado del usuario
            const usuariosQuery = query(
                collection(db, 'usuarios'),
                where('CEDULA', '==', cedulaUsuario)
            );
            const usuarioSnapshot = await getDocs(usuariosQuery);

            if (!usuarioSnapshot.empty) {
                const usuarioRef = usuarioSnapshot.docs[0].ref;
                await updateDoc(usuarioRef, {
                    ESTADO: nuevoEstadoUsuario,
                    fechaActualizacion: new Date().toISOString()
                });
            }

            return {
                success: true,
                message: `Petición ${nuevoEstadoPeticion.toLowerCase()} y usuario actualizado a ${nuevoEstadoUsuario}`,
                peticionId,
                cedulaUsuario
            };

        } catch (error) {
            console.error('Error respondiendo petición:', error);
            throw new Error(`Error al responder petición: ${error.message}`);
        }
    }

    /**
     * Aprobar una petición (usuario se activa)
     */
    static async aprobarPeticion(peticionId) {
        return await this.responderPeticion(peticionId, 'COMPLETADA', 'ACTIVO');
    }

    /**
     * Rechazar una petición (usuario se inactiva o mantiene estado según el caso)
     */
    static async rechazarPeticion(peticionId) {
        return await this.responderPeticion(peticionId, 'RECHAZADA', 'INACTIVO');
    }
}