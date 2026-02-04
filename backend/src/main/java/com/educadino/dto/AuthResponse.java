package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para respuesta de autenticación.
 * Contiene el token JWT y datos del usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class AuthResponse {

    private boolean success;
    private String token;
    private String username;
    private String email;
    private String role;
    private String profileImage;
    private Integer level;
    private Integer learningTime;
    private Integer completedMinigames;
    private Integer totalScore;
    private String message;
}
