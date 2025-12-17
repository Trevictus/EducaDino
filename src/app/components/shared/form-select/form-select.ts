import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

// Interfaz para las opciones del select
export interface SelectOption {
  value: string;
  label: string;
  disabled?: boolean;
}

@Component({
  selector: 'app-form-select',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './form-select.html',
  styleUrl: './form-select.scss',
})
export class FormSelect implements OnInit {
  // Identificador para enlazar el label con el select
  @Input() selectId: string = '';

  // Texto de la etiqueta
  @Input() label: string = '';

  // Configuración del select
  @Input() name: string = '';
  @Input() placeholder: string = 'Selecciona una opción';
  @Input() options: SelectOption[] = [];

  // Estados y Ayudas
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() helperText: string = '';
  @Input() errorText: string = '';

  // ID para aria-describedby (accesibilidad)
  helperTextId: string = '';
  errorTextId: string = '';

  ngOnInit() {
    // Generar ID aleatorio si no se proporciona
    if (!this.selectId) {
      this.selectId = `select-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.helperTextId = `${this.selectId}-helper`;
    this.errorTextId = `${this.selectId}-error`;
  }

  // Genera el valor de aria-describedby dinámicamente
  get ariaDescribedBy(): string | null {
    if (this.errorText) return this.errorTextId;
    if (this.helperText) return this.helperTextId;
    return null;
  }
}
