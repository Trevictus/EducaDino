import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ThemeService } from '../../../services/theme';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './theme-toggle.html',
  styleUrl: './theme-toggle.scss'
})
export class ThemeToggle {
  // Inyección del servicio de tema
  private readonly themeService = inject(ThemeService);

  // Exponer el signal del tema para el template
  readonly theme = this.themeService.theme;

  /**
   * Alterna entre modo claro y oscuro
   */
  toggleTheme(): void {
    this.themeService.toggleTheme();
  }

  /**
   * Obtiene el icono según el tema actual
   */
  get themeIcon(): string {
    return this.theme() === 'light' ? 'dark_mode' : 'light_mode';
  }

  /**
   * Obtiene el label de accesibilidad
   */
  get ariaLabel(): string {
    return this.theme() === 'light'
      ? 'Cambiar a modo oscuro'
      : 'Cambiar a modo claro';
  }
}
