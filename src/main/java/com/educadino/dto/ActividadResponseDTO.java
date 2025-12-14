package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para responder con datos de la actividad
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class ActividadResponseDTO {

    private Long idActividad;
    private String titulo;
    private String descripcion;
    private String tipo;
    private String nivelDificultad;
}

