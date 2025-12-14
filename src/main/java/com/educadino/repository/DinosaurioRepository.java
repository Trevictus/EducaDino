package com.educadino.repository;

import com.educadino.entity.Dinosaurio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad Dinosaurio
 */
@Repository
public interface DinosaurioRepository extends JpaRepository<Dinosaurio, Long> {

    /**
     * Busca un dinosaurio por su nombre
     * @param nombre el nombre del dinosaurio
     * @return Optional con el dinosaurio si existe
     */
    Optional<Dinosaurio> findByNombre(String nombre);

    /**
     * Verifica si un nombre de dinosaurio ya existe
     * @param nombre el nombre a verificar
     * @return true si existe, false en caso contrario
     */
    boolean existsByNombre(String nombre);

    /**
     * Busca dinosaurios por época
     * @param epoca la época geológica (ej. Jurásico, Cretácico)
     * @return lista de dinosaurios de esa época
     */
    List<Dinosaurio> findByEpoca(String epoca);

    /**
     * Busca dinosaurios por tipo de alimentación
     * @param alimentacion el tipo de alimentación
     * @return lista de dinosaurios de ese tipo de alimentación
     */
    List<Dinosaurio> findByAlimentacion(Dinosaurio.TipoAlimentacion alimentacion);

    /**
     * Busca dinosaurios cuyo nombre o descripción contengan el texto proporcionado
     * @param busqueda el texto a buscar
     * @return lista de dinosaurios que coinciden
     */
    @Query("SELECT d FROM Dinosaurio d WHERE LOWER(d.nombre) LIKE LOWER(CONCAT('%', :busqueda, '%')) " +
           "OR LOWER(d.descripcion) LIKE LOWER(CONCAT('%', :busqueda, '%'))")
    List<Dinosaurio> buscarPorNombreODescripcion(@Param("busqueda") String busqueda);

    /**
     * Obtiene todos los dinosaurios herbívoros
     * @return lista de dinosaurios herbívoros
     */
    @Query("SELECT d FROM Dinosaurio d WHERE d.alimentacion = 'HERBIVORO'")
    List<Dinosaurio> findAllHerbivoros();

    /**
     * Obtiene todos los dinosaurios carnívoros
     * @return lista de dinosaurios carnívoros
     */
    @Query("SELECT d FROM Dinosaurio d WHERE d.alimentacion = 'CARNIVORO'")
    List<Dinosaurio> findAllCarnivoros();

    /**
     * Obtiene todos los dinosaurios omnívoros
     * @return lista de dinosaurios omnívoros
     */
    @Query("SELECT d FROM Dinosaurio d WHERE d.alimentacion = 'OMNIVORO'")
    List<Dinosaurio> findAllOmnivoros();

    /**
     * Cuenta el total de dinosaurios
     * @return número total de dinosaurios
     */
    long countDinosaurios();
}

