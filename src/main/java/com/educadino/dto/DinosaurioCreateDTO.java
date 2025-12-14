package com.educadino.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para crear un dinosaurio
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class DinosaurioCreateDTO {

    @NotBlank(message = "El nombre del dinosaurio no puede estar vacío")
    private String nombre;

    @NotBlank(message = "La época no puede estar vacía")
    private String epoca;

    @NotBlank(message = "El tipo de alimentación no puede estar vacío")
    private String alimentacion;

    private String descripcion;

    @NotBlank(message = "La imagen no puede estar vacía")
    private String imagen;
}

