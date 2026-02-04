import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * Interfaz para definir una pestaña
 */
export interface Tab {
  id: string;
  label: string;
  icon?: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-tabs',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tabs.html',
  styleUrl: './tabs.scss'
})
export class Tabs {
  /**
   * Lista de pestañas a mostrar
   */
  @Input() tabs: Tab[] = [];

  /**
   * ID de la pestaña activa por defecto
   */
  @Input() activeTabId: string = '';

  /**
   * Evento cuando cambia la pestaña activa
   */
  @Output() tabChange = new EventEmitter<string>();

  /**
   * Pestaña activa actual
   */
  private _activeTab: string = '';

  ngOnInit(): void {
    // Si no se especificó pestaña activa, usar la primera
    if (!this.activeTabId && this.tabs.length > 0) {
      this._activeTab = this.tabs[0].id;
    } else {
      this._activeTab = this.activeTabId;
    }
  }

  /**
   * Obtiene la pestaña activa actual
   */
  get activeTab(): string {
    return this._activeTab;
  }

  /**
   * Cambia la pestaña activa
   * TAREA 2: Ejemplo de (click) event binding
   */
  selectTab(tabId: string, event?: Event): void {
    // TAREA 2: preventDefault para evitar comportamiento por defecto
    if (event) {
      event.preventDefault();
    }

    // No cambiar si la pestaña está deshabilitada
    const tab = this.tabs.find(t => t.id === tabId);
    if (tab?.disabled) {
      return;
    }

    this._activeTab = tabId;
    this.tabChange.emit(tabId);
  }

  /**
   * TAREA 2: Manejo de eventos de teclado
   * Permite navegar con flechas izquierda/derecha
   */
  onKeyDown(event: KeyboardEvent, currentIndex: number): void {
    let newIndex = currentIndex;

    switch (event.key) {
      case 'ArrowLeft':
        event.preventDefault();
        newIndex = currentIndex > 0 ? currentIndex - 1 : this.tabs.length - 1;
        break;
      case 'ArrowRight':
        event.preventDefault();
        newIndex = currentIndex < this.tabs.length - 1 ? currentIndex + 1 : 0;
        break;
      case 'Home':
        event.preventDefault();
        newIndex = 0;
        break;
      case 'End':
        event.preventDefault();
        newIndex = this.tabs.length - 1;
        break;
      default:
        return;
    }

    // Encontrar la siguiente pestaña no deshabilitada
    while (this.tabs[newIndex]?.disabled && newIndex !== currentIndex) {
      if (event.key === 'ArrowLeft' || event.key === 'Home') {
        newIndex = newIndex > 0 ? newIndex - 1 : this.tabs.length - 1;
      } else {
        newIndex = newIndex < this.tabs.length - 1 ? newIndex + 1 : 0;
      }
    }

    if (!this.tabs[newIndex]?.disabled) {
      this.selectTab(this.tabs[newIndex].id);
    }
  }

  /**
   * Verifica si una pestaña está activa
   */
  isActive(tabId: string): boolean {
    return this._activeTab === tabId;
  }
}
