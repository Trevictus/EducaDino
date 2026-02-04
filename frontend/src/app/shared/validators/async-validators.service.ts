import { Injectable } from '@angular/core';
import { AbstractControl, AsyncValidatorFn, ValidationErrors } from '@angular/forms';
import { Observable, of, timer } from 'rxjs';
import { map, switchMap, catchError } from 'rxjs/operators';

/**
 * TAREA 3: Validadores Asíncronos
 *
 * Servicio que proporciona validadores asíncronos que simulan
 * llamadas a API para verificar unicidad de datos.
 *
 * Uso: asyncValidators: [this.asyncValidators.uniqueEmailValidator()]
 */
@Injectable({
  providedIn: 'root'
})
export class AsyncValidatorsService {

  /**
   * Emails "ya registrados" (simulación de base de datos)
   */
  private readonly existingEmails = [
    'test@test.com',
    'admin@educadino.com',
    'usuario@ejemplo.com'
  ];

  /**
   * Usernames "ya registrados" (simulación de base de datos)
   */
  private readonly existingUsernames = [
    'admin',
    'usuario',
    'dinosaurio',
    'trex'
  ];

  /**
   * Validador asíncrono de email único
   *
   * Simula una llamada al servidor con delay de 800ms.
   * Devuelve error si el email ya está registrado.
   *
   * @param debounceTime - Tiempo de espera antes de validar (ms)
   * @returns AsyncValidatorFn
   */
  uniqueEmailValidator(debounceTime: number = 800): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const email = control.value?.toLowerCase().trim();

      if (!email) {
        return of(null);
      }

      // Usar timer para simular debounce y llamada al servidor
      return timer(debounceTime).pipe(
        switchMap(() => {
          // Simular llamada a API
          const emailExists = this.existingEmails.includes(email);

          if (emailExists) {
            return of({ emailTaken: { message: 'Este email ya está registrado' } });
          }

          return of(null);
        }),
        catchError(() => of(null)) // En caso de error, permitir
      );
    };
  }

  /**
   * Validador asíncrono de nombre de usuario disponible
   *
   * Simula una llamada al servidor con delay de 600ms.
   * Devuelve error si el username ya está en uso.
   *
   * @param debounceTime - Tiempo de espera antes de validar (ms)
   * @returns AsyncValidatorFn
   */
  usernameAvailableValidator(debounceTime: number = 600): AsyncValidatorFn {
    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const username = control.value?.toLowerCase().trim();

      if (!username) {
        return of(null);
      }

      // Usar timer para simular debounce y llamada al servidor
      return timer(debounceTime).pipe(
        switchMap(() => {
          // Simular llamada a API
          const usernameExists = this.existingUsernames.includes(username);

          if (usernameExists) {
            return of({ usernameTaken: { message: 'Este nombre de usuario no está disponible' } });
          }

          return of(null);
        }),
        catchError(() => of(null))
      );
    };
  }

  /**
   * Validador asíncrono de NIF único
   *
   * Simula verificación de que el NIF no está ya registrado.
   *
   * @param debounceTime - Tiempo de espera antes de validar (ms)
   * @returns AsyncValidatorFn
   */
  uniqueNifValidator(debounceTime: number = 500): AsyncValidatorFn {
    const existingNifs = ['12345678Z', '87654321X'];

    return (control: AbstractControl): Observable<ValidationErrors | null> => {
      const nif = control.value?.toUpperCase().trim();

      if (!nif) {
        return of(null);
      }

      return timer(debounceTime).pipe(
        switchMap(() => {
          const nifExists = existingNifs.includes(nif);

          if (nifExists) {
            return of({ nifTaken: { message: 'Este NIF ya está registrado en el sistema' } });
          }

          return of(null);
        }),
        catchError(() => of(null))
      );
    };
  }
}

