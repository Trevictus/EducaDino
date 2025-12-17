import { Component } from '@angular/core';
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
    ThemeToggle
  ],
  templateUrl: './style-guide.html',
  styleUrl: './style-guide.scss',
})
export class StyleGuide {
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
}
