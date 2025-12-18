import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Servicios
import { ToastService } from '../../../shared/services/toast';

@Component({
  selector: 'app-contact-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './contact-form.html',
  styleUrl: './contact-form.scss'
})
export class ContactForm implements OnInit {
  // Inyección de dependencias
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);

  // FormGroup del formulario de contacto
  contactForm!: FormGroup;

  // Estado de envío
  isSubmitting = false;

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario con FormBuilder
   */
  private initForm(): void {
    this.contactForm = this.fb.group({
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ]],
      email: ['', [
        Validators.required,
        Validators.email
      ]],
      asunto: ['', [
        Validators.maxLength(100)
      ]],
      mensaje: ['', [
        Validators.required,
        Validators.minLength(10),
        Validators.maxLength(500)
      ]]
    });
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    // Marcar todos los campos como touched para mostrar errores
    this.contactForm.markAllAsTouched();

    if (this.contactForm.invalid) {
      this.toastService.warning('Por favor, corrige los errores del formulario');
      return;
    }

    this.isSubmitting = true;

    // Simular envío al servidor
    setTimeout(() => {
      console.log('Formulario enviado:', this.contactForm.value);
      this.toastService.success('¡Mensaje enviado correctamente!', 'Éxito');
      this.contactForm.reset();
      this.isSubmitting = false;
    }, 1000);
  }

  /**
   * Helpers para acceder a los controles del formulario
   */
  get f() {
    return this.contactForm.controls;
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.contactForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.contactForm.get(fieldName);

    if (!field?.errors) return '';

    if (field.errors['required']) {
      return 'Este campo es obligatorio';
    }
    if (field.errors['email']) {
      return 'Introduce un email válido';
    }
    if (field.errors['minlength']) {
      const minLength = field.errors['minlength'].requiredLength;
      return `Mínimo ${minLength} caracteres`;
    }
    if (field.errors['maxlength']) {
      const maxLength = field.errors['maxlength'].requiredLength;
      return `Máximo ${maxLength} caracteres`;
    }

    return 'Campo inválido';
  }
}
