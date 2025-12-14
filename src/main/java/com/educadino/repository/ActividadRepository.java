package com.educadino.repository;

import com.educadino.entity.Actividad;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Actividad
 */
@Repository
public interface ActividadRepository extends JpaRepository<Actividad, Long> {

    /**
     * Busca actividades por tipo
     * @param tipo el tipo de actividad
     * @return lista de actividades de ese tipo
     */
    List<Actividad> findByTipo(Actividad.TipoActividad tipo);

    /**
     * Busca actividades por nivel de dificultad
     * @param nivelDificultad el nivel de dificultad
     * @return lista de actividades de ese nivel
     */
    List<Actividad> findByNivelDificultad(Actividad.NivelDificultad nivelDificultad);

    /**
     * Busca actividades cuyo título o descripción contengan el texto proporcionado
     * @param busqueda el texto a buscar
     * @return lista de actividades que coinciden
     */
    @Query("SELECT a FROM Actividad a WHERE LOWER(a.titulo) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +
           "OR LOWER(a.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Actividad> buscarPorTituloODescripcion(@Param("busqueda") String busqueda);

    /**
     * Obtiene todas las actividades de tipo quiz
     * @return lista de actividades de quiz
     */
    @Query("SELECT a FROM Actividad a WHERE a.tipo = 'QUIZ'")
    List<Actividad> findAllQuiz();

    /**
     * Obtiene todas las actividades de tipo memoria
     * @return lista de actividades de memoria
     */
    @Query("SELECT a FROM Actividad a WHERE a.tipo = 'MEMORIA'")
    List<Actividad> findAllMemoria();

    /**
     * Obtiene todas las actividades fáciles
     * @return lista de actividades de nivel fácil
     */
    @Query("SELECT a FROM Actividad a WHERE a.nivelDificultad = 'FACIL'")
    List<Actividad> findAllFacil();

    /**
     * Obtiene todas las actividades de dificultad media
     * @return lista de actividades de nivel medio
     */
    @Query("SELECT a FROM Actividad a WHERE a.nivelDificultad = 'MEDIO'")
    List<Actividad> findAllMedio();

    /**
     * Obtiene todas las actividades difíciles
     * @return lista de actividades de nivel difícil
     */
    @Query("SELECT a FROM Actividad a WHERE a.nivelDificultad = 'DIFICIL'")
    List<Actividad> findAllDificil();

    /**
     * Obtiene actividades de un tipo y nivel específicos
     * @param tipo el tipo de actividad
     * @param nivelDificultad el nivel de dificultad
     * @return lista de actividades que cumplen ambas condiciones
     */
    @Query("SELECT a FROM Actividad a WHERE a.tipo = :tipo AND a.nivelDificultad = :nivel")
    List<Actividad> findByTipoAndNivel(@Param("tipo") Actividad.TipoActividad tipo,
                                       @Param("nivel") Actividad.NivelDificultad nivelDificultad);

    /**
     * Cuenta el total de actividades
     * @return número total de actividades
     */
    long countActividades();
}

