package com.educadino.repository;

import com.educadino.entity.ContactMessage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

/**
 * Repositorio para la entidad ContactMessage.
 */
@Repository
public interface ContactMessageRepository extends JpaRepository<ContactMessage, Long> {

    List<ContactMessage> findByLeidoFalse();

    List<ContactMessage> findAllByOrderByCreatedAtDesc();
}
