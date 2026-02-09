package com.educadino.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de Producto.
 * Compatible con el frontend Angular.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class SugerenciaCreateRequest {

  @NotBlank private String title;
 @NotBlank private String message;

}
