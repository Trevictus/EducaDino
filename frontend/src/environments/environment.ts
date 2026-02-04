/**
 * Environment - Configuración de Desarrollo
 *
 * Contiene las variables de entorno para el modo desarrollo.
 * En producción, se usa environment.prod.ts
 */
export const environment = {
  production: false,

  // URL base de la API (Spring Boot backend)
  apiUrl: '/api',

  // Nombre de la aplicación
  appName: 'EducaDino',

  // Versión de la aplicación
  appVersion: '1.0.0',

  // Habilitar logs de debugging
  enableLogging: true,

  // Configuración de tokens
  tokenKey: 'auth_token',
  refreshTokenKey: 'refresh_token',

  // Timeout de peticiones HTTP (ms)
  httpTimeout: 30000,
};
