import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

/**
 * NotFoundComponent - Página 404 para rutas no encontradas.
 *
 * Se muestra cuando el usuario navega a una URL que no existe.
 * Ofrece opciones para volver al inicio o a páginas principales.
 */
@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './not-found.html',
  styleUrl: './not-found.scss'
})
export class NotFound {
  // Sugerencias de navegación para el usuario
  readonly suggestions = [
    { label: 'Inicio', path: '/home', icon: '🏠' },
    { label: 'Productos', path: '/productos', icon: '🦕' },
    { label: 'Curiosidades', path: '/curiosidades', icon: '📚' },
    { label: 'Contacto', path: '/contacto', icon: '✉️' }
  ];
}
