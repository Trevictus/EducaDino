import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { environment } from '../../../environments/environment';

/**
 * Auth Interceptor (Funcional - Angular 18+)
 *
 * Interceptor de autenticación que añade headers necesarios
 * a todas las peticiones HTTP salientes.
 *
 * Funcionalidades:
 * - Añade header Authorization: Bearer [token]
 * - Añade header personalizado X-App-Client
 * - Solo aplica a peticiones hacia la API configurada
 *
 * @example
 * // Configuración en app.config.ts
 * provideHttpClient(withInterceptors([authInterceptor]))
 */
export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Verificar si la petición va a nuestra API
  const isApiRequest = req.url.startsWith(environment.apiUrl);

  if (!isApiRequest) {
    // Si no es una petición a nuestra API, continuar sin modificar
    return next(req);
  }

  // Obtener token del localStorage
  const token = localStorage.getItem(environment.tokenKey);

  // Clonar la petición y añadir headers
  const modifiedReq = req.clone({
    setHeaders: {
      // Header de autenticación (solo si hay token)
      ...(token ? { Authorization: `Bearer ${token}` } : {}),

      // Header personalizado de identificación del cliente
      'X-App-Client': `${environment.appName}/${environment.appVersion}`,

      // Headers estándar para JSON API
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  // Log en desarrollo
  if (environment.enableLogging) {
    console.log('[AuthInterceptor] Headers añadidos:', {
      url: req.url,
      hasToken: !!token,
      appClient: `${environment.appName}/${environment.appVersion}`,
    });
  }

  return next(modifiedReq);
};
