import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CanComponentDeactivate } from '../../../guards/pending-changes.guard';

/**
 * AdminProductEdit - Formulario de edición de productos.
 * Implementa CanComponentDeactivate para el pendingChangesGuard.
 * Cargado con Lazy Loading.
 */
@Component({
  selector: 'app-admin-product-edit',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <section class="admin-edit">
      <h1>✏️ Editar Producto</h1>
      <p>ID del producto: {{ productId }}</p>

      <form class="admin-edit__form">
        <div class="admin-edit__field">
          <label>Nombre:</label>
          <input
            type="text"
            [(ngModel)]="productName"
            name="productName"
            (ngModelChange)="onFieldChange()"
          />
        </div>

        <div class="admin-edit__field">
          <label>Precio:</label>
          <input
            type="number"
            [(ngModel)]="productPrice"
            name="productPrice"
            (ngModelChange)="onFieldChange()"
          />
        </div>

        @if (isDirty) {
          <p class="admin-edit__dirty">⚠️ Tienes cambios sin guardar</p>
        }

        <div class="admin-edit__actions">
          <button type="button" class="admin-edit__btn admin-edit__btn--primary" (click)="save()">
            💾 Guardar
          </button>
          <a routerLink="/admin/productos" class="admin-edit__btn admin-edit__btn--secondary">
            ← Cancelar
          </a>
        </div>
      </form>
    </section>
  `,
  styles: [`
    .admin-edit {
      padding: var(--spacing-4);
      max-width: 600px;
      margin: 0 auto;

      h1 {
        font-family: var(--font-secondary);
        font-size: var(--font-size-4xl);
        color: var(--primary-color);
      }

      &__form {
        background-color: var(--background-color-hover);
        padding: var(--spacing-3);
        border-radius: 16px;
        margin-top: var(--spacing-3);
      }

      &__field {
        margin-bottom: var(--spacing-2);

        label {
          display: block;
          font-family: var(--font-primary);
          font-weight: var(--font-weight-medium);
          margin-bottom: var(--spacing-1);
        }

        input {
          width: 100%;
          padding: var(--spacing-2);
          border: 2px solid var(--gray-scale);
          border-radius: 8px;
          font-size: var(--font-size-xl);
        }
      }

      &__dirty {
        color: var(--support-color);
        font-family: var(--font-primary);
        text-align: center;
      }

      &__actions {
        display: flex;
        gap: var(--spacing-2);
        margin-top: var(--spacing-3);
      }

      &__btn {
        padding: var(--spacing-2) var(--spacing-3);
        border-radius: 8px;
        font-family: var(--font-primary);
        text-decoration: none;
        border: none;
        cursor: pointer;

        &--primary {
          background-color: var(--primary-color);
          color: var(--text-color-light);
        }

        &--secondary {
          background-color: var(--gray-scale);
          color: var(--text-color);
        }
      }
    }
  `]
})
export class AdminProductEdit implements CanComponentDeactivate {
  private readonly route = inject(ActivatedRoute);

  productId = '';
  productName = 'Kit Excavación T-Rex';
  productPrice = 29.99;
  isDirty = false;

  constructor() {
    this.route.paramMap.subscribe(params => {
      this.productId = params.get('id') || '';
    });
  }

  onFieldChange(): void {
    this.isDirty = true;
  }

  save(): void {
    // Simular guardado
    this.isDirty = false;
    alert('Producto guardado correctamente');
  }

  /**
   * Implementación de CanComponentDeactivate
   */
  canDeactivate(): boolean {
    return !this.isDirty;
  }
}

