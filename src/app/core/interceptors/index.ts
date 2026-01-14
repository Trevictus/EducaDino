/**
 * Barrel export para interceptores HTTP
 *
 * Centraliza la exportación de todos los interceptores
 * para facilitar su importación en app.config.ts
 */

export { authInterceptor } from './auth.interceptor';
export { errorInterceptor } from './error.interceptor';
export type { HttpErrorInfo } from './error.interceptor';
export { loggingInterceptor } from './logging.interceptor';
