import { Injectable, Inject, PLATFORM_ID, signal, effect } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

export type Theme = 'light' | 'dark';

@Injectable({
  providedIn: 'root'
})
export class ThemeService {
  // Signal reactivo para el tema actual
  private readonly themeSignal = signal<Theme>('light');

  // Key para localStorage
  private readonly STORAGE_KEY = 'educadino-theme';

  // Flag para verificar si estamos en el navegador
  private readonly isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);

    if (this.isBrowser) {
      // Inicializar tema al cargar
      this.initializeTheme();

      // Efecto para aplicar cambios cuando el signal cambia
      effect(() => {
        this.applyTheme(this.themeSignal());
      });
    }
  }

  /**
   * Obtiene el tema actual como signal (reactivo)
   */
  get theme() {
    return this.themeSignal.asReadonly();
  }

  /**
   * Obtiene el tema actual como valor
   */
  get currentTheme(): Theme {
    return this.themeSignal();
  }

  /**
   * Alterna entre modo claro y oscuro
   */
  toggleTheme(): void {
    const newTheme: Theme = this.themeSignal() === 'light' ? 'dark' : 'light';
    this.setTheme(newTheme);
  }

  /**
   * Establece un tema específico
   */
  setTheme(theme: Theme): void {
    this.themeSignal.set(theme);
    if (this.isBrowser) {
      localStorage.setItem(this.STORAGE_KEY, theme);
    }
  }

  /**
   * Inicializa el tema basándose en:
   * 1. Valor guardado en localStorage
   * 2. Preferencia del sistema operativo
   */
  private initializeTheme(): void {
    // 1. Intentar leer de localStorage
    const savedTheme = localStorage.getItem(this.STORAGE_KEY) as Theme | null;

    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      this.themeSignal.set(savedTheme);
      return;
    }

    // 2. Detectar preferencia del sistema
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.themeSignal.set(prefersDark ? 'dark' : 'light');

    // 3. Escuchar cambios en la preferencia del sistema
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
      // Solo actualizar si no hay preferencia guardada
      if (!localStorage.getItem(this.STORAGE_KEY)) {
        this.themeSignal.set(e.matches ? 'dark' : 'light');
      }
    });
  }

  /**
   * Aplica el tema al documento HTML
   * Usa clases en el <html> para permitir cascada CSS
   */
  private applyTheme(theme: Theme): void {
    const htmlElement = document.documentElement;

    // Remover clases de tema anteriores
    htmlElement.classList.remove('theme-light', 'theme-dark');

    // Añadir nueva clase de tema
    htmlElement.classList.add(`theme-${theme}`);

    // También actualizar el atributo data-theme para selectores CSS
    htmlElement.setAttribute('data-theme', theme);
  }
}
