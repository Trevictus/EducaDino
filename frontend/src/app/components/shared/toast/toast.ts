import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastService, Toast, ToastType } from '../../../shared/services/toast';

/**
 * TAREA 3: Componente Toast
 *
 * Muestra notificaciones globales de la aplicación.
 * Se integra en app.component.html para funcionar globalmente.
 */
@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './toast.html',
  styleUrl: './toast.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ToastComponent {
  /**
   * Inyección del servicio de toasts
   */
  private readonly toastService = inject(ToastService);

  /**
   * Signal de toasts para reactividad en template
   */
  readonly toasts = this.toastService.toasts;

  /**
   * Cierra un toast específico
   */
  dismiss(id: string): void {
    this.toastService.dismiss(id);
  }

  /**
   * Obtiene el icono según el tipo de toast
   */
  getIcon(type: ToastType): string {
    const icons: Record<ToastType, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };
    return icons[type];
  }

  /**
   * TrackBy para optimizar el rendering
   */
  trackByToastId(index: number, toast: Toast): string {
    return toast.id;
  }
}
