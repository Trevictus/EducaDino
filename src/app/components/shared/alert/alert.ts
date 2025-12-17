import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-alert',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './alert.html',
  styleUrl: './alert.scss'
})
export class Alert {
  // Tipo de alerta: success | error | warning | info
  @Input() type: 'success' | 'error' | 'warning' | 'info' = 'info';

  // Título de la alerta (opcional)
  @Input() title: string = '';

  // Mostrar botón de cerrar
  @Input() dismissible: boolean = false;

  // Icono personalizado (opcional, si no se proporciona se usa uno por defecto según el tipo)
  @Input() icon: string = '';

  // Evento cuando se cierra la alerta
  @Output() closed = new EventEmitter<void>();

  // Control de visibilidad
  isVisible: boolean = true;

  // Cierra la alerta
  close(): void {
    this.isVisible = false;
    this.closed.emit();
  }

  // Obtiene el icono según el tipo de alerta
  get alertIcon(): string {
    if (this.icon) return this.icon;

    const icons: Record<string, string> = {
      success: 'check_circle',
      error: 'error',
      warning: 'warning',
      info: 'info'
    };

    return icons[this.type] || 'info';
  }

  // Genera las clases CSS dinámicamente
  get alertClasses(): string {
    return [
      'alert',
      `alert--${this.type}`
    ].join(' ');
  }
}
