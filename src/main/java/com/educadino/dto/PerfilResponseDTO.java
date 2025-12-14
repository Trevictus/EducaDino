package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para responder con datos del perfil
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class PerfilResponseDTO {

    private Long idPerfil;
    private String avatar;
    private String nivel;
    private Integer puntos;
}

