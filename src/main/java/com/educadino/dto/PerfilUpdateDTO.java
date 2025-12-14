package com.educadino.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar un perfil
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilUpdateDTO {

    @NotBlank(message = "El avatar no puede estar vacío")
    private String avatar;

    @NotBlank(message = "El nivel no puede estar vacío")
    private String nivel;

    @PositiveOrZero(message = "Los puntos no pueden ser negativos")
    private Integer puntos;
}

