import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';
import { catchError, of } from 'rxjs';
import { ProductService, Product } from '../services/product.service';

/**
 * ProductResolver - Resolver para precargar datos de un producto antes de entrar a la ruta.
 *
 * Obtiene el producto por ID desde el servicio.
 * Si el producto no existe, redirige a '/productos' con información del error en el state.
 */
export const productResolver: ResolveFn<Product | null> = (route, state) => {
  const productService = inject(ProductService);
  const router = inject(Router);

  const productId = route.paramMap.get('id');

  if (!productId) {
    router.navigate(['/productos'], {
      state: { error: 'ID de producto no proporcionado' }
    });
    return of(null);
  }

  return productService.getProductById(productId).pipe(
    catchError((error) => {
      // Redirigir a productos con el error en el state
      router.navigate(['/productos'], {
        state: {
          error: `Producto con ID "${productId}" no encontrado`,
          originalError: error.message
        }
      });
      return of(null);
    })
  );
};

