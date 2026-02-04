package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.util.List;

/**
 * DTO para representar el carrito completo de un usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class CartDto {

    private List<CartItemDto> items;
    private Integer totalItems;
    private BigDecimal totalPrice;
}
