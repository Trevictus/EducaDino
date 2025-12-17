import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './button.html',
  styleUrl: './button.scss',
})
export class Button {
  // Variante del botón: primary | secondary | ghost | danger
  @Input() variant: 'primary' | 'secondary' | 'ghost' | 'danger' = 'primary';

  // Tamaño del botón: sm | md | lg
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Tipo de botón HTML
  @Input() type: 'button' | 'submit' | 'reset' = 'button';

  // Estado disabled
  @Input() disabled: boolean = false;

  // Icono de Material Icons (opcional)
  @Input() icon: string = '';

  // Posición del icono: left | right
  @Input() iconPosition: 'left' | 'right' = 'left';

  // Aria-label para accesibilidad (obligatorio si solo icono)
  @Input() ariaLabel: string = '';

  // Evento de clic
  @Output() clicked = new EventEmitter<void>();

  onClick(): void {
    if (!this.disabled) {
      this.clicked.emit();
    }
  }

  // Genera las clases CSS dinámicamente
  get buttonClasses(): string {
    return [
      'button',
      `button--${this.variant}`,
      `button--${this.size}`,
      this.disabled ? 'button--disabled' : '',
      this.icon && !this.ariaLabel ? 'button--icon-only' : ''
    ].filter(Boolean).join(' ');
  }
}
