package com.educadino.repository;

import com.educadino.entity.Product;
import com.educadino.entity.Sugerencia;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.util.List;

/**
 * Repositorio para la entidad Product.
 */
@Repository
public interface SugerenciaRepository extends JpaRepository<Sugerencia, Long> {

}
