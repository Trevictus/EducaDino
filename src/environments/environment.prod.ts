/**
 * Environment - Configuración de Producción
 *
 * Contiene las variables de entorno para el modo producción.
 * Se reemplaza automáticamente durante el build de producción.
 */
export const environment = {
  production: true,

  // URL base de la API (cambiar por la URL real de producción)
  apiUrl: 'https://api.educadino.com/api',

  // Nombre de la aplicación
  appName: 'EducaDino',

  // Versión de la aplicación
  appVersion: '1.0.0',

  // Deshabilitar logs en producción
  enableLogging: false,

  // Configuración de tokens
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',

  // Timeout de peticiones HTTP (ms)
  httpTimeout: 30000,
};

