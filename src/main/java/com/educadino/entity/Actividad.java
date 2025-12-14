package com.educadino.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Actividad - Juegos y actividades educativas sobre dinosaurios
 */
@Entity
@Table(name = "actividades")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Actividad {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idActividad;

    @NotBlank(message = "El título no puede estar vacío")
    @Column(nullable = false)
    private String titulo;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoActividad tipo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private NivelDificultad nivelDificultad;

    /**
     * Enumeración para el tipo de actividad
     */
    public enum TipoActividad {
        QUIZ, MEMORIA, ARRASTRA_Y_SUELTA, VERDADERO_FALSO, MATCHING
    }

    /**
     * Enumeración para el nivel de dificultad
     */
    public enum NivelDificultad {
        FACIL, MEDIO, DIFICIL
    }
}

