// src/config/constants.js
export const APP_CONFIG = {
  FIREBASE: {
    COLLECTIONS: {
      USUARIOS: 'usuarios',
      PETICIONES: 'peticiones'
    }
  },
  GOOGLE_SHEETS: {
    ENDPOINTS: {
      USUARIOS: 'usuarios',
      PETICIONES: 'peticiones'
    }
  },
  VALIDATION: {
    EMAIL_REGEX: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    CEDULA_MIN_LENGTH: 6,
    NOMBRE_MIN_LENGTH: 2
  }
};