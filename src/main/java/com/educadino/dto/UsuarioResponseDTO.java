package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para responder con datos del usuario (sin contraseña)
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UsuarioResponseDTO {

    private Long idUsuario;
    private String nombre;
    private String apellido;
    private String email;
    private String rol;
    private LocalDateTime fechaCreacion;
    private LocalDateTime fechaActualizacion;
    private PerfilResponseDTO perfil;
}

