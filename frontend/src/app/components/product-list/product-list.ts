import { Component, inject, OnInit, ChangeDetectionStrategy, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ProductStore } from '../../store/product.store';
import { Product } from '../../models';
import { Alert } from '../../components/shared/alert/alert';

/**
 * ProductListComponent - Listado Optimizado con Store + Signals
 *
 * FASE 6 - Gestión de Estado (Requisitos cumplidos):
 * ──────────────────────────────────────────────────
 * ✅ ChangeDetectionStrategy.OnPush - Rendimiento optimizado
 * ✅ TrackBy en @for - Evita re-render innecesarios
 * ✅ Consume ProductStore (Signals) - Estado centralizado
 * ✅ Búsqueda con debounceTime - UX sin parpadeos
 * ✅ Paginación reactiva - Sin recargas de página
 * ✅ DestroyRef - Limpieza automática de suscripciones
 *
 * @example
 * <app-product-list></app-product-list>
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, Alert],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductListComponent implements OnInit {
  // ============================================================
  // INYECCIÓN DE DEPENDENCIAS
  // ============================================================

  /** Store centralizado de productos */
  readonly store = inject(ProductStore);

  /** Referencia para limpieza automática de suscripciones */
  private readonly destroyRef = inject(DestroyRef);

  // ============================================================
  // CONTROLES DE FORMULARIO REACTIVO
  // ============================================================

  /** Control para búsqueda con debounce */
  readonly searchControl = new FormControl<string>('', { nonNullable: true });

  /** Control para filtro de categoría */
  readonly categoryControl = new FormControl<string>('', { nonNullable: true });

  // ============================================================
  // CATEGORÍAS DISPONIBLES
  // ============================================================

  readonly defaultCategories = [
    'Kits Educativos',
    'Figuras',
    'Puzzles',
    'Libros',
    'Peluches',
  ];

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    // Cargar productos al iniciar
    this.store.load();

    // Configurar búsqueda reactiva con debounce
    this.setupSearchDebounce();

    // Configurar filtro de categoría reactivo
    this.setupCategoryFilter();
  }

  // ============================================================
  // CONFIGURACIÓN DE BÚSQUEDA REACTIVA
  // ============================================================

  /**
   * Configura el debounce para la búsqueda
   * Evita llamadas excesivas mientras el usuario escribe
   */
  private setupSearchDebounce(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300), // Esperar 300ms después de que el usuario deje de escribir
      distinctUntilChanged(), // Solo emitir si el valor cambió
      takeUntilDestroyed(this.destroyRef) // Limpieza automática
    ).subscribe(term => {
      this.store.setSearchTerm(term);
    });
  }

  /**
   * Configura el filtro de categoría reactivo
   */
  private setupCategoryFilter(): void {
    this.categoryControl.valueChanges.pipe(
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)
    ).subscribe(category => {
      this.store.setCategory(category);
    });
  }

  // ============================================================
  // ACCIONES DE BÚSQUEDA Y FILTROS
  // ============================================================

  /**
   * Limpia todos los filtros de búsqueda
   */
  clearFilters(): void {
    this.searchControl.setValue('');
    this.categoryControl.setValue('');
    this.store.clearFilters();
  }

  /**
   * Reintentar carga después de error
   */
  retry(): void {
    this.store.load();
  }

  /**
   * Limpia el estado de error
   */
  clearError(): void {
    this.store.clearError();
  }

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  goToPage(page: number): void {
    this.store.goToPage(page);
  }

  nextPage(): void {
    this.store.nextPage();
  }

  previousPage(): void {
    this.store.previousPage();
  }

  // ============================================================
  // ORDENAMIENTO
  // ============================================================

  sortBy(field: 'name' | 'price'): void {
    const currentSortBy = this.store.sortBy();
    const currentOrder = this.store.sortOrder();

    // Toggle: si es el mismo campo, cambiar dirección; si es diferente, asc
    if (currentSortBy === field) {
      this.store.setSort(field, currentOrder === 'asc' ? 'desc' : 'asc');
    } else {
      this.store.setSort(field, 'asc');
    }
  }

  /**
   * Obtiene el icono de ordenamiento para un campo
   */
  getSortIcon(field: string): string {
    const currentSortBy = this.store.sortBy();
    const currentOrder = this.store.sortOrder();

    if (currentSortBy !== field) {
      return 'unfold_more';
    }
    return currentOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  // ============================================================
  // ACCIONES DE PRODUCTO (CRUD)
  // ============================================================

  /**
   * Manejador de click en producto
   */
  onProductClick(product: Product): void {
    this.store.select(product);
    console.log('Producto seleccionado:', product.name);
  }

  /**
   * Editar producto
   */
  onEditProduct(product: Product, event: Event): void {
    event.stopPropagation();
    this.store.select(product);
    console.log('Editar producto:', product.id);
    // Aquí abrirías un modal o navegarías a edición
  }

  /**
   * Eliminar producto con confirmación
   * ⚡ La UI se actualiza automáticamente gracias al Store
   */
  onDeleteProduct(product: Product, event: Event): void {
    event.stopPropagation();

    if (confirm(`¿Eliminar "${product.name}"?`)) {
      // El store actualiza la UI automáticamente sin recargar
      this.store.delete(product.id);
    }
  }

  // ============================================================
  // TRACK BY FUNCTION (Rendimiento)
  // ============================================================

  /**
   * TrackBy para optimizar renderizado de listas
   * Angular usa esto para identificar elementos únicos
   * y evitar re-renderizar elementos que no cambiaron
   */
  trackByProductId(index: number, product: Product): string {
    return product.id;
  }
}
