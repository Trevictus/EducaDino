package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.service.CartService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador del Carrito de Compras
 *
 * Endpoints para gestionar el carrito del usuario.
 *
 * Base URL: /api/cart
 */
@RestController
@RequestMapping("/cart")
@RequiredArgsConstructor
@Tag(name = "Carrito", description = "Carrito de compras (simulado)")
@SecurityRequirement(name = "bearerAuth")
public class CartController {

    private final CartService cartService;

    /**
     * Obtiene el carrito del usuario.
     *
     * GET /api/cart
     */
    @GetMapping
    @Operation(summary = "Ver carrito", description = "Obtiene el contenido del carrito")
    public ResponseEntity<ApiResponse<CartDto>> getCart() {
        return ResponseEntity.ok(ApiResponse.success(cartService.getCart()));
    }

    /**
     * Añade un producto al carrito.
     *
     * POST /api/cart/items
     *
     * Body: { "productId": 1, "quantity": 2 }
     */
    @PostMapping("/items")
    @Operation(summary = "Añadir al carrito", description = "Añade un producto al carrito")
    public ResponseEntity<ApiResponse<CartDto>> addToCart(@Valid @RequestBody AddToCartRequest request) {
        return ResponseEntity.ok(ApiResponse.success(cartService.addToCart(request), "Producto añadido al carrito"));
    }

    /**
     * Actualiza la cantidad de un producto en el carrito.
     *
     * PUT /api/cart/items/{productId}
     */
    @PutMapping("/items/{productId}")
    @Operation(summary = "Actualizar cantidad", description = "Actualiza la cantidad de un producto en el carrito")
    public ResponseEntity<ApiResponse<CartDto>> updateQuantity(
            @PathVariable Long productId,
            @RequestParam int quantity
    ) {
        return ResponseEntity.ok(ApiResponse.success(cartService.updateQuantity(productId, quantity)));
    }

    /**
     * Elimina un producto del carrito.
     *
     * DELETE /api/cart/items/{productId}
     */
    @DeleteMapping("/items/{productId}")
    @Operation(summary = "Eliminar del carrito", description = "Elimina un producto del carrito")
    public ResponseEntity<ApiResponse<CartDto>> removeFromCart(@PathVariable Long productId) {
        return ResponseEntity.ok(ApiResponse.success(cartService.removeFromCart(productId), "Producto eliminado del carrito"));
    }

    /**
     * Vacía el carrito completo.
     *
     * DELETE /api/cart
     */
    @DeleteMapping
    @Operation(summary = "Vaciar carrito", description = "Elimina todos los productos del carrito")
    public ResponseEntity<ApiResponse<CartDto>> clearCart() {
        return ResponseEntity.ok(ApiResponse.success(cartService.clearCart(), "Carrito vaciado"));
    }

    /**
     * Procesa el checkout (simulado).
     *
     * POST /api/cart/checkout
     */
    @PostMapping("/checkout")
    @Operation(summary = "Checkout", description = "Procesa la compra (simulado)")
    public ResponseEntity<ApiResponse<String>> checkout() {
        return ResponseEntity.ok(cartService.checkout());
    }
}
