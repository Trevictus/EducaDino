package com.educadino.dto;

import lombok.Data;

/**
 * DTO para actualizar el perfil de usuario.
 */
@Data
public class UpdateProfileRequest {

    private String username;
    private String email;
    private String ageRange;
    private String profileImage;
}
