package com.educadino.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.Data;

/**
 * DTO para registrar progreso en un minijuego.
 */
@Data
public class SaveProgressRequest {

    @NotBlank(message = "El tipo de minijuego es obligatorio")
    private String minigameType;

    @NotNull(message = "La puntuación es obligatoria")
    @PositiveOrZero(message = "La puntuación debe ser positiva o cero")
    private Integer score;

    @NotNull(message = "El tiempo jugado es obligatorio")
    @PositiveOrZero(message = "El tiempo debe ser positivo o cero")
    private Integer timePlayed;

    private Boolean completed = false;
}
