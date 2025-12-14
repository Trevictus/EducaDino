package com.educadino.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para actualizar una actividad
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActividadUpdateDTO {

    @NotBlank(message = "El título no puede estar vacío")
    private String titulo;

    private String descripcion;

    @NotBlank(message = "El tipo de actividad no puede estar vacío")
    private String tipo;

    @NotBlank(message = "El nivel de dificultad no puede estar vacío")
    private String nivelDificultad;
}

