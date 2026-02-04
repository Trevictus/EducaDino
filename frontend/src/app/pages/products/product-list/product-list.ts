import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

/**
 * Estado de la UI del componente
 */
interface ProductListState {
  loading: boolean;
  error: string | null;
  data: Product[];
  successMessage: string | null;
}

/**
 * ProductListComponent - Lista de todos los productos.
 *
 * FASE 5 - Gestión de Estados con Signals (Requisito 5.5):
 * ─────────────────────────────────────────────────────────
 * - Signal `state` para estados: loading, error, data, empty
 * - Computed signals para derivar estados de UI
 * - Manejo de errores con botón de reintentar
 * - Toast de éxito tras operaciones CRUD
 *
 * FASE 4 - Navegación Programática (Requisito 4.2):
 * ─────────────────────────────────────────────────
 * - goToDetail(id): Navega al detalle con router.navigate
 * - Lectura de queryParams para filtros
 * - NavigationExtras para pasar estado
 */
@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-list.html',
  styleUrl: './product-list.scss'
})
export class ProductList implements OnInit {
  private readonly productService = inject(ProductService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  // ══════════════════════════════════════════════════════════════════
  // ESTADO REACTIVO CON SIGNALS (Requisito 5.5)
  // ══════════════════════════════════════════════════════════════════

  /**
   * Signal principal de estado del componente
   */
  readonly state = signal<ProductListState>({
    loading: true,
    error: null,
    data: [],
    successMessage: null
  });

  /**
   * Computed: Indica si hay productos cargados
   */
  readonly hasProducts = computed(() => this.state().data.length > 0);

  /**
   * Computed: Indica si la lista está vacía (sin loading ni error)
   */
  readonly isEmpty = computed(() =>
    !this.state().loading &&
    !this.state().error &&
    this.state().data.length === 0
  );

  /**
   * Computed: Indica si hay un error
   */
  readonly hasError = computed(() => !!this.state().error);

  /**
   * Computed: Indica si se está cargando
   */
  readonly isLoading = computed(() => this.state().loading);

  /**
   * Computed: Indica si hay mensaje de éxito
   */
  readonly hasSuccess = computed(() => !!this.state().successMessage);

  /**
   * Computed: Productos filtrados por categoría actual
   */
  readonly filteredProducts = computed(() => {
    const category = this.currentCategory();
    if (!category) return this.state().data;
    return this.state().data.filter(p =>
      p.category.toLowerCase() === category.toLowerCase()
    );
  });

  /**
   * Signal: Categoría actual seleccionada (desde queryParams)
   */
  readonly currentCategory = signal<string | null>(null);

  /**
   * Signal: Término de búsqueda actual
   */
  readonly searchTerm = signal<string>('');

  // ══════════════════════════════════════════════════════════════════
  // LIFECYCLE
  // ══════════════════════════════════════════════════════════════════

  ngOnInit(): void {
    // Verificar si hay un mensaje de error/éxito en el state de navegación
    this.checkNavigationState();

    // Escuchar cambios en queryParams para filtros
    this.subscribeToQueryParams();

    // Cargar productos
    this.loadProducts();
  }

  /**
   * Verifica el state de navegación para mostrar mensajes
   */
  private checkNavigationState(): void {
    const navigationState = history.state as {
      error?: string;
      newProduct?: Product;
      deletedProduct?: string;
    } | undefined;

    if (navigationState?.error) {
      this.state.update(s => ({ ...s, error: navigationState.error! }));
    }

    if (navigationState?.newProduct) {
      this.state.update(s => ({
        ...s,
        successMessage: `Producto "${navigationState.newProduct!.name}" creado exitosamente`
      }));
      this.autoHideSuccessMessage();
    }

    if (navigationState?.deletedProduct) {
      this.state.update(s => ({
        ...s,
        successMessage: `Producto eliminado exitosamente`
      }));
      this.autoHideSuccessMessage();
    }
  }

  /**
   * Suscripción a queryParams para filtros (Requisito 4.2)
   */
  private subscribeToQueryParams(): void {
    this.route.queryParams.subscribe(params => {
      if (params['category']) {
        this.currentCategory.set(params['category']);
      }
      if (params['search']) {
        this.searchTerm.set(params['search']);
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // CARGA DE DATOS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Carga los productos desde el servicio
   */
  loadProducts(): void {
    this.state.update(s => ({ ...s, loading: true, error: null }));

    this.productService.getProducts().subscribe({
      next: (products) => {
        this.state.update(s => ({
          ...s,
          data: products,
          loading: false
        }));
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.friendlyMessage || error.message || 'Error al cargar los productos'
        }));
      }
    });
  }

  /**
   * Reintenta cargar los productos (tras un error)
   */
  retryLoad(): void {
    this.loadProducts();
  }

  // ══════════════════════════════════════════════════════════════════
  // NAVEGACIÓN PROGRAMÁTICA (Requisito 4.2)
  // ══════════════════════════════════════════════════════════════════

  /**
   * Navega al detalle de un producto usando router.navigate
   *
   * Ejemplo de navegación programática con parámetros de ruta.
   */
  goToDetail(productId: string): void {
    this.router.navigate(['/productos', productId]);
  }

  /**
   * Navega con queryParams para filtrar por categoría
   *
   * Ejemplo de navegación con queryParams.
   */
  filterByCategory(category: string): void {
    this.router.navigate(['/productos'], {
      queryParams: { category, page: 1 },
      queryParamsHandling: 'merge' // Preserva otros queryParams existentes
    });
  }

  /**
   * Limpia los filtros de categoría
   */
  clearCategoryFilter(): void {
    this.currentCategory.set(null);
    this.router.navigate(['/productos'], {
      queryParams: { category: null },
      queryParamsHandling: 'merge'
    });
  }

  /**
   * Navega al detalle pasando state con datos adicionales
   *
   * Ejemplo de NavigationExtras con state.
   */
  navigateWithState(product: Product): void {
    this.router.navigate(['/productos', product.id], {
      state: {
        fromList: true,
        previousProduct: product,
        timestamp: Date.now()
      }
    });
  }

  /**
   * Navega al formulario de nuevo producto
   */
  goToNewProduct(): void {
    this.router.navigate(['/productos', 'nuevo']);
  }

  // ══════════════════════════════════════════════════════════════════
  // OPERACIONES CRUD
  // ══════════════════════════════════════════════════════════════════

  /**
   * Elimina un producto con confirmación
   */
  deleteProduct(product: Product): void {
    const confirmed = confirm(`¿Estás seguro de eliminar "${product.name}"?`);
    if (!confirmed) return;

    this.state.update(s => ({ ...s, loading: true }));

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.state.update(s => ({
          ...s,
          loading: false,
          data: s.data.filter(p => p.id !== product.id),
          successMessage: `Producto "${product.name}" eliminado exitosamente`
        }));
        this.autoHideSuccessMessage();
      },
      error: (error) => {
        this.state.update(s => ({
          ...s,
          loading: false,
          error: error.friendlyMessage || 'Error al eliminar el producto'
        }));
      }
    });
  }

  // ══════════════════════════════════════════════════════════════════
  // UI HELPERS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Cierra el mensaje de error
   */
  dismissError(): void {
    this.state.update(s => ({ ...s, error: null }));
  }

  /**
   * Cierra el mensaje de éxito
   */
  dismissSuccess(): void {
    this.state.update(s => ({ ...s, successMessage: null }));
  }

  /**
   * Auto-oculta el mensaje de éxito después de 5 segundos
   */
  private autoHideSuccessMessage(): void {
    setTimeout(() => {
      this.dismissSuccess();
    }, 5000);
  }

  /**
   * Obtiene las categorías únicas de los productos
   */
  getCategories(): string[] {
    const categories = new Set(this.state().data.map(p => p.category));
    return Array.from(categories);
  }
}
