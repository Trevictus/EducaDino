package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.service.ProductService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

/**
 * Controlador de Productos
 *
 * Endpoints para consultar y gestionar productos educativos.
 * Compatible con el ProductService del frontend Angular.
 *
 * Base URL: /api/products
 */
@RestController
@RequestMapping("/products")
@RequiredArgsConstructor
@Tag(name = "Productos", description = "Productos educativos de la tienda")
public class ProductController {

    private final ProductService productService;

    // ═══════════════════════════════════════════════════════════════
    // ENDPOINTS PÚBLICOS (sin autenticación)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Obtiene todos los productos con paginación y filtros.
     *
     * GET /api/products?page=0&pageSize=10&search=rex&category=Figuras
     *
     * Compatible con ProductSearchParams del frontend.
     */
    @GetMapping
    @Operation(summary = "Listar productos", description = "Obtiene productos con paginación y filtros")
    public ResponseEntity<PaginatedResponse<ProductDto>> getAllProducts(
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int pageSize,
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String category,
            @RequestParam(required = false) BigDecimal minPrice,
            @RequestParam(required = false) BigDecimal maxPrice,
            @RequestParam(required = false) Boolean featured,
            @RequestParam(defaultValue = "id") String sortBy,
            @RequestParam(defaultValue = "asc") String sortOrder
    ) {
        return ResponseEntity.ok(productService.getAllProducts(
                page, pageSize, search, category, minPrice, maxPrice, featured, sortBy, sortOrder
        ));
    }

    /**
     * Obtiene un producto por ID.
     *
     * GET /api/products/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener producto", description = "Obtiene un producto por su ID")
    public ResponseEntity<ApiResponse<ProductDto>> getProductById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(productService.getProductById(id)));
    }

    /**
     * Obtiene productos destacados.
     *
     * GET /api/products/featured
     */
    @GetMapping("/featured")
    @Operation(summary = "Productos destacados", description = "Obtiene los productos marcados como destacados")
    public ResponseEntity<ApiResponse<List<ProductDto>>> getFeaturedProducts() {
        return ResponseEntity.ok(ApiResponse.success(productService.getFeaturedProducts()));
    }

    /**
     * Obtiene todas las categorías disponibles.
     *
     * GET /api/products/categories
     */
    @GetMapping("/categories")
    @Operation(summary = "Listar categorías", description = "Obtiene todas las categorías de productos")
    public ResponseEntity<ApiResponse<List<String>>> getAllCategories() {
        return ResponseEntity.ok(ApiResponse.success(productService.getAllCategories()));
    }

    // ═══════════════════════════════════════════════════════════════
    // ENDPOINTS DE ADMIN (requieren autenticación)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Crea un nuevo producto (solo admin).
     *
     * POST /api/products
     */
    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear producto", description = "Crea un nuevo producto (solo admin)")
    public ResponseEntity<ApiResponse<ProductDto>> createProduct(@Valid @RequestBody CreateProductRequest request) {
        ProductDto created = productService.createProduct(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Producto creado correctamente"));
    }

    /**
     * Actualiza un producto existente (solo admin).
     *
     * PUT /api/products/{id}
     */
    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar producto", description = "Actualiza un producto existente (solo admin)")
    public ResponseEntity<ApiResponse<ProductDto>> updateProduct(
            @PathVariable Long id,
            @RequestBody UpdateProductRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(productService.updateProduct(id, request)));
    }

    /**
     * Elimina un producto (solo admin).
     *
     * DELETE /api/products/{id}
     */
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar producto", description = "Elimina un producto (solo admin)")
    public ResponseEntity<ApiResponse<Void>> deleteProduct(@PathVariable Long id) {
        productService.deleteProduct(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Producto eliminado correctamente"));
    }
}
