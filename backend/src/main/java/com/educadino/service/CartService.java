package com.educadino.service;

import com.educadino.dto.*;
import com.educadino.entity.CartItem;
import com.educadino.entity.Product;
import com.educadino.entity.User;
import com.educadino.exception.BadRequestException;
import com.educadino.exception.ResourceNotFoundException;
import com.educadino.repository.CartItemRepository;
import com.educadino.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

/**
 * Servicio del Carrito de Compras
 *
 * Maneja las operaciones del carrito (simulado).
 */
@Service
@RequiredArgsConstructor
public class CartService {

    private final CartItemRepository cartItemRepository;
    private final ProductRepository productRepository;
    private final UserService userService;

    /**
     * Obtiene el carrito del usuario actual.
     */
    @Transactional(readOnly = true)
    public CartDto getCart() {
        User user = userService.getCurrentUser();
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());

        List<CartItemDto> itemDtos = items.stream()
                .map(this::mapToDto)
                .collect(Collectors.toList());

        BigDecimal total = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        int totalItems = items.stream()
                .mapToInt(CartItem::getQuantity)
                .sum();

        return CartDto.builder()
                .items(itemDtos)
                .totalItems(totalItems)
                .totalPrice(total)
                .build();
    }

    /**
     * Añade un producto al carrito.
     */
    @Transactional
    public CartDto addToCart(AddToCartRequest request) {
        User user = userService.getCurrentUser();

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new ResourceNotFoundException("Producto", request.getProductId()));

        // Verificar stock
        if (product.getStock() < request.getQuantity()) {
            throw new BadRequestException("No hay suficiente stock disponible");
        }

        // Buscar si ya existe el producto en el carrito
        var existingItem = cartItemRepository.findByUserIdAndProductId(user.getId(), product.getId());

        if (existingItem.isPresent()) {
            // Actualizar cantidad
            CartItem item = existingItem.get();
            int newQuantity = item.getQuantity() + request.getQuantity();

            if (product.getStock() < newQuantity) {
                throw new BadRequestException("No hay suficiente stock disponible");
            }

            item.setQuantity(newQuantity);
            cartItemRepository.save(item);
        } else {
            // Crear nuevo item
            CartItem item = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(request.getQuantity())
                    .build();
            cartItemRepository.save(item);
        }

        return getCart();
    }

    /**
     * Actualiza la cantidad de un producto en el carrito.
     */
    @Transactional
    public CartDto updateQuantity(Long productId, int quantity) {
        User user = userService.getCurrentUser();

        if (quantity <= 0) {
            return removeFromCart(productId);
        }

        CartItem item = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new ResourceNotFoundException("Item no encontrado en el carrito"));

        if (item.getProduct().getStock() < quantity) {
            throw new BadRequestException("No hay suficiente stock disponible");
        }

        item.setQuantity(quantity);
        cartItemRepository.save(item);

        return getCart();
    }

    /**
     * Elimina un producto del carrito.
     */
    @Transactional
    public CartDto removeFromCart(Long productId) {
        User user = userService.getCurrentUser();
        cartItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
        return getCart();
    }

    /**
     * Vacía el carrito completo.
     */
    @Transactional
    public CartDto clearCart() {
        User user = userService.getCurrentUser();
        cartItemRepository.deleteByUserId(user.getId());
        return CartDto.builder()
                .items(List.of())
                .totalItems(0)
                .totalPrice(BigDecimal.ZERO)
                .build();
    }

    /**
     * Simula el checkout del carrito.
     */
    @Transactional
    public ApiResponse<String> checkout() {
        User user = userService.getCurrentUser();
        List<CartItem> items = cartItemRepository.findByUserId(user.getId());

        if (items.isEmpty()) {
            throw new BadRequestException("El carrito está vacío");
        }

        // Simular la compra (en una app real, aquí iría el procesamiento de pago)
        BigDecimal total = items.stream()
                .map(item -> item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // Vaciar el carrito
        cartItemRepository.deleteByUserId(user.getId());

        return ApiResponse.success(
                "Pedido completado",
                "¡Compra simulada exitosa! Total: €" + total
        );
    }

    /**
     * Convierte CartItem a CartItemDto.
     */
    private CartItemDto mapToDto(CartItem item) {
        return CartItemDto.builder()
                .id(item.getId())
                .productId(item.getProduct().getId())
                .productName(item.getProduct().getName())
                .productImage(item.getProduct().getImage())
                .productPrice(item.getProduct().getPrice())
                .quantity(item.getQuantity())
                .subtotal(item.getProduct().getPrice().multiply(BigDecimal.valueOf(item.getQuantity())))
                .build();
    }
}
