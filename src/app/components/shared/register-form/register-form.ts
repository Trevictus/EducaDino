import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';

// Servicios
import { ToastService } from '../../../shared/services/toast';

// Validadores
import { CustomValidators } from '../../../shared/validators/custom-validators';
import { AsyncValidatorsService } from '../../../shared/validators/async-validators.service';

/**
 * TAREA 2 y 3: RegisterForm con validadores personalizados y asíncronos
 *
 * Demuestra:
 * - Validadores síncronos personalizados (NIF, password strength)
 * - Validador Cross-Field (matchPasswords)
 * - Validadores asíncronos (uniqueEmail, usernameAvailable)
 */
@Component({
  selector: 'app-register-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register-form.html',
  styleUrl: './register-form.scss'
})
export class RegisterForm implements OnInit {
  // Inyección de dependencias
  private readonly fb = inject(FormBuilder);
  private readonly toastService = inject(ToastService);
  private readonly asyncValidators = inject(AsyncValidatorsService);

  // FormGroup del formulario de registro
  registerForm!: FormGroup;

  // Estado de envío
  isSubmitting = false;

  // Control de visibilidad de contraseñas
  showPassword = false;
  showConfirmPassword = false;

  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inicializa el formulario con FormBuilder
   */
  private initForm(): void {
    this.registerForm = this.fb.group({
      // Datos personales
      nombre: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(50)
      ],],

      username: ['', [
        Validators.required,
        CustomValidators.username()
      ], [
        // Validador asíncrono con updateOn blur
        this.asyncValidators.usernameAvailableValidator()
      ],],

      nif: ['', [
        Validators.required,
        CustomValidators.nifValidator()
      ],],

      email: ['', [
        Validators.required,
        Validators.email
      ], [
        // Validador asíncrono
        this.asyncValidators.uniqueEmailValidator()
      ],],

      // Contraseñas
      password: ['', [
        Validators.required,
        CustomValidators.passwordStrength()
      ],],

      confirmPassword: ['', [
        Validators.required
      ],],

      // Términos y condiciones
      acceptTerms: [false, [
        Validators.requiredTrue
      ],]
    }, {
      // Validador Cross-Field para contraseñas
      validators: CustomValidators.matchPasswords('password', 'confirmPassword'),
      // Opciones de actualización para campos asíncronos
      updateOn: 'change'
    });
  }

  /**
   * Envía el formulario
   */
  onSubmit(): void {
    this.registerForm.markAllAsTouched();

    if (this.registerForm.invalid) {
      this.toastService.warning('Por favor, corrige los errores del formulario');
      return;
    }

    this.isSubmitting = true;

    // Simular registro
    setTimeout(() => {
      console.log('Usuario registrado:', this.registerForm.value);
      this.toastService.success('¡Cuenta creada correctamente!', 'Bienvenido');
      this.registerForm.reset();
      this.isSubmitting = false;
    }, 1500);
  }

  /**
   * Helpers para acceder a los controles
   */
  get f() {
    return this.registerForm.controls;
  }

  /**
   * Verifica si un campo tiene error y ha sido tocado
   */
  hasError(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(field?.invalid && (field?.dirty || field?.touched));
  }

  /**
   * Verifica si un campo está en validación asíncrona
   */
  isPending(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return field?.pending ?? false;
  }

  /**
   * Obtiene el mensaje de error para un campo
   */
  getErrorMessage(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
    if (!field?.errors) return '';

    // Errores estándar
    if (field.errors['required']) return 'Este campo es obligatorio';
    if (field.errors['email']) return 'Introduce un email válido';
    if (field.errors['minlength']) {
      return `Mínimo ${field.errors['minlength'].requiredLength} caracteres`;
    }

    // Errores de NIF
    if (field.errors['nif']) {
      return field.errors['nif'].message;
    }

    // Errores de username
    if (field.errors['username']) {
      return field.errors['username'].message;
    }

    // Errores de fortaleza de contraseña
    if (field.errors['passwordStrength']) {
      const pwErrors = field.errors['passwordStrength'];
      if (pwErrors.noUppercase) return 'Debe contener al menos una mayúscula';
      if (pwErrors.noLowercase) return 'Debe contener al menos una minúscula';
      if (pwErrors.noNumber) return 'Debe contener al menos un número';
      if (pwErrors.noSymbol) return 'Debe contener al menos un símbolo (!@#$%...)';
      if (pwErrors.minLength) return 'Mínimo 8 caracteres';
    }

    // Error de contraseñas no coinciden
    if (field.errors['passwordMismatch']) {
      return 'Las contraseñas no coinciden';
    }

    // Errores asíncronos
    if (field.errors['emailTaken']) {
      return field.errors['emailTaken'].message;
    }
    if (field.errors['usernameTaken']) {
      return field.errors['usernameTaken'].message;
    }

    // Términos
    if (fieldName === 'acceptTerms') {
      return 'Debes aceptar los términos y condiciones';
    }

    return 'Campo inválido';
  }

  /**
   * Obtiene los requisitos de contraseña con su estado
   */
  getPasswordRequirements(): { label: string; valid: boolean }[] {
    const password = this.registerForm.get('password')?.value || '';

    return [
      { label: 'Al menos 8 caracteres', valid: password.length >= 8 },
      { label: 'Una letra mayúscula', valid: /[A-Z]/.test(password) },
      { label: 'Una letra minúscula', valid: /[a-z]/.test(password) },
      { label: 'Un número', valid: /[0-9]/.test(password) },
      { label: 'Un símbolo (!@#$%...)', valid: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password) }
    ];
  }

  /**
   * Toggle visibilidad de contraseña
   */
  togglePasswordVisibility(field: 'password' | 'confirm'): void {
    if (field === 'password') {
      this.showPassword = !this.showPassword;
    } else {
      this.showConfirmPassword = !this.showConfirmPassword;
    }
  }
}
