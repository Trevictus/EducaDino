package com.educadino.repository;

import com.educadino.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

/**
 * Repositorio para la entidad CartItem.
 */
@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {

    List<CartItem> findByUserId(Long userId);

    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    void deleteByUserId(Long userId);

    void deleteByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT COUNT(ci) FROM CartItem ci WHERE ci.user.id = :userId")
    Integer countItemsByUserId(@Param("userId") Long userId);

    @Query("SELECT SUM(ci.quantity * ci.product.price) FROM CartItem ci WHERE ci.user.id = :userId")
    Double getTotalByUserId(@Param("userId") Long userId);
}
