import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Interfaz para errores HTTP personalizados
 */
export interface HttpErrorInfo {
  code: number;
  message: string;
  friendlyMessage: string;
  timestamp: Date;
  url: string;
}

/**
 * Mapeo de códigos de error a mensajes amigables
 */
const ERROR_MESSAGES: Record<number, string> = {
  400: 'La solicitud contiene datos inválidos. Por favor, verifica la información.',
  401: 'Tu sesión ha expirado. Por favor, inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  408: 'La solicitud tardó demasiado tiempo. Intenta de nuevo.',
  409: 'Existe un conflicto con los datos actuales.',
  422: 'Los datos enviados no pudieron ser procesados.',
  429: 'Demasiadas solicitudes. Por favor, espera un momento.',
  500: 'Ha ocurrido un error en el servidor. Intenta más tarde.',
  502: 'El servidor no está disponible temporalmente.',
  503: 'El servicio está en mantenimiento. Intenta más tarde.',
  504: 'El servidor tardó demasiado en responder.',
};

/**
 * Error Interceptor (Funcional - Angular 18+)
 *
 * Interceptor para manejo global de errores HTTP.
 *
 * Funcionalidades:
 * - Captura todos los errores HTTP
 * - Mapea códigos de error a mensajes amigables
 * - Logging centralizado de errores
 * - Redirección automática en caso de 401
 * - Re-lanza el error para manejo específico en componentes
 *
 * @example
 * // En el componente, puedes capturar el error específico:
 * this.productService.getProducts().subscribe({
 *   error: (err: HttpErrorInfo) => this.handleError(err)
 * });
 */
export const errorInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      // Construir objeto de error personalizado
      const errorInfo: HttpErrorInfo = {
        code: error.status,
        message: error.message,
        friendlyMessage: getFriendlyMessage(error),
        timestamp: new Date(),
        url: req.url,
      };

      // Logging del error
      console.error('[ErrorInterceptor] Error HTTP:', {
        status: error.status,
        statusText: error.statusText,
        url: req.url,
        message: error.message,
        friendlyMessage: errorInfo.friendlyMessage,
      });

      // Manejo específico según código de error
      switch (error.status) {
        case 401:
          // Sesión expirada: limpiar token y redirigir a login
          handleUnauthorized(router);
          break;

        case 403:
          // Sin permisos: redirigir a página de acceso denegado
          console.warn('[ErrorInterceptor] Acceso denegado:', req.url);
          break;

        case 500:
        case 502:
        case 503:
        case 504:
          // Errores de servidor: podrían mostrarse en un toast global
          console.error('[ErrorInterceptor] Error de servidor:', error.status);
          break;

        case 0:
          // Error de red (sin conexión)
          errorInfo.friendlyMessage =
            'No hay conexión a Internet. Verifica tu conexión e intenta de nuevo.';
          console.error('[ErrorInterceptor] Error de red - Sin conexión');
          break;
      }

      // Re-lanzar el error con información enriquecida
      return throwError(() => errorInfo);
    })
  );
};

/**
 * Obtiene un mensaje amigable para el usuario según el código de error
 */
function getFriendlyMessage(error: HttpErrorResponse): string {
  // Intentar obtener mensaje del servidor
  const serverMessage =
    error.error?.message || error.error?.error || error.error?.detail;

  if (serverMessage && typeof serverMessage === 'string') {
    return serverMessage;
  }

  // Usar mensaje predefinido según código
  return (
    ERROR_MESSAGES[error.status] ||
    'Ha ocurrido un error inesperado. Por favor, intenta de nuevo.'
  );
}

/**
 * Maneja el error 401 (No autorizado)
 */
function handleUnauthorized(router: Router): void {
  // Limpiar tokens del localStorage
  localStorage.removeItem(environment.tokenKey);
  localStorage.removeItem(environment.refreshTokenKey);

  // Log de seguridad
  console.warn('[ErrorInterceptor] Token inválido o expirado - Redirigiendo a login');

  // Redirigir a login preservando la URL actual
  router.navigate(['/login'], {
    queryParams: {
      returnUrl: router.url,
      reason: 'session_expired',
    },
  });
}

