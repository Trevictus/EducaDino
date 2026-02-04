package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.entity.ContactMessage;
import com.educadino.service.ContactService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Contacto
 *
 * Endpoints para el formulario de contacto.
 *
 * Base URL: /api/contact
 */
@RestController
@RequestMapping("/contact")
@RequiredArgsConstructor
@Tag(name = "Contacto", description = "Formulario de contacto")
public class ContactController {

    private final ContactService contactService;

    /**
     * Envía un mensaje de contacto (público).
     *
     * POST /api/contact
     *
     * Body: { "nombre": "...", "email": "...", "asunto": "...", "mensaje": "..." }
     */
    @PostMapping
    @Operation(summary = "Enviar mensaje", description = "Envía un mensaje desde el formulario de contacto")
    public ResponseEntity<ApiResponse<Void>> sendMessage(@Valid @RequestBody ContactMessageRequest request) {
        return ResponseEntity.status(HttpStatus.CREATED).body(contactService.saveMessage(request));
    }

    // ═══════════════════════════════════════════════════════════════
    // ENDPOINTS DE ADMIN
    // ═══════════════════════════════════════════════════════════════

    /**
     * Obtiene todos los mensajes (solo admin).
     *
     * GET /api/contact/all
     */
    @GetMapping("/all")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Listar mensajes", description = "Obtiene todos los mensajes de contacto (solo admin)")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getAllMessages() {
        return ResponseEntity.ok(ApiResponse.success(contactService.getAllMessages()));
    }

    /**
     * Obtiene mensajes no leídos (solo admin).
     *
     * GET /api/contact/unread
     */
    @GetMapping("/unread")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Mensajes no leídos", description = "Obtiene mensajes sin leer (solo admin)")
    public ResponseEntity<ApiResponse<List<ContactMessage>>> getUnreadMessages() {
        return ResponseEntity.ok(ApiResponse.success(contactService.getUnreadMessages()));
    }

    /**
     * Marca un mensaje como leído (solo admin).
     *
     * PUT /api/contact/{id}/read
     */
    @PutMapping("/{id}/read")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Marcar como leído", description = "Marca un mensaje como leído (solo admin)")
    public ResponseEntity<ApiResponse<Void>> markAsRead(@PathVariable Long id) {
        contactService.markAsRead(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Mensaje marcado como leído"));
    }

    /**
     * Elimina un mensaje (solo admin).
     *
     * DELETE /api/contact/{id}
     */
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar mensaje", description = "Elimina un mensaje de contacto (solo admin)")
    public ResponseEntity<ApiResponse<Void>> deleteMessage(@PathVariable Long id) {
        contactService.deleteMessage(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Mensaje eliminado"));
    }
}
