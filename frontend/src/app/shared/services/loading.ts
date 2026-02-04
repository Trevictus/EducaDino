import { Injectable, signal } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * TAREA 4: Servicio de Loading States
 *
 * Implementa un patrón de contador de peticiones para manejar
 * múltiples operaciones asíncronas concurrentes.
 *
 * Ventaja: Si hay 3 peticiones simultáneas, el loading se oculta
 * solo cuando TODAS hayan terminado.
 */
@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  /**
   * Contador de peticiones activas
   */
  private requestCount = 0;

  /**
   * BehaviorSubject para el estado de loading
   */
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  /**
   * Observable público del estado de loading
   */
  readonly loading$: Observable<boolean> = this.loadingSubject.asObservable();

  /**
   * Signal para reactividad en templates
   */
  readonly isLoading = signal<boolean>(false);

  /**
   * Signal con el número de peticiones activas (debugging)
   */
  readonly activeRequests = signal<number>(0);

  constructor() {
    // Sincronizar BehaviorSubject con Signal
    this.loading$.subscribe((loading) => this.isLoading.set(loading));
  }

  /**
   * Muestra el loading (incrementa contador)
   * Emite true si es la primera petición
   */
  show(): void {
    this.requestCount++;
    this.activeRequests.set(this.requestCount);

    if (this.requestCount === 1) {
      this.loadingSubject.next(true);
      console.log('[LoadingService] Loading activado');
    }

    console.log(`[LoadingService] Peticiones activas: ${this.requestCount}`);
  }

  /**
   * Oculta el loading (decrementa contador)
   * Emite false solo si el contador llega a 0
   */
  hide(): void {
    if (this.requestCount > 0) {
      this.requestCount--;
      this.activeRequests.set(this.requestCount);
    }

    if (this.requestCount === 0) {
      this.loadingSubject.next(false);
      console.log('[LoadingService] Loading desactivado');
    }

    console.log(`[LoadingService] Peticiones activas: ${this.requestCount}`);
  }

  /**
   * Fuerza el reset del loading (emergencia)
   */
  forceHide(): void {
    this.requestCount = 0;
    this.activeRequests.set(0);
    this.loadingSubject.next(false);
    console.log('[LoadingService] Loading forzado a desactivar');
  }

  /**
   * Wrapper para operaciones asíncronas
   * Uso: await this.loadingService.wrap(myPromise)
   */
  async wrap<T>(promise: Promise<T>): Promise<T> {
    this.show();
    try {
      return await promise;
    } finally {
      this.hide();
    }
  }
}
