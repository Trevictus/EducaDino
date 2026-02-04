import {
  Component,
  ViewChild,
  ElementRef,
  Renderer2,
  AfterViewInit,
  OnDestroy
} from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * TAREA 1: MANIPULACIÓN SEGURA DEL DOM
 *
 * Este componente demuestra:
 * 1. Acceso al DOM usando @ViewChild y ElementRef
 * 2. Uso de Renderer2 para manipulación segura del DOM
 * 3. Implementación de ngAfterViewInit
 *
 * IMPORTANTE: Nunca modificar el DOM directamente con nativeElement
 * Siempre usar Renderer2 para:
 * - Compatibilidad con Server-Side Rendering (SSR)
 * - Seguridad (prevención de XSS)
 * - Abstracción del DOM
 */
@Component({
  selector: 'app-dom-demo',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dom-demo.html',
  styleUrl: './dom-demo.scss'
})
export class DomDemo implements AfterViewInit, OnDestroy {
  /**
   * TAREA 1: Acceso al DOM con @ViewChild y ElementRef
   */
  @ViewChild('demoContainer') demoContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('dynamicContent') dynamicContent!: ElementRef<HTMLDivElement>;
  @ViewChild('styleTarget') styleTarget!: ElementRef<HTMLDivElement>;

  /**
   * Elementos creados dinámicamente para cleanup
   */
  private createdElements: HTMLElement[] = [];

  /**
   * Inyección de Renderer2 para manipulación segura del DOM
   */
  constructor(private renderer: Renderer2) {}

  /**
   * TAREA 1: ngAfterViewInit - El DOM está disponible aquí
   */
  ngAfterViewInit(): void {
    // Ejemplo: Añadir clase inicial usando Renderer2
    this.renderer.addClass(this.demoContainer.nativeElement, 'dom-demo--initialized');

    // Ejemplo: Establecer atributo usando Renderer2
    this.renderer.setAttribute(this.demoContainer.nativeElement, 'data-demo', 'active');
  }

  /**
   * Cleanup al destruir el componente
   */
  ngOnDestroy(): void {
    // Limpiar elementos creados dinámicamente
    this.createdElements.forEach(el => {
      if (el.parentNode) {
        this.renderer.removeChild(el.parentNode, el);
      }
    });
  }

  /**
   * TAREA 1: Usar Renderer2.setStyle para cambiar estilos
   */
  changeBackgroundColor(color: string): void {
    this.renderer.setStyle(
      this.styleTarget.nativeElement,
      'backgroundColor',
      color
    );
    this.renderer.setStyle(
      this.styleTarget.nativeElement,
      'transition',
      'background-color 0.3s ease'
    );
  }

  /**
   * TAREA 1: Usar Renderer2.setProperty para cambiar propiedades
   */
  updateText(text: string): void {
    this.renderer.setProperty(
      this.styleTarget.nativeElement,
      'textContent',
      text
    );
  }

  /**
   * TAREA 1: Usar Renderer2.createElement y appendChild
   */
  addDynamicElement(): void {
    // Crear elemento usando Renderer2
    const newElement = this.renderer.createElement('div');

    // Añadir clases
    this.renderer.addClass(newElement, 'dom-demo__dynamic-item');

    // Establecer contenido
    this.renderer.setProperty(
      newElement,
      'textContent',
      `Elemento #${this.createdElements.length + 1} - Creado dinámicamente`
    );

    // Añadir estilos
    this.renderer.setStyle(newElement, 'padding', '8px 16px');
    this.renderer.setStyle(newElement, 'margin', '8px 0');
    this.renderer.setStyle(newElement, 'backgroundColor', 'var(--secondary-color-disabled)');
    this.renderer.setStyle(newElement, 'borderRadius', '8px');
    this.renderer.setStyle(newElement, 'animation', 'fadeIn 0.3s ease');

    // Añadir al contenedor usando appendChild
    this.renderer.appendChild(this.dynamicContent.nativeElement, newElement);

    // Guardar referencia para cleanup
    this.createdElements.push(newElement);
  }

  /**
   * TAREA 1: Usar Renderer2.removeChild
   */
  removeLastElement(): void {
    if (this.createdElements.length > 0) {
      const lastElement = this.createdElements.pop();
      if (lastElement) {
        this.renderer.removeChild(this.dynamicContent.nativeElement, lastElement);
      }
    }
  }

  /**
   * TAREA 1: Usar Renderer2 para toggle de clases
   */
  toggleHighlight(): void {
    const element = this.styleTarget.nativeElement;
    if (element.classList.contains('dom-demo__box--highlight')) {
      this.renderer.removeClass(element, 'dom-demo__box--highlight');
    } else {
      this.renderer.addClass(element, 'dom-demo__box--highlight');
    }
  }

  /**
   * TAREA 2: Ejemplo de manejo de eventos con $event
   */
  onInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.updateText(input.value || 'Escribe algo...');
  }

  /**
   * TAREA 2: Ejemplo de preventDefault
   */
  onFormSubmit(event: Event): void {
    event.preventDefault();
    console.log('Formulario enviado - preventDefault() ejecutado');
  }

  /**
   * TAREA 2: Ejemplo de stopPropagation
   */
  onInnerClick(event: Event): void {
    event.stopPropagation();
    console.log('Click en elemento interno - stopPropagation() ejecutado');
  }

  onOuterClick(): void {
    console.log('Click en elemento externo');
  }
}
