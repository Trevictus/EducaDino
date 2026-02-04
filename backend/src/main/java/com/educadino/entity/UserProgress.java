package com.educadino.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad Progreso de Usuario
 *
 * Registra el progreso del usuario en cada minijuego.
 * Se sincroniza con el perfil del frontend.
 */
@Entity
@Table(name = "user_progress")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class UserProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(nullable = false, length = 50)
    private String minigameType;  // dino-ride, dino-throw, quiz, etc.

    @Column(nullable = false)
    private Integer score;

    @Column(nullable = false)
    private Integer timePlayed;  // en segundos

    @Builder.Default
    private Boolean completed = false;

    @Column(nullable = false, updatable = false)
    private LocalDateTime playedAt;

    @PrePersist
    protected void onCreate() {
        playedAt = LocalDateTime.now();
    }
}
