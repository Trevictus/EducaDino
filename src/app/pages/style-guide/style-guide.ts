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
    Modal
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
}
