package com.educadino.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import lombok.Data;

/**
 * DTO para añadir un producto al carrito.
 */
@Data
public class AddToCartRequest {

    @NotNull(message = "El ID del producto es obligatorio")
    private Long productId;

    @Positive(message = "La cantidad debe ser positiva")
    private Integer quantity = 1;
}
