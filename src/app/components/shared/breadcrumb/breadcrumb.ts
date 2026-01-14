import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService, Breadcrumb } from '../../../services/breadcrumb.service';

/**
 * BreadcrumbComponent - Muestra la miga de pan de navegación.
 *
 * Se actualiza automáticamente cuando cambia la ruta.
 * Usa el BreadcrumbService para obtener los datos.
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss'
})
export class BreadcrumbComponent {
  private readonly breadcrumbService = inject(BreadcrumbService);

  readonly breadcrumbs$ = this.breadcrumbService.breadcrumbs$;
}

