import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Product } from '../../../services/product.service';

/**
 * ProductDetailComponent - Detalle de un producto específico.
 *
 * Recibe los datos del producto desde el resolver.
 * Demuestra el uso de ActivatedRoute para acceder a datos resueltos y state.
 */
@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './product-detail.html',
  styleUrl: './product-detail.scss'
})
export class ProductDetail implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  product: Product | null = null;
  navigationState: any = null;

  ngOnInit(): void {
    // Obtener el producto desde el resolver
    this.route.data.subscribe(data => {
      this.product = data['product'];
    });

    // Obtener el state de navegación (si existe)
    this.navigationState = history.state;
  }

  /**
   * Ejemplo de navegación hacia atrás con router
   */
  goBack(): void {
    this.router.navigate(['/productos']);
  }

  /**
   * Ejemplo de navegación a edición preservando queryParams
   */
  editProduct(): void {
    if (this.product) {
      this.router.navigate(['/admin/productos', this.product.id, 'editar'], {
        queryParamsHandling: 'preserve'
      });
    }
  }

  /**
   * Ejemplo de navegación con queryParams mezclados
   */
  shareProduct(): void {
    if (this.product) {
      this.router.navigate(['/productos', this.product.id], {
        queryParams: {
          shared: true,
          source: 'detail'
        },
        queryParamsHandling: 'merge'
      });
    }
  }
}
