// src/services/firestoreService.js
import { db } from '../../firebase/firebase';
import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';

export class FirestoreService {
  /**
   * Obtiene un usuario por su cédula
   * @param {string} cedula - Cédula del usuario
   * @returns {Promise<Object|null>} Usuario encontrado o null
   */
  static async obtenerUsuarioPorCedula(cedula) {
    try {
      if (!cedula || typeof cedula !== 'string') {
        throw new Error('Cédula inválida');
      }

      const q = query(
        collection(db, 'usuarios'),
        where('cedula', '==', cedula.trim())
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const userData = { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
        //console.log('✅ Usuario encontrado:', userData.nombre);
        return userData;
      }

      //console.log('ℹ️ Usuario no encontrado con cédula:', cedula);
      return null;
    } catch (error) {
      //console.error('❌ Error al buscar usuario:', error.message);
      throw new Error(`Error al buscar usuario: ${error.message}`);
    }
  }

  /**
   * Crea un nuevo usuario
   * @param {Object} datosUsuario - Datos del usuario
   * @returns {Promise<string>} ID del usuario creado
   */
  static async crearUsuario(datosUsuario) {
    try {
      const usuarioCompleto = {
        ...datosUsuario,
        fechaCreacion: serverTimestamp(),
        activo: true
      };

      const docRef = await addDoc(collection(db, 'usuarios'), usuarioCompleto);
      //console.log('✅ Usuario creado con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      //console.error('❌ Error al crear usuario:', error.message);
      throw new Error(`Error al crear usuario: ${error.message}`);
    }
  }

  /**
   * Guarda una petición
   * @param {Object} datosPeticion - Datos de la petición
   * @returns {Promise<string>} ID de la petición creada
   */
  static async guardarPeticion(datosPeticion) {
    try {
      const peticionCompleta = {
        ...datosPeticion,
        fechaCreacion: serverTimestamp(),
        estado: 'pendiente'
      };

      const docRef = await addDoc(collection(db, 'peticiones'), peticionCompleta);
      //console.log('✅ Petición guardada con ID:', docRef.id);
      return docRef.id;
    } catch (error) {
      //console.error('❌ Error al guardar petición:', error.message);
      throw new Error(`Error al guardar petición: ${error.message}`);
    }
  }

  /**
   * Guarda una inactivación
   * @param {Object} datosInactivacion - Datos de la inactivación
   * @returns {Promise<{ success: boolean, id?: string, error?: any }>}
   */
  static async guardarInactivacion(datosInactivacion) {
    try {
      const docRef = await addDoc(collection(db, 'inactivaciones'), {
        ...datosInactivacion,
        fechaSolicitud: Timestamp.now(),
      });
      //console.log('✅ Inactivación guardada con ID:', docRef.id);
      return { success: true, id: docRef.id };
    } catch (error) {
      //console.error('❌ Error guardando inactivación en Firebase:', error);
      return { success: false, error };
    }
  }
}
