package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.entity.Sugerencia;
import com.educadino.entity.User;
import com.educadino.service.SugerenciaService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Sugerencia
 *
 * Endpoints para el formulario de contacto.
 *
 * Base URL: /api/contact
 */
@RestController
@RequestMapping("/sugerencias")
@RequiredArgsConstructor
@Tag(name = "Sugenrencia", description = "Formulario de contacto")
public class SugerenciaController {

  private final SugerenciaService sugerenciaService;

  /**
   * Envía un mensaje de contacto (público).
   *
   * POST /api/contact
   *
   * Body: { "nombre": "...", "email": "...", "asunto": "...", "mensaje": "..." }
   */
  @PostMapping
  @Operation(summary = "Enviar mensaje", description = "Envía un mensaje desde el formulario de contacto")
  @PreAuthorize("permitAll()")
  public ResponseEntity<Sugerencia> sendMessage(@AuthenticationPrincipal UserDetails userDetails, @RequestBody SugerenciaCreateRequest request) {
    String email = userDetails.getUsername();
    Sugerencia sugerencia = sugerenciaService.crear(email, request);
    return ResponseEntity.status(HttpStatus.CREATED).body(sugerencia);
  }
}
