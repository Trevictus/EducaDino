import { AbstractControl, ValidationErrors, ValidatorFn, FormGroup } from '@angular/forms';

/**
 * TAREA 2: Validadores Personalizados (Custom Validators)
 *
 * Colección de validadores síncronos reutilizables.
 * Uso: Validators.compose([Validators.required, CustomValidators.passwordStrength()])
 */
export class CustomValidators {

  /**
   * Validador de fortaleza de contraseña
   * Requiere: Mayúsculas, Minúsculas, Números y Símbolos
   *
   * @returns ValidatorFn
   */
  static passwordStrength(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null; // No validar si está vacío (usa required para eso)
      }

      const errors: ValidationErrors = {};

      // Verificar mayúsculas
      if (!/[A-Z]/.test(value)) {
        errors['noUppercase'] = true;
      }

      // Verificar minúsculas
      if (!/[a-z]/.test(value)) {
        errors['noLowercase'] = true;
      }

      // Verificar números
      if (!/[0-9]/.test(value)) {
        errors['noNumber'] = true;
      }

      // Verificar símbolos especiales
      if (!/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(value)) {
        errors['noSymbol'] = true;
      }

      // Verificar longitud mínima (8 caracteres)
      if (value.length < 8) {
        errors['minLength'] = { requiredLength: 8, actualLength: value.length };
      }

      return Object.keys(errors).length > 0 ? { passwordStrength: errors } : null;
    };
  }

  /**
   * Validador de NIF/DNI español
   * Valida formato (8 dígitos + letra) y letra correcta
   *
   * @returns ValidatorFn
   */
  static nifValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.toUpperCase().trim();

      if (!value) {
        return null; // No validar si está vacío
      }

      // Formato: 8 dígitos + 1 letra
      const nifRegex = /^[0-9]{8}[A-Z]$/;

      if (!nifRegex.test(value)) {
        return { nif: { message: 'Formato inválido. Debe ser 8 dígitos + 1 letra' } };
      }

      // Validar letra del NIF
      const letras = 'TRWAGMYFPDXBNJZSQVHLCKE';
      const numero = parseInt(value.substring(0, 8), 10);
      const letraEsperada = letras[numero % 23];
      const letraIntroducida = value.charAt(8);

      if (letraEsperada !== letraIntroducida) {
        return { nif: { message: `Letra incorrecta. Debería ser "${letraEsperada}"` } };
      }

      return null;
    };
  }

  /**
   * Validador Cross-Field para confirmar contraseñas
   * Se aplica al FormGroup, no a un control individual
   *
   * @param controlName - Nombre del control de contraseña
   * @param matchingControlName - Nombre del control de confirmación
   * @returns ValidatorFn
   */
  static matchPasswords(controlName: string, matchingControlName: string): ValidatorFn {
    return (formGroup: AbstractControl): ValidationErrors | null => {
      const control = formGroup.get(controlName);
      const matchingControl = formGroup.get(matchingControlName);

      if (!control || !matchingControl) {
        return null;
      }

      // Si ya tiene otro error, no sobrescribir
      if (matchingControl.errors && !matchingControl.errors['passwordMismatch']) {
        return null;
      }

      // Comparar valores
      if (control.value !== matchingControl.value) {
        matchingControl.setErrors({ passwordMismatch: true });
        return { passwordMismatch: true };
      } else {
        // Limpiar error si coinciden
        if (matchingControl.errors?.['passwordMismatch']) {
          delete matchingControl.errors['passwordMismatch'];
          if (Object.keys(matchingControl.errors).length === 0) {
            matchingControl.setErrors(null);
          }
        }
        return null;
      }
    };
  }

  /**
   * Validador de longitud mínima para texto (sin contar espacios en blanco)
   *
   * @param minLength - Longitud mínima requerida
   * @returns ValidatorFn
   */
  static minLengthTrimmed(minLength: number): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.trim();

      if (!value) {
        return null;
      }

      if (value.length < minLength) {
        return {
          minLengthTrimmed: {
            requiredLength: minLength,
            actualLength: value.length
          }
        };
      }

      return null;
    };
  }

  /**
   * Validador de teléfono español (9 dígitos, empieza por 6, 7 o 9)
   *
   * @returns ValidatorFn
   */
  static spanishPhone(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value?.replace(/\s/g, '');

      if (!value) {
        return null;
      }

      const phoneRegex = /^[679][0-9]{8}$/;

      if (!phoneRegex.test(value)) {
        return { spanishPhone: { message: 'Debe ser un teléfono español válido (9 dígitos)' } };
      }

      return null;
    };
  }

  /**
   * Validador de nombre de usuario (solo letras, números y guiones bajos)
   *
   * @returns ValidatorFn
   */
  static username(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      // Solo letras, números, guiones bajos. Min 3, max 20 caracteres
      const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;

      if (!usernameRegex.test(value)) {
        return {
          username: {
            message: 'Solo letras, números y guiones bajos. Entre 3 y 20 caracteres.'
          }
        };
      }

      return null;
    };
  }
}

