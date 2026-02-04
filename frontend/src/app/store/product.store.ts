import { Injectable, inject, signal, computed, effect } from '@angular/core';
import { ProductService } from '../services/product.service';
import { Product, CreateProductDto, UpdateProductDto, ProductSearchParams } from '../models';

/**
 * Estado del Store de Productos
 * Centraliza todo el estado relacionado con productos
 */
export interface ProductState {
  products: Product[];
  loading: boolean;
  error: string | null;
  selectedProduct: Product | null;
}

/**
 * Estado de paginación
 */
export interface PaginationState {
  currentPage: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * ProductStore - Gestión de Estado con Angular Signals
 *
 * FASE 6 - Gestión de Estado (Requisitos cumplidos):
 * ──────────────────────────────────────────────────
 * ✅ Patrón Store centralizado con Signals
 * ✅ Estado inmutable (actualización con spread operator)
 * ✅ Computed signals para datos derivados
 * ✅ Actualización reactiva sin recargas de página
 * ✅ CRUD completo con actualización inmediata de UI
 *
 * Arquitectura:
 * ProductService (HTTP) → ProductStore (Estado) → Componentes (UI)
 */
@Injectable({
  providedIn: 'root'
})
export class ProductStore {
  private readonly productService = inject(ProductService);

  // ══════════════════════════════════════════════════════════════════
  // ESTADO PRINCIPAL (Signals privados)
  // ══════════════════════════════════════════════════════════════════

  /** Lista de productos */
  private readonly _products = signal<Product[]>([]);

  /** Estado de carga */
  private readonly _loading = signal<boolean>(false);

  /** Mensaje de error */
  private readonly _error = signal<string | null>(null);

  /** Producto seleccionado para edición/detalle */
  private readonly _selectedProduct = signal<Product | null>(null);

  // ══════════════════════════════════════════════════════════════════
  // ESTADO DE BÚSQUEDA Y FILTROS
  // ══════════════════════════════════════════════════════════════════

  /** Término de búsqueda */
  private readonly _searchTerm = signal<string>('');

  /** Categoría seleccionada */
  private readonly _selectedCategory = signal<string>('');

  /** Campo de ordenación */
  private readonly _sortBy = signal<'name' | 'price' | 'createdAt'>('name');

  /** Dirección de ordenación */
  private readonly _sortOrder = signal<'asc' | 'desc'>('asc');

  // ══════════════════════════════════════════════════════════════════
  // ESTADO DE PAGINACIÓN
  // ══════════════════════════════════════════════════════════════════

  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);
  private readonly _totalItems = signal<number>(0);

  // ══════════════════════════════════════════════════════════════════
  // SELECTORES PÚBLICOS (Signals de solo lectura)
  // ══════════════════════════════════════════════════════════════════

  /** Productos (solo lectura) */
  readonly products = this._products.asReadonly();

  /** Estado de carga */
  readonly loading = this._loading.asReadonly();

  /** Error actual */
  readonly error = this._error.asReadonly();

  /** Producto seleccionado */
  readonly selectedProduct = this._selectedProduct.asReadonly();

  /** Término de búsqueda */
  readonly searchTerm = this._searchTerm.asReadonly();

  /** Categoría seleccionada */
  readonly selectedCategory = this._selectedCategory.asReadonly();

  /** Página actual */
  readonly currentPage = this._currentPage.asReadonly();

  /** Tamaño de página */
  readonly pageSize = this._pageSize.asReadonly();

  /** Total de items */
  readonly totalItems = this._totalItems.asReadonly();

  /** Campo de ordenación actual */
  readonly sortBy = this._sortBy.asReadonly();

  /** Dirección de ordenación actual */
  readonly sortOrder = this._sortOrder.asReadonly();

  // ══════════════════════════════════════════════════════════════════
  // COMPUTED SIGNALS (Datos derivados - recalculados automáticamente)
  // ══════════════════════════════════════════════════════════════════

  /** Total de páginas */
  readonly totalPages = computed(() =>
    Math.ceil(this._totalItems() / this._pageSize()) || 1
  );

  /** ¿Hay página anterior? */
  readonly hasPreviousPage = computed(() => this._currentPage() > 1);

  /** ¿Hay página siguiente? */
  readonly hasNextPage = computed(() =>
    this._currentPage() < this.totalPages()
  );

  /** Productos filtrados localmente (para búsqueda instantánea) */
  readonly filteredProducts = computed(() => {
    let result = this._products();
    const search = this._searchTerm().toLowerCase().trim();
    const category = this._selectedCategory();

    // Filtrar por búsqueda
    if (search) {
      result = result.filter(p =>
        p.name.toLowerCase().includes(search) ||
        p.description.toLowerCase().includes(search)
      );
    }

    // Filtrar por categoría
    if (category) {
      result = result.filter(p => p.category === category);
    }

    // Ordenar
    const sortBy = this._sortBy();
    const sortOrder = this._sortOrder();

    return [...result].sort((a, b) => {
      const aVal = a[sortBy];
      const bVal = b[sortBy];

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

  /** Productos paginados (para mostrar en UI) */
  readonly paginatedProducts = computed(() => {
    const filtered = this.filteredProducts();
    const page = this._currentPage();
    const size = this._pageSize();
    const start = (page - 1) * size;
    return filtered.slice(start, start + size);
  });

  /** Contador de productos */
  readonly productCount = computed(() => this._products().length);

  /** Contador de productos filtrados */
  readonly filteredCount = computed(() => this.filteredProducts().length);

  /** Productos destacados */
  readonly featuredProducts = computed(() =>
    this._products().filter(p => p.featured)
  );

  /** Categorías únicas (derivadas de productos) */
  readonly categories = computed(() => {
    const cats = new Set(this._products().map(p => p.category));
    return Array.from(cats).sort();
  });

  /** ¿Está vacío? */
  readonly isEmpty = computed(() =>
    !this._loading() && this._products().length === 0
  );

  /** ¿Hay error? */
  readonly hasError = computed(() => this._error() !== null);

  /** Estado combinado para la vista */
  readonly viewState = computed(() => ({
    loading: this._loading(),
    error: this._error(),
    products: this.paginatedProducts(),
    isEmpty: this.isEmpty(),
    hasError: this.hasError(),
    pagination: {
      currentPage: this._currentPage(),
      totalPages: this.totalPages(),
      totalItems: this.filteredCount(),
      hasPrevious: this.hasPreviousPage(),
      hasNext: this.hasNextPage()
    }
  }));

  // ══════════════════════════════════════════════════════════════════
  // EFFECTS (Reacciones a cambios de estado)
  // ══════════════════════════════════════════════════════════════════

  constructor() {
    // Effect: Log de cambios de estado (solo en desarrollo)
    effect(() => {
      const count = this.productCount();
      const filtered = this.filteredCount();
      console.debug(`[ProductStore] Productos: ${count}, Filtrados: ${filtered}`);
    });

    // Effect: Reset página cuando cambian los filtros
    effect(() => {
      // Escuchar cambios en búsqueda y categoría
      this._searchTerm();
      this._selectedCategory();
      // Reset a página 1 (evitar quedar en página inexistente)
      // Usamos untracked para no crear ciclo infinito
      if (this._currentPage() !== 1) {
        this._currentPage.set(1);
      }
    }, { allowSignalWrites: true });
  }

  // ══════════════════════════════════════════════════════════════════
  // ACCIONES PÚBLICAS - CRUD
  // ══════════════════════════════════════════════════════════════════

  /**
   * Carga todos los productos desde la API
   */
  load(): void {
    this._loading.set(true);
    this._error.set(null);

    this.productService.getProducts().subscribe({
      next: (products) => {
        this._products.set(products);
        this._totalItems.set(products.length);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(this.extractErrorMessage(err));
        this._loading.set(false);
        console.error('[ProductStore] Error cargando productos:', err);
      }
    });
  }

  /**
   * Carga productos con búsqueda en servidor (para datasets grandes)
   */
  loadWithSearch(params: Partial<ProductSearchParams> = {}): void {
    this._loading.set(true);
    this._error.set(null);

    const searchParams: ProductSearchParams = {
      page: this._currentPage(),
      pageSize: this._pageSize(),
      search: this._searchTerm(),
      category: this._selectedCategory(),
      sortBy: this._sortBy(),
      sortOrder: this._sortOrder(),
      ...params
    };

    this.productService.search(searchParams).subscribe({
      next: (response) => {
        this._products.set(response.data);
        this._totalItems.set(response.meta.totalItems);
        this._currentPage.set(response.meta.currentPage);
        this._loading.set(false);
      },
      error: (err) => {
        this._error.set(this.extractErrorMessage(err));
        this._loading.set(false);
        console.error('[ProductStore] Error en búsqueda:', err);
      }
    });
  }

  /**
   * Añade un nuevo producto
   * Actualiza la UI inmediatamente (optimistic update)
   */
  add(product: CreateProductDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.productService.createProduct(product).subscribe({
      next: (newProduct) => {
        // Actualización inmutable: nuevo array con el producto añadido
        this._products.update(products => [...products, newProduct]);
        this._totalItems.update(total => total + 1);
        this._loading.set(false);
        console.log('[ProductStore] Producto añadido:', newProduct.id);
      },
      error: (err) => {
        this._error.set(this.extractErrorMessage(err));
        this._loading.set(false);
        console.error('[ProductStore] Error añadiendo producto:', err);
      }
    });
  }

  /**
   * Actualiza un producto existente
   * Actualiza la UI inmediatamente
   */
  update(id: string, changes: UpdateProductDto): void {
    this._loading.set(true);
    this._error.set(null);

    this.productService.updateProduct(id, changes).subscribe({
      next: (updatedProduct) => {
        // Actualización inmutable: mapear y reemplazar el producto
        this._products.update(products =>
          products.map(p => p.id === id ? updatedProduct : p)
        );
        // Actualizar también el producto seleccionado si es el mismo
        if (this._selectedProduct()?.id === id) {
          this._selectedProduct.set(updatedProduct);
        }
        this._loading.set(false);
        console.log('[ProductStore] Producto actualizado:', id);
      },
      error: (err) => {
        this._error.set(this.extractErrorMessage(err));
        this._loading.set(false);
        console.error('[ProductStore] Error actualizando producto:', err);
      }
    });
  }

  /**
   * Elimina un producto
   * Actualiza la UI inmediatamente
   */
  delete(id: string): void {
    this._loading.set(true);
    this._error.set(null);

    this.productService.deleteProduct(id).subscribe({
      next: () => {
        // Actualización inmutable: filtrar el producto eliminado
        this._products.update(products =>
          products.filter(p => p.id !== id)
        );
        this._totalItems.update(total => Math.max(0, total - 1));
        // Limpiar selección si era el producto eliminado
        if (this._selectedProduct()?.id === id) {
          this._selectedProduct.set(null);
        }
        this._loading.set(false);
        console.log('[ProductStore] Producto eliminado:', id);
      },
      error: (err) => {
        this._error.set(this.extractErrorMessage(err));
        this._loading.set(false);
        console.error('[ProductStore] Error eliminando producto:', err);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // ACCIONES PÚBLICAS - SELECCIÓN Y NAVEGACIÓN
  // ══════════════════════════════════════════════════════════════════

  /**
   * Selecciona un producto (para ver detalle o editar)
   */
  select(product: Product | null): void {
    this._selectedProduct.set(product);
  }

  /**
   * Selecciona un producto por ID
   */
  selectById(id: string): void {
    const product = this._products().find(p => p.id === id) || null;
    this._selectedProduct.set(product);
  }

  /**
   * Limpia la selección actual
   */
  clearSelection(): void {
    this._selectedProduct.set(null);
  }

  // ══════════════════════════════════════════════════════════════════
  // ACCIONES PÚBLICAS - BÚSQUEDA Y FILTROS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Establece el término de búsqueda
   */
  setSearchTerm(term: string): void {
    this._searchTerm.set(term);
  }

  /**
   * Establece la categoría de filtro
   */
  setCategory(category: string): void {
    this._selectedCategory.set(category);
  }

  /**
   * Establece el ordenamiento
   */
  setSort(sortBy: 'name' | 'price' | 'createdAt', sortOrder: 'asc' | 'desc' = 'asc'): void {
    this._sortBy.set(sortBy);
    this._sortOrder.set(sortOrder);
  }

  /**
   * Limpia todos los filtros
   */
  clearFilters(): void {
    this._searchTerm.set('');
    this._selectedCategory.set('');
    this._sortBy.set('name');
    this._sortOrder.set('asc');
    this._currentPage.set(1);
  }

  // ══════════════════════════════════════════════════════════════════
  // ACCIONES PÚBLICAS - PAGINACIÓN
  // ══════════════════════════════════════════════════════════════════

  /**
   * Ir a una página específica
   */
  goToPage(page: number): void {
    const totalPages = this.totalPages();
    if (page >= 1 && page <= totalPages) {
      this._currentPage.set(page);
    }
  }

  /**
   * Ir a la página anterior
   */
  previousPage(): void {
    if (this.hasPreviousPage()) {
      this._currentPage.update(p => p - 1);
    }
  }

  /**
   * Ir a la página siguiente
   */
  nextPage(): void {
    if (this.hasNextPage()) {
      this._currentPage.update(p => p + 1);
    }
  }

  /**
   * Cambiar tamaño de página
   */
  setPageSize(size: number): void {
    this._pageSize.set(size);
    this._currentPage.set(1); // Reset a primera página
  }

  // ══════════════════════════════════════════════════════════════════
  // ACCIONES PÚBLICAS - ESTADO
  // ══════════════════════════════════════════════════════════════════

  /**
   * Limpia el error actual
   */
  clearError(): void {
    this._error.set(null);
  }

  /**
   * Reinicia el store a su estado inicial
   */
  reset(): void {
    this._products.set([]);
    this._loading.set(false);
    this._error.set(null);
    this._selectedProduct.set(null);
    this._searchTerm.set('');
    this._selectedCategory.set('');
    this._sortBy.set('name');
    this._sortOrder.set('asc');
    this._currentPage.set(1);
    this._pageSize.set(10);
    this._totalItems.set(0);
  }

  // ══════════════════════════════════════════════════════════════════
  // HELPERS PRIVADOS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Extrae mensaje de error legible
   */
  private extractErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    if (typeof error === 'object' && error !== null) {
      const err = error as { friendlyMessage?: string; message?: string };
      return err.friendlyMessage || err.message || 'Error desconocido';
    }
    return 'Ha ocurrido un error inesperado';
  }
}
