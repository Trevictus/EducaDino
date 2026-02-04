import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-form-input',
  standalone: true,
  imports: [],
  templateUrl: './form-input.html',
  styleUrl: './form-input.scss'
})
export class FormInput implements OnInit {

  //Identificador para enlazar el label con el input
  @Input() inputId: string = '';

  //Texto de la etiqueta
  @Input() label: string = '';

  //Configuración del input
  @Input() type: string = 'text';
  @Input() placeholder: string = '';
  @Input() name: string = '';

  //Estados y Ayudas
  @Input() required: boolean = false;
  @Input() disabled: boolean = false;
  @Input() helperText: string = ''; // Texto de ayuda
  @Input() errorText: string = '';  // Mensaje de error

  // ID para aria-describedby (accesibilidad)
  helperTextId: string = '';
  errorTextId: string = '';

  //Se genera un id aleatorio para el input
  ngOnInit() {
    if (!this.inputId) {
      this.inputId = `input-${Math.random().toString(36).substr(2, 9)}`;
    }
    this.helperTextId = `${this.inputId}-helper`;
    this.errorTextId = `${this.inputId}-error`;
  }

  // Genera el valor de aria-describedby dinámicamente
  get ariaDescribedBy(): string | null {
    if (this.errorText) return this.errorTextId;
    if (this.helperText) return this.helperTextId;
    return null;
  }
}
