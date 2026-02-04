package com.educadino.service;

import com.educadino.dto.*;
import com.educadino.entity.Product;
import com.educadino.exception.ResourceNotFoundException;
import com.educadino.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio de Productos
 *
 * Compatible con el ProductService del frontend Angular.
 */
@Service
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;

    /**
     * Obtiene todos los productos con paginación y filtros.
     */
    @Transactional(readOnly = true)
    public PaginatedResponse<ProductDto> getAllProducts(
            int page,
            int pageSize,
            String search,
            String category,
            BigDecimal minPrice,
            BigDecimal maxPrice,
            Boolean featured,
            String sortBy,
            String sortOrder
    ) {
        // Configurar ordenación
        Sort sort = Sort.by(sortOrder.equalsIgnoreCase("desc")
                ? Sort.Direction.DESC
                : Sort.Direction.ASC,
                sortBy != null ? sortBy : "id");

        Pageable pageable = PageRequest.of(page, pageSize, sort);

        // Buscar productos con filtros
        Page<Product> productPage = productRepository.searchProducts(
                search, category, minPrice, maxPrice, featured, pageable);

        // Mapear a DTOs
        List<ProductDto> products = productPage.getContent().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        // Construir respuesta paginada
        return PaginatedResponse.<ProductDto>builder()
                .success(true)
                .data(products)
                .meta(PaginatedResponse.PaginationMeta.builder()
                        .currentPage(page)
                        .totalPages(productPage.getTotalPages())
                        .pageSize(pageSize)
                        .totalItems(productPage.getTotalElements())
                        .hasNextPage(productPage.hasNext())
                        .hasPreviousPage(productPage.hasPrevious())
                        .build())
                .build();
    }

    /**
     * Obtiene un producto por ID.
     */
    @Transactional(readOnly = true)
    public ProductDto getProductById(Long id) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));
        return mapToDto(product);
    }

    /**
     * Obtiene productos destacados.
     */
    @Transactional(readOnly = true)
    public List<ProductDto> getFeaturedProducts() {
        return productRepository.findByFeaturedTrue().stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());
    }

    /**
     * Obtiene todas las categorías disponibles.
     */
    @Transactional(readOnly = true)
    public List<String> getAllCategories() {
        return productRepository.findAllCategories();
    }

    /**
     * Crea un nuevo producto (solo admin).
     */
    @Transactional
    public ProductDto createProduct(CreateProductRequest request) {
        Product product = Product.builder()
                .name(request.getName())
                .description(request.getDescription())
                .price(request.getPrice())
                .category(request.getCategory())
                .image(request.getImage())
                .stock(request.getStock())
                .featured(request.getFeatured())
                .build();

        productRepository.save(product);
        return mapToDto(product);
    }

    /**
     * Actualiza un producto existente (solo admin).
     */
    @Transactional
    public ProductDto updateProduct(Long id, UpdateProductRequest request) {
        Product product = productRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Producto", id));

        if (request.getName() != null) product.setName(request.getName());
        if (request.getDescription() != null) product.setDescription(request.getDescription());
        if (request.getPrice() != null) product.setPrice(request.getPrice());
        if (request.getCategory() != null) product.setCategory(request.getCategory());
        if (request.getImage() != null) product.setImage(request.getImage());
        if (request.getStock() != null) product.setStock(request.getStock());
        if (request.getFeatured() != null) product.setFeatured(request.getFeatured());

        productRepository.save(product);
        return mapToDto(product);
    }

    /**
     * Elimina un producto (solo admin).
     */
    @Transactional
    public void deleteProduct(Long id) {
        if (!productRepository.existsById(id)) {
            throw new ResourceNotFoundException("Producto", id);
        }
        productRepository.deleteById(id);
    }

    /**
     * Convierte Product a ProductDto.
     */
    private ProductDto mapToDto(Product product) {
        return ProductDto.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .category(product.getCategory())
                .image(product.getImage())
                .stock(product.getStock())
                .featured(product.getFeatured())
                .createdAt(product.getCreatedAt())
                .updatedAt(product.getUpdatedAt())
                .build();
    }
}
