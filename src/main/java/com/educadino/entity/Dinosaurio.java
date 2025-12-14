package com.educadino.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * Entidad Dinosaurio - Contiene el contenido educativo sobre dinosaurios
 */
@Entity
@Table(name = "dinosaurios")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Dinosaurio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idDino;

    @NotBlank(message = "El nombre del dinosaurio no puede estar vacío")
    @Column(nullable = false, unique = true)
    private String nombre;

    @NotBlank(message = "La época no puede estar vacía")
    @Column(nullable = false)
    private String epoca;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private TipoAlimentacion alimentacion;

    @Column(columnDefinition = "TEXT")
    private String descripcion;

    @Column(nullable = false)
    private String imagen;

    /**
     * Enumeración para el tipo de alimentación
     */
    public enum TipoAlimentacion {
        HERBIVORO, CARNIVORO, OMNIVORO
    }
}

