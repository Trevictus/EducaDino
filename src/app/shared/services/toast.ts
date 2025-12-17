import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Tipos de toast disponibles
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';

/**
 * Interfaz para un mensaje Toast
 */
export interface Toast {
  id: string;
  message: string;
  type: ToastType;
  duration: number;
  title?: string;
}

/**
 * Configuración por defecto de duración según tipo
 */
const DEFAULT_DURATIONS: Record<ToastType, number> = {
  success: 3000,
  error: 5000,
  warning: 4000,
  info: 3000
};

/**
 * TAREA 3: Servicio de Toasts/Notificaciones
 *
 * Gestiona las notificaciones globales de la aplicación.
 * Usa BehaviorSubject para el estado y Signals para reactividad en templates.
 */
@Injectable({
  providedIn: 'root'
})
export class ToastService {
  /**
   * BehaviorSubject con el array de toasts activos
   */
  private readonly toastsSubject = new BehaviorSubject<Toast[]>([]);

  /**
   * Observable público de toasts
   */
  readonly toasts$: Observable<Toast[]> = this.toastsSubject.asObservable();

  /**
   * Signal para reactividad en templates (alternativa a async pipe)
   */
  readonly toasts = signal<Toast[]>([]);

  /**
   * Signal computado: ¿Hay toasts visibles?
   */
  readonly hasToasts = computed(() => this.toasts().length > 0);

  /**
   * Map de timeouts para auto-dismiss
   */
  private timeoutMap = new Map<string, ReturnType<typeof setTimeout>>();

  constructor() {
    // Sincronizar BehaviorSubject con Signal
    this.toasts$.subscribe(toasts => this.toasts.set(toasts));
  }

  /**
   * Muestra un toast de éxito
   */
  success(message: string, title?: string, duration?: number): void {
    this.show({ message, title, type: 'success', duration: duration ?? DEFAULT_DURATIONS.success });
  }

  /**
   * Muestra un toast de error
   */
  error(message: string, title?: string, duration?: number): void {
    this.show({ message, title, type: 'error', duration: duration ?? DEFAULT_DURATIONS.error });
  }

  /**
   * Muestra un toast de advertencia
   */
  warning(message: string, title?: string, duration?: number): void {
    this.show({ message, title, type: 'warning', duration: duration ?? DEFAULT_DURATIONS.warning });
  }

  /**
   * Muestra un toast informativo
   */
  info(message: string, title?: string, duration?: number): void {
    this.show({ message, title, type: 'info', duration: duration ?? DEFAULT_DURATIONS.info });
  }

  /**
   * Muestra un toast genérico
   */
  show(config: Omit<Toast, 'id'>): void {
    const toast: Toast = {
      ...config,
      id: this.generateId()
    };

    // Añadir al array
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next([...currentToasts, toast]);

    // Auto-dismiss después de la duración
    if (toast.duration > 0) {
      const timeout = setTimeout(() => {
        this.dismiss(toast.id);
      }, toast.duration);

      this.timeoutMap.set(toast.id, timeout);
    }

    console.log('[ToastService] Toast mostrado:', toast);
  }

  /**
   * Cierra un toast específico
   * Limpia el timeout si existe (cierre manual)
   */
  dismiss(id: string): void {
    // Limpiar timeout si existe
    const timeout = this.timeoutMap.get(id);
    if (timeout) {
      clearTimeout(timeout);
      this.timeoutMap.delete(id);
    }

    // Remover del array
    const currentToasts = this.toastsSubject.getValue();
    this.toastsSubject.next(currentToasts.filter(t => t.id !== id));

    console.log('[ToastService] Toast cerrado:', id);
  }

  /**
   * Cierra todos los toasts
   */
  dismissAll(): void {
    // Limpiar todos los timeouts
    this.timeoutMap.forEach(timeout => clearTimeout(timeout));
    this.timeoutMap.clear();

    // Vaciar array
    this.toastsSubject.next([]);
  }

  /**
   * Genera un ID único
   */
  private generateId(): string {
    return `toast-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
