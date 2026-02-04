import { CanDeactivateFn } from '@angular/router';

/**
 * Interfaz que deben implementar los componentes con formularios
 * que necesitan protección contra pérdida de datos.
 */
export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

/**
 * PendingChangesGuard - Guard para prevenir la pérdida de cambios en formularios.
 *
 * Detecta si un formulario tiene cambios sin guardar (dirty) y
 * muestra un diálogo de confirmación antes de permitir la navegación.
 */
export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (
  component,
  currentRoute,
  currentState,
  nextState
) => {
  // Si el componente implementa canDeactivate, lo usamos
  if (component.canDeactivate && !component.canDeactivate()) {
    return confirm(
      '¿Estás seguro de que deseas salir?\n\nTienes cambios sin guardar que se perderán.'
    );
  }

  return true;
};

