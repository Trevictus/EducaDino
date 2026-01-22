import { Component, Input, HostListener, ElementRef, Renderer2, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';

export type TooltipPosition = 'top' | 'bottom' | 'left' | 'right';

@Component({
  selector: 'app-tooltip',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tooltip.html',
  styleUrl: './tooltip.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class Tooltip {
  /**
   * Texto del tooltip
   */
  @Input() text: string = '';

  /**
   * Posición del tooltip
   */
  @Input() position: TooltipPosition = 'top';

  /**
   * Delay antes de mostrar (ms)
   */
  @Input() delay: number = 200;

  /**
   * Estado de visibilidad
   */
  isVisible: boolean = false;

  /**
   * Timer para el delay
   */
  private showTimeout: ReturnType<typeof setTimeout> | null = null;

  /**
   * Referencia al elemento contenedor
   */
  @ViewChild('tooltipContainer') tooltipContainer!: ElementRef;

  constructor(
    private elementRef: ElementRef,
    private renderer: Renderer2  // TAREA 1: Uso de Renderer2
  ) {}

  /**
   * TAREA 2: Evento (mouseenter) para mostrar tooltip
   */
  @HostListener('mouseenter')
  onMouseEnter(): void {
    this.showTimeout = setTimeout(() => {
      this.isVisible = true;
    }, this.delay);
  }

  /**
   * TAREA 2: Evento (mouseleave) para ocultar tooltip
   */
  @HostListener('mouseleave')
  onMouseLeave(): void {
    if (this.showTimeout) {
      clearTimeout(this.showTimeout);
      this.showTimeout = null;
    }
    this.isVisible = false;
  }

  /**
   * TAREA 2: Evento (focus) para accesibilidad con teclado
   */
  @HostListener('focusin')
  onFocus(): void {
    this.isVisible = true;
  }

  /**
   * TAREA 2: Evento (blur) para ocultar al perder foco
   */
  @HostListener('focusout')
  onBlur(): void {
    this.isVisible = false;
  }

  /**
   * Genera clases CSS dinámicamente
   */
  get tooltipClasses(): string {
    return [
      'tooltip__content',
      `tooltip__content--${this.position}`,
      this.isVisible ? 'tooltip__content--visible' : ''
    ].filter(Boolean).join(' ');
  }
}
