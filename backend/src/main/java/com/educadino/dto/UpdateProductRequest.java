package com.educadino.dto;

import lombok.Data;

import java.math.BigDecimal;

/**
 * DTO para actualizar un producto existente.
 * Todos los campos son opcionales.
 */
@Data
public class UpdateProductRequest {

    private String name;
    private String description;
    private BigDecimal price;
    private String category;
    private String image;
    private Integer stock;
    private Boolean featured;
}
