import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ProductService, Product } from '../../../services/product.service';

/**
 * ProductListComponent - Lista de todos los productos.
 *
 * Muestra los productos disponibles con opciones de filtrado.
 * Permite navegar al detalle de cada producto.
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

  products: Product[] = [];
  loading = true;
  errorMessage: string | null = null;

  ngOnInit(): void {
    // Verificar si hay un mensaje de error en el state de navegación
    const navigation = this.router.getCurrentNavigation();
    const state = navigation?.extras.state as { error?: string } | undefined;

    if (state?.error) {
      this.errorMessage = state.error;
    }

    // Cargar productos
    this.loadProducts();
  }

  private loadProducts(): void {
    this.loading = true;
    this.productService.getProducts().subscribe({
      next: (products) => {
        this.products = products;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error cargando productos:', error);
        this.loading = false;
      }
    });
  }

  /**
   * Ejemplo de navegación programática con parámetros de ruta
   */
  navigateToProduct(productId: string): void {
    this.router.navigate(['/productos', productId]);
  }

  /**
   * Ejemplo de navegación con queryParams
   */
  navigateWithFilters(category: string): void {
    this.router.navigate(['/productos'], {
      queryParams: { category, page: 1 },
      queryParamsHandling: 'merge' // Preserva otros queryParams existentes
    });
  }

  /**
   * Ejemplo de navegación con state (NavigationExtras)
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

  dismissError(): void {
    this.errorMessage = null;
  }
}
