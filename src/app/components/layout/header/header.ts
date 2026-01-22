import { Component, HostListener, ViewChild, ElementRef } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ThemeToggle } from '../../shared/theme-toggle/theme-toggle';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, CommonModule, ThemeToggle],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  // Estado del menú móvil
  isMenuOpen: boolean = false;
  // Estado del menú de más opciones
  isMoreMenuOpen: boolean = false;

  @ViewChild('searchInput') searchInput?: ElementRef<HTMLInputElement>;

  // Alterna el estado del menú
  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  // Cierra el menú (al hacer clic en un enlace)
  closeMenu(): void {
    this.isMenuOpen = false;
  }

  // Alterna el estado del menú de más opciones
  toggleMoreMenu(): void {
    this.isMoreMenuOpen = !this.isMoreMenuOpen;
  }

  // Cierra el menú de más opciones
  closeMoreMenu(): void {
    this.isMoreMenuOpen = false;
  }

  // Función de búsqueda sincronizada con otros botones
  onSearch(searchTerm: string): void {
    // Aquí puedes agregar la lógica de búsqueda
    console.log('Buscando:', searchTerm);
    // Por ejemplo, podrías emitir un evento o navegar a una página de búsqueda
  }

  /**
   * TAREA 3: Cerrar menú al hacer click fuera
   * Usa @HostListener para escuchar clicks en el documento
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Si el menú está abierto y el click no fue dentro del header
    if (this.isMenuOpen) {
      const header = target.closest('.header');
      const hamburger = target.closest('.header__hamburger');

      // Si el click fue fuera del header o en el overlay, cerrar
      if (!header || (!hamburger && !target.closest('.header__mobile-nav'))) {
        // No cerrar si se hizo click en el hamburguesa (lo maneja toggleMenu)
        if (!hamburger) {
          this.closeMenu();
        }
      }
    }
  }
}
