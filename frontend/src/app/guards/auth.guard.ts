import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

/**
 * AuthGuard - Guard funcional para proteger rutas que requieren autenticación.
 *
 * Simula un estado de login. Si el usuario no está autenticado,
 * redirige a '/login' pasando la URL de retorno en queryParams.
 */
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);

  // Simulación de estado de autenticación (cambiar a true para simular usuario logueado)
  const isLoggedIn = false;

  if (isLoggedIn) {
    return true;
  }

  // Redirigir a login con la URL de retorno
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
