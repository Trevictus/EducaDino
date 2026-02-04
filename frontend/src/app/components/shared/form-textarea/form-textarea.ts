import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-textarea',
  standalone: true,
  imports: [],
  templateUrl: './form-textarea.html',
  styleUrl: './form-textarea.scss'
})
export class FormTextarea implements OnInit {
  // Identificador para enlazar el label con el textarea
  @Input() textareaId: string = '';

  // Texto de la etiqueta
  @Input() label: string = '';

  // Configuración del textarea
  @Input() placeholder: string = '';
  @Input() name: string = '';
  @Input() rows: number = 4;

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
    if (!this.textareaId) {
      this.textareaId = `textarea-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.helperTextId = `${this.textareaId}-helper`;
    this.errorTextId = `${this.textareaId}-error`;
  }

  // Genera el valor de aria-describedby dinámicamente
  get ariaDescribedBy(): string | null {
    if (this.errorText) return this.errorTextId;
    if (this.helperText) return this.helperTextId;
    return null;
  }
}
