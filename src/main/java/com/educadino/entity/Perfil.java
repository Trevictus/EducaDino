package com.educadino.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.PositiveOrZero;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.ToString;

/**
 * Entidad Perfil - Enriquece la experiencia del usuario con datos personalizados
 */
@Entity
@Table(name = "perfiles")
@Data
@NoArgsConstructor
@AllArgsConstructor
@ToString(exclude = {"usuario"})
public class Perfil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPerfil;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "id_usuario", nullable = false)
    private Usuario usuario;

    @NotBlank(message = "El avatar no puede estar vacío")
    @Column(nullable = false)
    private String avatar;

    @NotBlank(message = "El nivel no puede estar vacío")
    @Column(nullable = false)
    private String nivel;

    @PositiveOrZero(message = "Los puntos no pueden ser negativos")
    @Column(nullable = false)
    private Integer puntos;

    public Perfil(Usuario usuario, String avatar, String nivel) {
        this.usuario = usuario;
        this.avatar = avatar;
        this.nivel = nivel;
        this.puntos = 0;
    }
}

