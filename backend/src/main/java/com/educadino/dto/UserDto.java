package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * DTO para información del usuario (perfil).
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserDto {

    private Long id;
    private String username;
    private String email;
    private String role;
    private String ageRange;
    private String profileImage;
    private Integer level;
    private Integer learningTime;
    private Integer completedMinigames;
    private Integer totalScore;
}
