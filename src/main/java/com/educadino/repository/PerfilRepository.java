package com.educadino.repository;

import com.educadino.entity.Perfil;
import com.educadino.entity.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Perfil
 */
@Repository
public interface PerfilRepository extends JpaRepository<Perfil, Long> {

    /**
     * Busca el perfil de un usuario específico
     * @param usuario el usuario cuyo perfil se busca
     * @return Optional con el perfil si existe
     */
    Optional<Perfil> findByUsuario(Usuario usuario);

    /**
     * Busca perfiles por nivel
     * @param nivel el nivel educativo
     * @return lista de perfiles con ese nivel
     */
    List<Perfil> findByNivel(String nivel);

    /**
     * Busca perfiles con puntos mayores o iguales a los especificados (para rankings)
     * @param puntos el mínimo de puntos
     * @return lista de perfiles ordenada por puntos descendentes
     */
    @Query("SELECT p FROM Perfil p WHERE p.puntos >= :puntos ORDER BY p.puntos DESC")
    List<Perfil> findTopPerfil(@Param("puntos") Integer puntos);

    /**
     * Obtiene el ranking top 10 de usuarios por puntos
     * @return lista de los 10 mejores perfiles
     */
    @Query(value = "SELECT * FROM perfiles ORDER BY puntos DESC LIMIT 10", nativeQuery = true)
    List<Perfil> findTop10ByPuntos();

    /**
     * Busca perfiles de un nivel específico ordenados por puntos
     * @param nivel el nivel educativo
     * @return lista de perfiles de ese nivel ordenada por puntos
     */
    @Query("SELECT p FROM Perfil p WHERE p.nivel = :nivel ORDER BY p.puntos DESC")
    List<Perfil> findByNivelOrderByPuntos(@Param("nivel") String nivel);

    /**
     * Cuenta el total de perfiles
     * @return número total de perfiles
     */
    long count();
}

