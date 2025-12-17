import { Component } from '@angular/core';
// Importamos tu componente reutilizable
import { FormInput } from '../form-input/form-input';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [FormInput],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactForm {

  // Función simulada del envio del formulario
  onSubmit(event: Event) {
    event.preventDefault(); // Evita que la página se recargue
    console.log('Formulario enviado');
    // Aquí va la lógica para enviar al servidor
  }
}
