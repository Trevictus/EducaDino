import { Component, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.html',
  styleUrl: './modal.scss'
})
export class Modal {
  // Control de visibilidad
  @Input() isOpen: boolean = false;

  // Título del modal (opcional)
  @Input() title: string = '';

  // Tamaño del modal: sm | md | lg
  @Input() size: 'sm' | 'md' | 'lg' = 'md';

  // Permitir cerrar al hacer clic en el overlay
  @Input() closeOnOverlay: boolean = true;

  // Permitir cerrar con la tecla ESC
  @Input() closeOnEsc: boolean = true;

  // Evento cuando se cierra el modal
  @Output() closed = new EventEmitter<void>();

  // Cierra el modal
  close(): void {
    this.closed.emit();
  }

  // Cierra al hacer clic en el overlay
  onOverlayClick(): void {
    if (this.closeOnOverlay) {
      this.close();
    }
  }

  // Previene que el clic en el contenido cierre el modal
  onContentClick(event: Event): void {
    event.stopPropagation();
  }

  // Escucha la tecla ESC
  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.isOpen && this.closeOnEsc) {
      this.close();
    }
  }

  // Genera las clases CSS dinámicamente
  get modalClasses(): string {
    return [
      'modal__content',
      `modal__content--${this.size}`
    ].join(' ');
  }
}

