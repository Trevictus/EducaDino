package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de Dinosaurio.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class DinosaurDto {

    private Long id;
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
    private LocalDateTime createdAt;
}
