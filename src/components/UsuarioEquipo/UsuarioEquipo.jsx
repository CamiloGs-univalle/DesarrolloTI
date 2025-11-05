// components/UsuarioEquipo.jsx
import { useState } from 'react';
import './UsuarioEquipo.css';
import UsuarioNuevoForm from './nuevo_usuario/UsuarioNuevoForm.jsx';
import UsuarioReemplazoForm from './Remplazo/UsuarioReemplazoForm';
import CargoNuevoForm from './Nuevo_Cargo/CargoNuevoForm';
import { guardarPeticionConUsuarioSiNoExiste } from '../../controllers/userController.js';
import { enviarSolicitudCorreo } from '../../utils/sendEmail.js';
import FondoHomeAnimado from '../FondosAnimados/FondoHomeAnimado.jsx';


/**
 * Componente principal para gestionar usuarios y peticiones
 * Maneja tres tipos de formularios: Reemplazo, Cargo Nuevo
 */
export default function UsuarioEquipo() {
  // 1️⃣ ESTADOS DEL COMPONENTE
  const [formType, setFormType] = useState('reemplazo'); // 'reemplazo' o 'cargo'
  const [loading, setLoading] = useState(false);
  const DESTINATARIOS_CORREO = [
    "aprendiz.ti1@proservis.com.co",
    "auxiliar.ti@proservis.com.co",

  ];


  // 2️⃣ ESTADO PARA TODOS LOS DATOS DEL FORMULARIO
  const [formData, setFormData] = useState({
    // 📋 DATOS BÁSICOS DEL USUARIO
    nombre: '',
    cedula: '',
    empresa: '',
    ciudad: '',
    fechaIngreso: '',
    correo: '',

    // 🔄 DATOS PARA REEMPLAZO
    usuarioReemplazar: '',
    equipo: '',
    celular: '',

    // 💼 DATOS PARA CARGO NUEVO
    cargo: '',
    alquilar: false,
    asignar: false,
    nuevoCorreo: '',
    nombreGerente: '',
    comentario: '',

    // 💻 SISTEMAS REQUERIDOS
    sortime: false,
    tr3: false,
    sap: false,
    solvix: false,

    // 📊 DATOS ADICIONALES
    proceso: ''
  });

  // 3️⃣ MANEJADOR PARA USUARIO SELECCIONADO DEL AUTOCOMPLETADO
  const handleUsuarioSeleccionado = (usuario) => {
    setFormData((prev) => ({
      ...prev,
      // 🏢 DATOS DE EMPRESA Y UBICACIÓN
      empresa: usuario.EMPRESA || '',
      ciudad: usuario.CIUDAD || '',
      correo: usuario.CORREO || '',

      // 👤 DATOS DE CARGO Y PUESTO
      cargo: usuario.CARGO || '',
      nuevoCorreo: usuario.CORREO || '',

      // 🔄 DATOS PARA REEMPLAZO
      usuarioReemplazar: usuario['NOMBRE / APELLIDO'] || '',
      equipo: usuario.CARGO || '',
      proceso: usuario.PROCESO || ''
    }));
    //console.log('✅ Usuario autocompletado:', usuario);
  };

  // 4️⃣ MANEJADOR DE CAMBIOS PARA TODOS LOS INPUTS
  const handleInputChange = (e) => {
    const { name, type, checked, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    //console.log(`📝 Campo actualizado: ${name} =`, type === 'checkbox' ? checked : value);
  };

  // 5️⃣ MANEJADOR DE ENVÍO DEL FORMULARIO
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      //console.log('🚀 Iniciando envío de formulario...');

      // 5️⃣.1 VALIDAR DATOS MÍNIMOS
      if (!formData.cedula.trim()) {
        throw new Error('La cédula es requerida');
      }
      if (!formData.nombre.trim()) {
        throw new Error('El nombre es requerido');
      }

      // 5️⃣.2 PREPARAR DATOS DEL USUARIO PARA FIREBASE
      const datosUsuario = {
        nombre: formData.nombre.trim(),
        cedula: formData.cedula.trim(),
        correo: formData.correo.trim() || `${formData.nombre.toLowerCase().replace(/\s+/g, '.')}@empresa.com`,
        cargo: formData.cargo.trim(),
        empresa: formData.empresa.trim() || 'PROSERVIS TEMPORALES',
        ciudad: formData.ciudad.trim() || 'CALI',
        fechaIngreso: formData.fechaIngreso || new Date().toISOString().split('T')[0],
        estado: 'ACTIVO',
        fechaCreacion: new Date().toISOString()
      };
      // 5️⃣.2.1 VALIDAR DATOS OBLIGATORIOS
      if (!datosUsuario.nombre || !datosUsuario.cedula || !datosUsuario.correo) {
        alert('❌ Por favor completa cédula, nombre y correo antes de enviar.');
        setLoading(false);
        return;
      }
      // 5️⃣.3 PREPARAR DATOS DE LA PETICIÓN PARA FIREBASE
      const datosPeticion = {
        // 📋 INFORMACIÓN BÁSICA
        solicitante: formData.nombre.trim(),
        tipoSolicitud: formType,
        fechaSolicitud: new Date().toISOString(),
        fechaIngreso: formData.fechaIngreso,

        // 🔄 DATOS ESPECÍFICOS SEGÚN TIPO DE FORMULARIO
        ...(formType === 'reemplazo' && {
          usuarioReemplazar: {
            nombre: formData.usuarioReemplazar.trim(),
            equipo: formData.equipo.trim(),
            celular: formData.celular.trim(),
            correo: formData.correo.trim()
          }
        }),

        ...(formType === 'cargo' && {
          cargoNuevo: {
            cargo: formData.cargo.trim(),
            alquilar: formData.alquilar,
            asignar: formData.asignar,
            nuevoCorreo: formData.nuevoCorreo.trim(),
            nombreGerente: formData.nombreGerente.trim(),
            comentario: formData.comentario.trim()
          }
        }),

        // 💻 SISTEMAS REQUERIDOS
        sistemas: {
          sortime: formData.sortime,
          tr3: formData.tr3,
          sap: formData.sap,
          solvix: formData.solvix
        },

        // 📊 METADATOS
        proceso: formData.proceso || 'Sin especificar',
        estado: 'PENDIENTE'
      };

      //console.log('📦 Datos preparados - Usuario:', datosUsuario);
      //console.log('📦 Datos preparados - Petición:', datosPeticion);

      // 5️⃣.4 EJECUTAR LA FUNCIÓN PRINCIPAL DE GUARDADO
      const resultado = await guardarPeticionConUsuarioSiNoExiste(datosUsuario, datosPeticion);

      //console.log('✅ Proceso completado:', resultado);

      // 📨 Enviar correo automático
      enviarSolicitudCorreo(DESTINATARIOS_CORREO, {
        ...formData,
        cargo: datosUsuario.cargo,       // Aseguramos que va limpio
        fechaIngreso: datosUsuario.fechaIngreso
      });

      // 5️⃣.5 MOSTRAR ALERTA DE ÉXITO
      alert(`✅ ${resultado.message}\nUsuario ID: ${resultado.usuarioId}\nPetición ID: ${resultado.peticionId}`);

      // 5️⃣.6 LIMPIAR FORMULARIO DESPUÉS DE ÉXITO
      setFormData({
        nombre: '',
        cedula: '',
        empresa: '',
        ciudad: '',
        fechaIngreso: '',
        correo: '',
        usuarioReemplazar: '',
        equipo: '',
        celular: '',
        cargo: '',
        alquilar: false,
        asignar: false,
        nuevoCorreo: '',
        nombreGerente: '',
        comentario: '',
        sortime: false,
        tr3: false,
        sap: false,
        solvix: false,
        proceso: ''
      });

    } catch (error) {
      // 6️⃣ MANEJO DE ERRORES
      console.error('❌ Error al enviar datos:', error);
      alert(`❌ Error: ${error.message}`);
    } finally {
      // 7️⃣ FINALIZAR CARGA
      setLoading(false);
    }
  };

  // 8️⃣ RENDERIZADO DEL COMPONENTE
  return (
    <div className="form-container">
      <FondoHomeAnimado />
      <form className="formulario" onSubmit={handleSubmit}>

        {/* 🎯 SELECTOR DE TIPO DE FORMULARIO */}
        <div className="tipo-selector">
          <button
            type="button"
            className={formType === 'reemplazo' ? 'active' : ''}
            onClick={() => setFormType('reemplazo')}
            disabled={loading}
          >
            Usuario a Reemplazar
          </button>
          <button
            type="button"
            className={formType === 'cargo' ? 'active' : ''}
            onClick={() => setFormType('cargo')}
            disabled={loading}
          >
            Cargo Nuevo
          </button>
        </div>

        {/* 📋 SECCIONES DEL FORMULARIO */}
        <div className="secciones">
          {/* 👤 FORMULARIO DE USUARIO NUEVO (siempre visible) */}
          <UsuarioNuevoForm
            formData={formData}
            onChange={handleInputChange}
            disabled={loading}
          />

          {/* 🔄 FORMULARIO DE REEMPLAZO (solo visible cuando formType === 'reemplazo') */}
          {formType === 'reemplazo' && (
            <UsuarioReemplazoForm
              formData={formData}
              onChange={handleInputChange}
              onUsuarioSeleccionado={handleUsuarioSeleccionado}
              disabled={loading}
            />
          )}

          {/* 💼 FORMULARIO DE CARGO NUEVO (solo visible cuando formType === 'cargo') */}
          {formType === 'cargo' && (
            <CargoNuevoForm
              formData={formData}
              onChange={handleInputChange}
              disabled={loading}
            />
          )}
        </div>

        {/* 🚀 BOTÓN DE ENVÍO */}
        <div className="submit-container">
          <button
            type="submit"
            className="enviar-btn"
            disabled={loading}
          >
            {loading ? '⏳ Enviando...' : '📤 Enviar Petición'}
          </button>
        </div>


        {/* ℹ️ INFORMACIÓN DE ESTADO */}
        {loading && (
          <div className="loading-info">
            <p>🔄 Guardando en Firebase y enviando a Google Sheets...</p>
          </div>
        )}
      </form>
    </div>
  );
}