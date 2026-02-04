import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Interfaces para el carrito
 */
export interface CartItem {
  id: number;
  productId: number;
  productName: string;
  productImage: string;
  productPrice: number;
  quantity: number;
  subtotal: number;
}

export interface Cart {
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

/**
 * CartService - Servicio del Carrito de Compras
 *
 * Gestiona el carrito de compras del usuario.
 * Se sincroniza con el backend cuando el usuario está autenticado.
 */
@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly api = inject(ApiService);

  // Estado reactivo
  private readonly _cart = signal<Cart>({
    items: [],
    totalItems: 0,
    totalPrice: 0,
  });
  private readonly _isLoading = signal(false);

  /** Carrito actual */
  readonly cart = this._cart.asReadonly();

  /** Estado de carga */
  readonly isLoading = this._isLoading.asReadonly();

  /** Items del carrito */
  readonly items = computed(() => this._cart().items);

  /** Número total de items */
  readonly totalItems = computed(() => this._cart().totalItems);

  /** Precio total */
  readonly totalPrice = computed(() => this._cart().totalPrice);

  /** ¿El carrito está vacío? */
  readonly isEmpty = computed(() => this._cart().items.length === 0);

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DEL CARRITO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Carga el carrito desde el backend.
   */
  loadCart(): Observable<{ success: boolean; data: Cart }> {
    this._isLoading.set(true);

    return this.api.get<{ success: boolean; data: Cart }>('/cart').pipe(
      tap((response) => {
        if (response.success) {
          this._cart.set(response.data);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[CartService] Error cargando carrito:', error);
        return of({ success: false, data: { items: [], totalItems: 0, totalPrice: 0 } });
      })
    );
  }

  /**
   * Añade un producto al carrito.
   */
  addToCart(productId: number, quantity: number = 1): Observable<{ success: boolean; data: Cart }> {
    this._isLoading.set(true);

    const request: AddToCartRequest = { productId, quantity };

    return this.api.post<{ success: boolean; data: Cart }>('/cart/items', request).pipe(
      tap((response) => {
        if (response.success) {
          this._cart.set(response.data);
          console.log('[CartService] Producto añadido al carrito');
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[CartService] Error añadiendo al carrito:', error);
        throw error;
      })
    );
  }

  /**
   * Actualiza la cantidad de un producto.
   */
  updateQuantity(productId: number, quantity: number): Observable<{ success: boolean; data: Cart }> {
    this._isLoading.set(true);

    return this.api.put<{ success: boolean; data: Cart }>(`/cart/items/${productId}?quantity=${quantity}`, {}).pipe(
      tap((response) => {
        if (response.success) {
          this._cart.set(response.data);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[CartService] Error actualizando cantidad:', error);
        throw error;
      })
    );
  }

  /**
   * Elimina un producto del carrito.
   */
  removeFromCart(productId: number): Observable<{ success: boolean; data: Cart }> {
    this._isLoading.set(true);

    return this.api.delete<{ success: boolean; data: Cart }>(`/cart/items/${productId}`).pipe(
      tap((response) => {
        if (response.success) {
          this._cart.set(response.data);
          console.log('[CartService] Producto eliminado del carrito');
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[CartService] Error eliminando del carrito:', error);
        throw error;
      })
    );
  }

  /**
   * Vacía el carrito completo.
   */
  clearCart(): Observable<{ success: boolean; data: Cart }> {
    this._isLoading.set(true);

    return this.api.delete<{ success: boolean; data: Cart }>('/cart').pipe(
      tap((response) => {
        if (response.success) {
          this._cart.set(response.data);
          console.log('[CartService] Carrito vaciado');
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[CartService] Error vaciando carrito:', error);
        throw error;
      })
    );
  }

  /**
   * Procesa el checkout (simulado).
   */
  checkout(): Observable<{ success: boolean; data: string; message: string }> {
    this._isLoading.set(true);

    return this.api.post<{ success: boolean; data: string; message: string }>('/cart/checkout', {}).pipe(
      tap((response) => {
        if (response.success) {
          // Limpiar el carrito local
          this._cart.set({
            items: [],
            totalItems: 0,
            totalPrice: 0,
          });
          console.log('[CartService] Checkout completado:', response.message);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[CartService] Error en checkout:', error);
        throw error;
      })
    );
  }

  /**
   * Incrementa la cantidad de un producto.
   */
  incrementQuantity(productId: number): void {
    const item = this._cart().items.find((i) => i.productId === productId);
    if (item) {
      this.updateQuantity(productId, item.quantity + 1).subscribe();
    }
  }

  /**
   * Decrementa la cantidad de un producto.
   */
  decrementQuantity(productId: number): void {
    const item = this._cart().items.find((i) => i.productId === productId);
    if (item && item.quantity > 1) {
      this.updateQuantity(productId, item.quantity - 1).subscribe();
    } else if (item && item.quantity === 1) {
      this.removeFromCart(productId).subscribe();
    }
  }
}
