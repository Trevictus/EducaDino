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
  template: `
    @if (breadcrumbService.hasBreadcrumbs()) {
      <nav class="breadcrumb" aria-label="Navegación por migas de pan">
        <ol class="breadcrumb__list">
          @for (crumb of breadcrumbService.breadcrumbs(); track crumb.url) {
            <li class="breadcrumb__item" [class.breadcrumb__item--current]="crumb.isCurrentPage">
              @if (!crumb.isCurrentPage) {
                <a
                  [routerLink]="crumb.url"
                  class="breadcrumb__link"
                >
                  {{ crumb.label }}
                </a>
                <span class="breadcrumb__separator" aria-hidden="true">›</span>
              } @else {
                <span class="breadcrumb__current" aria-current="page">
                  {{ crumb.label }}
                </span>
              }
            </li>
          }
        </ol>
      </nav>
    }
  `,
  styles: [`
    .breadcrumb {
      padding: var(--spacing-2) var(--spacing-4);
      background-color: var(--background-color-hover);
      border-radius: 8px;
      margin-bottom: var(--spacing-3);
    }

    .breadcrumb__list {
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      gap: var(--spacing-1);
      list-style: none;
      margin: 0;
      padding: 0;
      font-family: var(--font-primary);
      font-size: var(--font-size-lg);
    }

    .breadcrumb__item {
      display: flex;
      align-items: center;
      gap: var(--spacing-1);
    }

    .breadcrumb__link {
      color: var(--primary-color);
      text-decoration: none;
      transition: color 0.2s ease;

      &:hover {
        color: var(--primary-color-hover);
        text-decoration: underline;
      }
    }

    .breadcrumb__separator {
      color: var(--text-color);
      opacity: 0.5;
      font-size: var(--font-size-xl);
    }

    .breadcrumb__current {
      color: var(--text-color);
      font-weight: var(--font-weight-semibold);
    }

    .breadcrumb__item--current {
      .breadcrumb__current {
        color: var(--primary-color-active);
      }
    }
  `]
})
export class BreadcrumbComponent {
  readonly breadcrumbService = inject(BreadcrumbService);
}

