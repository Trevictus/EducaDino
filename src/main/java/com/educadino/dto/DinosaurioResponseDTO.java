package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para responder con datos del dinosaurio
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DinosaurioResponseDTO {

    private Long idDino;
    private String nombre;
    private String epoca;
    private String alimentacion;
    private String descripcion;
    private String imagen;
}

