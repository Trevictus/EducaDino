import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding } from '@angular/router';

import { routes } from './app.routes';

/**
 * Configuración principal de la aplicación Angular.
 *
 * - withPreloading(PreloadAllModules): Precarga todos los módulos lazy en segundo plano
 * - withComponentInputBinding: Permite pasar parámetros de ruta directamente como @Input()
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideRouter(
      routes,
      withPreloading(PreloadAllModules), // Estrategia de precarga: carga todos los módulos lazy después del inicial
      withComponentInputBinding()         // Habilita binding de parámetros de ruta a inputs del componente
    )
  ]
};
