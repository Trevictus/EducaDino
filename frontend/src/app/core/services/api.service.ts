import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams, HttpHeaders, HttpContext } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';

/**
 * Opciones para las peticiones HTTP
 */
export interface ApiRequestOptions {
  headers?: HttpHeaders | Record<string, string | string[]>;
  params?: HttpParams | Record<string, string | number | boolean | (string | number | boolean)[]>;
  context?: HttpContext;
  reportProgress?: boolean;
  withCredentials?: boolean;
}

/**
 * Respuesta paginada estándar de la API
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    currentPage: number;
    totalPages: number;
    pageSize: number;
    totalItems: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

/**
 * Respuesta estándar de la API para operaciones simples
 */
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp?: string;
}

/**
 * ApiService - Servicio Base para Comunicación HTTP
 *
 * Servicio genérico que envuelve HttpClient proporcionando:
 * - URL base centralizada desde environment
 * - Métodos tipados para CRUD: get, post, put, patch, delete
 * - Manejo de errores básico con catchError
 * - Construcción de HttpParams para queries complejas
 * - Soporte para FormData (subida de archivos)
 *
 * @example
 * // Inyección y uso básico
 * private api = inject(ApiService);
 *
 * getProducts() {
 *   return this.api.get<Product[]>('/products');
 * }
 *
 * createProduct(data: CreateProductDto) {
 *   return this.api.post<Product>('/products', data);
 * }
 */
@Injectable({
  providedIn: 'root',
})
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  /**
   * Realiza una petición GET
   *
   * @param endpoint - Ruta del endpoint (ej: '/products')
   * @param options - Opciones adicionales (params, headers, etc.)
   * @returns Observable con la respuesta tipada
   *
   * @example
   * // Petición simple
   * this.api.get<Product[]>('/products')
   *
   * // Con parámetros de query
   * this.api.get<Product[]>('/products', {
   *   params: { category: 'toys', limit: 10 }
   * })
   */
  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .get<T>(this.buildUrl(endpoint), this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  /**
   * Realiza una petición POST
   *
   * @param endpoint - Ruta del endpoint
   * @param body - Cuerpo de la petición
   * @param options - Opciones adicionales
   * @returns Observable con la respuesta tipada
   *
   * @example
   * this.api.post<Product>('/products', {
   *   name: 'Nuevo Producto',
   *   price: 29.99
   * })
   */
  post<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .post<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  /**
   * Realiza una petición PUT (reemplazo completo)
   *
   * @param endpoint - Ruta del endpoint
   * @param body - Cuerpo de la petición
   * @param options - Opciones adicionales
   * @returns Observable con la respuesta tipada
   *
   * @example
   * this.api.put<Product>('/products/123', updatedProduct)
   */
  put<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .put<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  /**
   * Realiza una petición PATCH (actualización parcial)
   *
   * @param endpoint - Ruta del endpoint
   * @param body - Campos a actualizar
   * @param options - Opciones adicionales
   * @returns Observable con la respuesta tipada
   *
   * @example
   * this.api.patch<Product>('/products/123', { price: 34.99 })
   */
  patch<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .patch<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  /**
   * Realiza una petición DELETE
   *
   * @param endpoint - Ruta del endpoint
   * @param options - Opciones adicionales
   * @returns Observable con la respuesta tipada
   *
   * @example
   * this.api.delete<void>('/products/123')
   */
  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http
      .delete<T>(this.buildUrl(endpoint), this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  /**
   * Sube un archivo usando FormData
   *
   * @param endpoint - Ruta del endpoint
   * @param file - Archivo a subir
   * @param fieldName - Nombre del campo del archivo (default: 'file')
   * @param additionalData - Datos adicionales a incluir en el FormData
   * @returns Observable con la respuesta tipada
   *
   * @example
   * const file = event.target.files[0];
   * this.api.uploadFile<UploadResponse>('/products/123/image', file, 'image', {
   *   productId: '123'
   * })
   */
  uploadFile<T>(
    endpoint: string,
    file: File,
    fieldName: string = 'file',
    additionalData?: Record<string, string | Blob>
  ): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);

    // Añadir datos adicionales si existen
    if (additionalData) {
      Object.entries(additionalData).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    // Para subida de archivos, no enviamos Content-Type
    // El browser lo establece automáticamente con el boundary correcto
    return this.http
      .post<T>(this.buildUrl(endpoint), formData, {
        // No establecer Content-Type, se genera automáticamente
      })
      .pipe(catchError(this.handleError));
  }

  /**
   * Sube múltiples archivos
   *
   * @param endpoint - Ruta del endpoint
   * @param files - Array de archivos a subir
   * @param fieldName - Nombre del campo de archivos
   * @returns Observable con la respuesta tipada
   */
  uploadMultipleFiles<T>(
    endpoint: string,
    files: File[],
    fieldName: string = 'files'
  ): Observable<T> {
    const formData = new FormData();

    files.forEach((file, index) => {
      formData.append(`${fieldName}[${index}]`, file, file.name);
    });

    return this.http
      .post<T>(this.buildUrl(endpoint), formData)
      .pipe(catchError(this.handleError));
  }

  /**
   * Construye la URL completa del endpoint
   */
  private buildUrl(endpoint: string): string {
    // Asegurar que el endpoint comience con /
    const normalizedEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
    return `${this.baseUrl}${normalizedEndpoint}`;
  }

  /**
   * Construye las opciones de la petición
   */
  private buildOptions(options?: ApiRequestOptions): Record<string, unknown> {
    if (!options) {
      return {};
    }

    const result: Record<string, unknown> = {};

    // Convertir params a HttpParams si es necesario
    if (options.params) {
      result['params'] = this.buildParams(options.params);
    }

    // Convertir headers a HttpHeaders si es necesario
    if (options.headers) {
      result['headers'] =
        options.headers instanceof HttpHeaders
          ? options.headers
          : new HttpHeaders(options.headers as Record<string, string>);
    }

    if (options.context) {
      result['context'] = options.context;
    }

    if (options.reportProgress !== undefined) {
      result['reportProgress'] = options.reportProgress;
    }

    if (options.withCredentials !== undefined) {
      result['withCredentials'] = options.withCredentials;
    }

    return result;
  }

  /**
   * Construye HttpParams desde un objeto
   */
  private buildParams(
    params: HttpParams | Record<string, string | number | boolean | (string | number | boolean)[]>
  ): HttpParams {
    if (params instanceof HttpParams) {
      return params;
    }

    let httpParams = new HttpParams();

    Object.entries(params).forEach(([key, value]) => {
      if (value === null || value === undefined) {
        return;
      }

      if (Array.isArray(value)) {
        // Para arrays, añadir múltiples valores con el mismo key
        value.forEach((v) => {
          httpParams = httpParams.append(key, String(v));
        });
      } else {
        httpParams = httpParams.set(key, String(value));
      }
    });

    return httpParams;
  }

  /**
   * Manejo de errores básico
   * Los errores detallados se manejan en el errorInterceptor
   */
  private handleError(error: unknown): Observable<never> {
    console.error('[ApiService] Error en petición:', error);
    return throwError(() => error);
  }
}

