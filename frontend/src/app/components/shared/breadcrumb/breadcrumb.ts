import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { BreadcrumbService } from '../../../services/breadcrumb.service';

/**
 * BreadcrumbComponent - Componente de navegación por migas de pan.
 *
 * FASE 4 - Navegación (Requisito 4.6):
 * ─────────────────────────────────────
 * - Muestra la ruta de navegación actual
 * - Usa el BreadcrumbService para obtener las migas
 * - Soporta navegación con RouterLink
 * - Accesible con aria-labels apropiados
 *
 * Uso:
 * ```html
 * <app-breadcrumb></app-breadcrumb>
 * ```
 */
@Component({
  selector: 'app-breadcrumb',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './breadcrumb.html',
  styleUrl: './breadcrumb.scss',
})
export class BreadcrumbComponent {
  readonly breadcrumbService = inject(BreadcrumbService);
}

