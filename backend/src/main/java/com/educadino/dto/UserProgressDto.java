package com.educadino.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

/**
 * DTO para transferencia de datos de Progreso del Usuario.
 */
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgressDto {

  private Long id;
  private Long userId;
  private String minigameType;
  private Integer score;
  private Integer timePlayed;
  private Boolean completed;
  private LocalDateTime playedAt;
}
