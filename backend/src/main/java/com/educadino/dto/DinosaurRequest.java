package com.educadino.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

/**
 * DTO para crear/actualizar un dinosaurio.
 */
@Data
public class DinosaurRequest {

    @NotBlank(message = "El nombre es obligatorio")
    private String name;

    private String description;
    private String diet;
    private String period;
    private String taxonomy;
    private String family;
    private String imageUrl;
    private String size;
    private String location;
    private String curiosities;
}
