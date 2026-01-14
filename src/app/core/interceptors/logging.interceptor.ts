import {
  HttpInterceptorFn,
  HttpRequest,
  HttpHandlerFn,
  HttpResponse,
} from '@angular/common/http';
import { tap, finalize } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Logging Interceptor (Funcional - Angular 18+)
 *
 * Interceptor de logging para desarrollo que registra:
 * - Información de la petición (método, URL, body)
 * - Tiempo de respuesta
 * - Estado de la respuesta
 *
 * NOTA: Solo activo en modo desarrollo (environment.enableLogging)
 *
 * @example
 * // Output en consola:
 * [HTTP] → GET /api/products
 * [HTTP] ← GET /api/products (200 OK) - 145ms
 */
export const loggingInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
) => {
  // Solo loguear en desarrollo
  if (!environment.enableLogging) {
    return next(req);
  }

  const startTime = performance.now();
  const requestId = generateRequestId();

  // Información de la petición
  const requestInfo = {
    id: requestId,
    method: req.method,
    url: req.url,
    body: req.body,
    headers: getRelevantHeaders(req),
    timestamp: new Date().toISOString(),
  };

  // Log de petición saliente
  console.groupCollapsed(
    `%c[HTTP] → ${req.method} ${getShortUrl(req.url)}`,
    'color: #3A737D; font-weight: bold;'
  );
  console.log('📤 Request:', requestInfo);
  console.groupEnd();

  return next(req).pipe(
    tap({
      next: (event) => {
        if (event instanceof HttpResponse) {
          const elapsed = Math.round(performance.now() - startTime);
          const statusColor = getStatusColor(event.status);

          console.groupCollapsed(
            `%c[HTTP] ← ${req.method} ${getShortUrl(req.url)} (${event.status}) - ${elapsed}ms`,
            `color: ${statusColor}; font-weight: bold;`
          );
          console.log('📥 Response:', {
            id: requestId,
            status: event.status,
            statusText: event.statusText,
            body: event.body,
            elapsed: `${elapsed}ms`,
          });
          console.groupEnd();
        }
      },
      error: (error) => {
        const elapsed = Math.round(performance.now() - startTime);

        console.groupCollapsed(
          `%c[HTTP] ✖ ${req.method} ${getShortUrl(req.url)} (${error.status || 'ERROR'}) - ${elapsed}ms`,
          'color: #EF7B51; font-weight: bold;'
        );
        console.error('❌ Error:', {
          id: requestId,
          status: error.status,
          message: error.message,
          elapsed: `${elapsed}ms`,
        });
        console.groupEnd();
      },
    }),
    finalize(() => {
      // Log final si se desea auditoría adicional
      if (environment.enableLogging) {
        const totalTime = Math.round(performance.now() - startTime);
        console.log(
          `%c[HTTP] ⏱ Request ${requestId} completada en ${totalTime}ms`,
          'color: #888; font-size: 10px;'
        );
      }
    })
  );
};

/**
 * Genera un ID único para cada petición
 */
function generateRequestId(): string {
  return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Obtiene la URL corta para mostrar en logs
 */
function getShortUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.pathname + urlObj.search;
  } catch {
    return url;
  }
}

/**
 * Obtiene los headers relevantes (sin tokens sensibles)
 */
function getRelevantHeaders(
  req: HttpRequest<unknown>
): Record<string, string> {
  const relevantKeys = ['Content-Type', 'Accept', 'X-App-Client'];
  const headers: Record<string, string> = {};

  relevantKeys.forEach((key) => {
    const value = req.headers.get(key);
    if (value) {
      headers[key] = value;
    }
  });

  // Indicar si hay token sin mostrar el valor
  if (req.headers.has('Authorization')) {
    headers['Authorization'] = '***Bearer Token***';
  }

  return headers;
}

/**
 * Obtiene el color según el código de estado
 */
function getStatusColor(status: number): string {
  if (status >= 200 && status < 300) return '#65C1BE'; // Success - Verde
  if (status >= 300 && status < 400) return '#3A737D'; // Redirect - Azul
  if (status >= 400 && status < 500) return '#EF7B51'; // Client Error - Naranja
  return '#BF6241'; // Server Error - Rojo oscuro
}

