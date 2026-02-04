package com.educadino.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * Entidad Dinosaurio
 *
 * Almacena información educativa sobre dinosaurios
 * que se muestra en la aplicación.
 */
@Entity
@Table(name = "dinosaurs")
@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class Dinosaur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 100)
    private String name;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Column(length = 50)
    private String diet;  // Carnívoro, Herbívoro, Omnívoro

    @Column(length = 100)
    private String period;  // Triásico, Jurásico, Cretácico

    @Column(length = 100)
    private String taxonomy;  // Theropoda, Sauropoda, etc.

    @Column(length = 100)
    private String family;  // Tyrannosauridae, etc.

    @Column(length = 255)
    private String imageUrl;

    @Column(length = 100)
    private String size;  // Pequeño, Mediano, Grande, Gigante

    @Column(length = 200)
    private String location;  // Ubicación geográfica de fósiles

    @Column(columnDefinition = "TEXT")
    private String curiosities;  // Datos curiosos

    @Column(nullable = false, updatable = false)
    private LocalDateTime createdAt;

    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
        updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        updatedAt = LocalDateTime.now();
    }
}
