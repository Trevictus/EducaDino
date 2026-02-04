package com.educadino.repository;

import com.educadino.entity.Dinosaur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad Dinosaur.
 */
@Repository
public interface DinosaurRepository extends JpaRepository<Dinosaur, Long> {

    List<Dinosaur> findByDiet(String diet);

    List<Dinosaur> findByPeriod(String period);

    List<Dinosaur> findByTaxonomy(String taxonomy);

    List<Dinosaur> findByNameContainingIgnoreCase(String name);
}
