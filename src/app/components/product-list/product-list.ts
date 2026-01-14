import { Component, inject, signal, computed, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductService } from '../../services/product.service';
import { Product, ProductSearchParams } from '../../models/product.dto';
import { HttpErrorInfo } from '../../core/interceptors/error.interceptor';
import { Alert } from '../../components/shared/alert/alert';

/**
 * Interface para el estado de la vista
 * Centraliza todos los estados posibles del componente
 */
interface ViewState {
  loading: boolean;
  error: HttpErrorInfo | null;
  data: Product[];
  empty: boolean;
}

/**
 * ProductListComponent - Componente de Ejemplo con Manejo de Estados
 *
 * Demuestra el uso de Signals para gestionar estados de vista reactivos:
 * - Loading: Muestra spinner mientras carga
 * - Error: Muestra mensaje amigable cuando hay error
 * - Empty: Muestra estado vacío cuando no hay datos
 * - Success: Muestra la lista de productos
 *
 * @example
 * <app-product-list></app-product-list>
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Alert],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss',
})
export class ProductListComponent implements OnInit {
  private readonly productService = inject(ProductService);

  // ============================================================
  // ESTADO DE LA VISTA CON SIGNALS
  // ============================================================

  /**
   * Estado principal de la vista
   * Gestiona loading, error, data y empty de forma centralizada
   */
  readonly state = signal<ViewState>({
    loading: false,
    error: null,
    data: [],
    empty: false,
  });

  /**
   * Parámetros de búsqueda actuales
   */
  readonly searchParams = signal<ProductSearchParams>({
    page: 1,
    pageSize: 10,
    search: '',
    category: '',
    sortBy: 'name',
    sortOrder: 'asc',
  });

  /**
   * Metadata de paginación
   */
  readonly pagination = signal({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    hasNextPage: false,
    hasPreviousPage: false,
  });

  // ============================================================
  // COMPUTED SIGNALS (Señales Derivadas)
  // ============================================================

  /**
   * Indica si hay productos cargados
   */
  readonly hasProducts = computed(() => this.state().data.length > 0);

  /**
   * Indica si estamos en estado de error
   */
  readonly hasError = computed(() => this.state().error !== null);

  /**
   * Mensaje de error formateado
   */
  readonly errorMessage = computed(() => {
    const error = this.state().error;
    return error?.friendlyMessage || 'Ha ocurrido un error inesperado';
  });

  /**
   * Productos ordenados (ejemplo de computed)
   */
  readonly sortedProducts = computed(() => {
    const { data } = this.state();
    const { sortBy, sortOrder } = this.searchParams();

    if (!sortBy) return data;

    return [...data].sort((a, b) => {
      const aVal = a[sortBy as keyof Product];
      const bVal = b[sortBy as keyof Product];

      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return sortOrder === 'desc'
          ? bVal.localeCompare(aVal)
          : aVal.localeCompare(bVal);
      }

      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return sortOrder === 'desc' ? bVal - aVal : aVal - bVal;
      }

      return 0;
    });
  });

  // ============================================================
  // FORMULARIO DE BÚSQUEDA
  // ============================================================

  searchTerm = '';
  selectedCategory = '';

  readonly categories = [
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
    this.loadProducts();
  }

  // ============================================================
  // MÉTODOS DE CARGA
  // ============================================================

  /**
   * Carga los productos con los parámetros actuales
   */
  loadProducts(): void {
    // Actualizar estado a loading
    this.state.update((s) => ({
      ...s,
      loading: true,
      error: null,
    }));

    const params = this.searchParams();

    this.productService.search(params).subscribe({
      next: (response) => {
        this.state.set({
          loading: false,
          error: null,
          data: response.data,
          empty: response.data.length === 0,
        });

        this.pagination.set(response.meta);
      },
      error: (error: HttpErrorInfo) => {
        this.state.set({
          loading: false,
          error: error,
          data: [],
          empty: false,
        });

        console.error('[ProductList] Error cargando productos:', error);
      },
    });
  }

  /**
   * Ejecuta la búsqueda con los términos del formulario
   */
  onSearch(): void {
    this.searchParams.update((p) => ({
      ...p,
      page: 1, // Reset a primera página
      search: this.searchTerm,
      category: this.selectedCategory,
    }));

    this.loadProducts();
  }

  /**
   * Limpia los filtros de búsqueda
   */
  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategory = '';

    this.searchParams.set({
      page: 1,
      pageSize: 10,
      search: '',
      category: '',
      sortBy: 'name',
      sortOrder: 'asc',
    });

    this.loadProducts();
  }

  /**
   * Reintentar carga después de error
   */
  retry(): void {
    this.loadProducts();
  }

  /**
   * Limpia el estado de error
   */
  clearError(): void {
    this.state.update((s) => ({ ...s, error: null }));
  }

  // ============================================================
  // PAGINACIÓN
  // ============================================================

  goToPage(page: number): void {
    if (page < 1 || page > this.pagination().totalPages) return;

    this.searchParams.update((p) => ({ ...p, page }));
    this.loadProducts();
  }

  nextPage(): void {
    if (this.pagination().hasNextPage) {
      this.goToPage(this.pagination().currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.pagination().hasPreviousPage) {
      this.goToPage(this.pagination().currentPage - 1);
    }
  }

  // ============================================================
  // ORDENAMIENTO
  // ============================================================

  sortBy(field: 'name' | 'price'): void {
    const current = this.searchParams();

    // Toggle orden si es el mismo campo
    const newOrder =
      current.sortBy === field && current.sortOrder === 'asc' ? 'desc' : 'asc';

    this.searchParams.update((p) => ({
      ...p,
      sortBy: field,
      sortOrder: newOrder,
    }));

    this.loadProducts();
  }

  /**
   * Obtiene el icono de ordenamiento para un campo
   */
  getSortIcon(field: string): string {
    const { sortBy, sortOrder } = this.searchParams();
    if (sortBy !== field) return 'unfold_more';
    return sortOrder === 'asc' ? 'arrow_upward' : 'arrow_downward';
  }

  // ============================================================
  // ACCIONES DE PRODUCTO
  // ============================================================

  onProductClick(product: Product): void {
    console.log('Producto seleccionado:', product);
    // Navegar a detalle, abrir modal, etc.
  }

  onEditProduct(product: Product, event: Event): void {
    event.stopPropagation();
    console.log('Editar producto:', product.id);
  }

  onDeleteProduct(product: Product, event: Event): void {
    event.stopPropagation();

    if (confirm(`¿Eliminar "${product.name}"?`)) {
      this.state.update((s) => ({ ...s, loading: true }));

      this.productService.deleteProduct(product.id).subscribe({
        next: () => {
          // Recargar lista
          this.loadProducts();
        },
        error: (error) => {
          this.state.update((s) => ({
            ...s,
            loading: false,
            error: error,
          }));
        },
      });
    }
  }
}

