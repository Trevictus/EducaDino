import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideRouter, withPreloading, PreloadAllModules, withComponentInputBinding, withRouterConfig, withHashLocation } from '@angular/router';
import { provideHttpClient, withInterceptors, withFetch } from '@angular/common/http';

import { routes } from './app.routes';
import { authInterceptor, errorInterceptor, loggingInterceptor } from './core/interceptors';

/**
 * Configuración principal de la aplicación Angular.
 *
 * FASE 5 - HTTP Client:
 * - provideHttpClient: Configura el cliente HTTP con interceptores funcionales
 * - withInterceptors: Cadena de interceptores (auth → logging → error)
 * - withFetch: Usa la API Fetch nativa para mejor rendimiento
 *
 * FASE 4 - Router:
 * - withPreloading(PreloadAllModules): Precarga todos los módulos lazy en segundo plano (Requisito 4.3)
 * - withComponentInputBinding: Permite pasar parámetros de ruta directamente como @Input()
 * - withRouterConfig: Configuración adicional del router
 * - withHashLocation: Usa hash (#) en URLs para compatibilidad con GitHub Pages
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),

    // === CONFIGURACIÓN DEL ROUTER (FASE 4) ===
    provideRouter(
      routes,
      withPreloading(PreloadAllModules),   // Estrategia de precarga: carga todos los módulos lazy después del inicial
      withComponentInputBinding(),          // Habilita binding de parámetros de ruta a inputs del componente
      withHashLocation(),                   // Usa URLs con hash (#) para GitHub Pages
      withRouterConfig({
        onSameUrlNavigation: 'reload',      // Permite recargar la misma ruta
        paramsInheritanceStrategy: 'always' // Hereda parámetros de rutas padre
      })
    ),

    // === CONFIGURACIÓN DE HTTP CLIENT (FASE 5) ===
    provideHttpClient(
      withFetch(),                          // Usa Fetch API nativa
      withInterceptors([
        authInterceptor,                    // 1. Añade headers de autenticación
        loggingInterceptor,                 // 2. Logging de peticiones (solo dev)
        errorInterceptor                    // 3. Manejo global de errores
      ])
    )
  ]
};
