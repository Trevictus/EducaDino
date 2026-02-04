import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

// Importar todos los componentes para mostrar en el Style Guide
import { Button } from '../../components/shared/button/button';
import { Card } from '../../components/card/card';
import { FormInput } from '../../components/shared/form-input/form-input';
import { FormTextarea } from '../../components/shared/form-textarea/form-textarea';
import { FormSelect, SelectOption } from '../../components/shared/form-select/form-select';
import { Alert } from '../../components/shared/alert/alert';
import { Modal } from '../../components/modal/modal';

// Nuevos componentes de Fase 1
import { Tabs, Tab } from '../../components/shared/tabs/tabs';
import { Tooltip } from '../../components/shared/tooltip/tooltip';
import { DomDemo } from '../../components/shared/dom-demo/dom-demo';
import { ThemeToggle } from '../../components/shared/theme-toggle/theme-toggle';

// Componentes de Fase 3 (Formularios)
import { ContactForm } from '../../components/shared/contact-form/contact-form';
import { RegisterForm } from '../../components/shared/register-form/register-form';
import { OrderForm } from '../../components/shared/order-form/order-form';

// Servicios de Fase 2
import { ToastService } from '../../shared/services/toast';
import { LoadingService } from '../../shared/services/loading';

@Component({
  selector: 'app-style-guide',
  standalone: true,
  imports: [
    CommonModule,
    Button,
    Card,
    FormInput,
    FormTextarea,
    FormSelect,
    Alert,
    Modal,
    Tabs,
    Tooltip,
    DomDemo,
    ThemeToggle,
    ContactForm,
    RegisterForm,
    OrderForm
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide {
  // Servicios de Fase 2
  private readonly toastService = inject(ToastService);
  private readonly loadingService = inject(LoadingService);

  // Signal para estado de loading local (botón)
  isSaving = signal(false);

  // Control de pestañas de formularios
  activeFormTab = 'contact';

  // Opciones de ejemplo para el select
  selectOptions: SelectOption[] = [
    { value: 'trex', label: 'Tyrannosaurus Rex' },
    { value: 'velociraptor', label: 'Velociraptor' },
    { value: 'triceratops', label: 'Triceratops' },
    { value: 'brachiosaurus', label: 'Brachiosaurus', disabled: true }
  ];

  // Pestañas de ejemplo
  demoTabs: Tab[] = [
    { id: 'info', label: 'Información', icon: 'info' },
    { id: 'gallery', label: 'Galería', icon: 'image' },
    { id: 'settings', label: 'Configuración', icon: 'settings' },
    { id: 'disabled', label: 'Deshabilitada', icon: 'block', disabled: true }
  ];

  // Pestaña activa
  activeTabId: string = 'info';

  // Estado del modal de demostración
  isModalOpen: boolean = false;

  openModal(): void {
    this.isModalOpen = true;
  }

  closeModal(): void {
    this.isModalOpen = false;
  }

  // Handler para demostrar eventos de botón
  onButtonClick(message: string): void {
    console.log('Botón clickeado:', message);
  }

  // Handler para cambio de pestañas
  onTabChange(tabId: string): void {
    this.activeTabId = tabId;
    console.log('Pestaña activa:', tabId);
  }

  // ============ MÉTODOS DE FASE 2 ============

  /**
   * Muestra un toast de éxito
   */
  showSuccessToast(): void {
    this.toastService.success('¡Operación completada con éxito!', '¡Éxito!');
  }

  /**
   * Muestra un toast de error
   */
  showErrorToast(): void {
    this.toastService.error('Ha ocurrido un error inesperado.', 'Error');
  }

  /**
   * Muestra un toast de advertencia
   */
  showWarningToast(): void {
    this.toastService.warning('Tu sesión expirará pronto.', 'Advertencia');
  }

  /**
   * Muestra un toast informativo
   */
  showInfoToast(): void {
    this.toastService.info('Hay nuevas curiosidades disponibles.', 'Información');
  }

  /**
   * Simula una operación con loading global
   */
  simulateLoading(): void {
    this.loadingService.show();

    // Simular operación de 2 segundos
    setTimeout(() => {
      this.loadingService.hide();
      this.toastService.success('Operación completada');
    }, 2000);
  }

  /**
   * Simula guardar con loading local en botón
   */
  async simulateSave(): Promise<void> {
    if (this.isSaving()) return;

    this.isSaving.set(true);

    // Simular guardado de 1.5 segundos
    await new Promise(resolve => setTimeout(resolve, 1500));

    this.isSaving.set(false);
    this.toastService.success('Guardado correctamente');
  }
}
