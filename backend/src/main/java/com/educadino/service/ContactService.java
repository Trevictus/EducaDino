package com.educadino.service;

import com.educadino.dto.ApiResponse;
import com.educadino.dto.ContactMessageRequest;
import com.educadino.entity.ContactMessage;
import com.educadino.exception.ResourceNotFoundException;
import com.educadino.repository.ContactMessageRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * Servicio de Mensajes de Contacto
 */
@Service
@RequiredArgsConstructor
public class ContactService {

    private final ContactMessageRepository contactRepository;

    /**
     * Guarda un nuevo mensaje de contacto.
     */
    @Transactional
    public ApiResponse<Void> saveMessage(ContactMessageRequest request) {
        ContactMessage message = ContactMessage.builder()
                .nombre(request.getNombre())
                .email(request.getEmail())
                .asunto(request.getAsunto())
                .mensaje(request.getMensaje())
                .leido(false)
                .build();

        contactRepository.save(message);

        return ApiResponse.success(null, "Mensaje enviado correctamente. ¡Gracias por contactarnos!");
    }

    /**
     * Obtiene todos los mensajes (solo admin).
     */
    @Transactional(readOnly = true)
    public List<ContactMessage> getAllMessages() {
        return contactRepository.findAllByOrderByCreatedAtDesc();
    }

    /**
     * Obtiene mensajes no leídos (solo admin).
     */
    @Transactional(readOnly = true)
    public List<ContactMessage> getUnreadMessages() {
        return contactRepository.findByLeidoFalse();
    }

    /**
     * Marca un mensaje como leído (solo admin).
     */
    @Transactional
    public void markAsRead(Long id) {
        ContactMessage message = contactRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Mensaje", id));
        message.setLeido(true);
        contactRepository.save(message);
    }

    /**
     * Elimina un mensaje (solo admin).
     */
    @Transactional
    public void deleteMessage(Long id) {
        if (!contactRepository.existsById(id)) {
            throw new ResourceNotFoundException("Mensaje", id);
        }
        contactRepository.deleteById(id);
    }
}
