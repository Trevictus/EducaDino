import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * AdminProductList - Lista de productos para administración.
 * Cargado con Lazy Loading.
 */
@Component({
  selector: 'app-admin-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="admin-products">
      <h1>📦 Gestión de Productos</h1>
      <p>Administra el catálogo de productos.</p>

      <div class="admin-products__actions">
        <a routerLink="/productos/nuevo" class="admin-products__btn">
          ➕ Añadir Producto
        </a>
      </div>

      <div class="admin-products__list">
        <p>Lista de productos para editar...</p>
        <a routerLink="/admin/productos/prod-001/editar" class="admin-products__link">
          Editar T-Rex Kit (ejemplo con guard)
        </a>
      </div>
    </section>
  `,
  styles: [`
    .admin-products {
      padding: var(--spacing-4);
      max-width: 800px;
      margin: 0 auto;

      h1 {
        font-family: var(--font-secondary);
        font-size: var(--font-size-4xl);
        color: var(--primary-color);
      }

      &__actions {
        margin: var(--spacing-3) 0;
      }

      &__btn {
        display: inline-block;
        padding: var(--spacing-2) var(--spacing-3);
        background-color: var(--primary-color);
        color: var(--text-color-light);
        text-decoration: none;
        border-radius: 8px;
        font-family: var(--font-primary);
      }

      &__link {
        color: var(--primary-color);
        text-decoration: underline;
      }
    }
  `]
})
export class AdminProductList {}

