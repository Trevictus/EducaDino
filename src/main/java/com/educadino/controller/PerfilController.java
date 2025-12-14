package com.educadino.controller;

import com.educadino.dto.PerfilCreateDTO;
import com.educadino.dto.PerfilResponseDTO;
import com.educadino.dto.PerfilUpdateDTO;
import com.educadino.service.PerfilService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador para la gestión de perfiles
 * Endpoints: /api/perfiles
 */
@RestController
@RequestMapping("/api/perfiles")
@RequiredArgsConstructor
@CrossOrigin(origins = "*", maxAge = 3600)
public class PerfilController {

    private final PerfilService perfilService;

    /**
     * GET /api/perfiles
     * Obtiene todos los perfiles
     */
    @GetMapping
    public ResponseEntity<List<PerfilResponseDTO>> obtenerTodos() {
        List<PerfilResponseDTO> perfiles = perfilService.obtenerTodos();
        return ResponseEntity.ok(perfiles);
    }

    /**
     * GET /api/perfiles/{id}
     * Obtiene un perfil por ID
     */
    @GetMapping("/{id}")
    public ResponseEntity<PerfilResponseDTO> obtenerPorId(@PathVariable Long id) {
        PerfilResponseDTO perfil = perfilService.obtenerPorId(id);
        return ResponseEntity.ok(perfil);
    }

    /**
     * GET /api/perfiles/usuario/{idUsuario}
     * Obtiene el perfil de un usuario
     */
    @GetMapping("/usuario/{idUsuario}")
    public ResponseEntity<PerfilResponseDTO> obtenerPorIdUsuario(@PathVariable Long idUsuario) {
        PerfilResponseDTO perfil = perfilService.obtenerPorIdUsuario(idUsuario);
        return ResponseEntity.ok(perfil);
    }

    /**
     * POST /api/perfiles/{idUsuario}
     * Crea un nuevo perfil para un usuario
     */
    @PostMapping("/{idUsuario}")
    public ResponseEntity<PerfilResponseDTO> crear(
            @PathVariable Long idUsuario,
            @Valid @RequestBody PerfilCreateDTO createDTO) {
        PerfilResponseDTO perfilCreado = perfilService.crear(idUsuario, createDTO);
        return ResponseEntity.status(HttpStatus.CREATED).body(perfilCreado);
    }

    /**
     * PUT /api/perfiles/{id}
     * Actualiza un perfil existente
     */
    @PutMapping("/{id}")
    public ResponseEntity<PerfilResponseDTO> actualizar(
            @PathVariable Long id,
            @Valid @RequestBody PerfilUpdateDTO updateDTO) {
        PerfilResponseDTO perfilActualizado = perfilService.actualizar(id, updateDTO);
        return ResponseEntity.ok(perfilActualizado);
    }

    /**
     * DELETE /api/perfiles/{id}
     * Elimina un perfil
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> eliminar(@PathVariable Long id) {
        perfilService.eliminar(id);
        return ResponseEntity.noContent().build();
    }

    /**
     * GET /api/perfiles/nivel/{nivel}
     * Obtiene perfiles por nivel
     */
    @GetMapping("/nivel/{nivel}")
    public ResponseEntity<List<PerfilResponseDTO>> obtenerPorNivel(@PathVariable String nivel) {
        List<PerfilResponseDTO> perfiles = perfilService.obtenerPorNivel(nivel);
        return ResponseEntity.ok(perfiles);
    }

    /**
     * GET /api/perfiles/ranking/top10
     * Obtiene el top 10 de perfiles por puntos
     */
    @GetMapping("/ranking/top10")
    public ResponseEntity<List<PerfilResponseDTO>> obtenerTop10() {
        List<PerfilResponseDTO> perfiles = perfilService.obtenerTop10();
        return ResponseEntity.ok(perfiles);
    }

    /**
     * GET /api/perfiles/nivel/{nivel}/ranking
     * Obtiene perfiles de un nivel ordenados por puntos
     */
    @GetMapping("/nivel/{nivel}/ranking")
    public ResponseEntity<List<PerfilResponseDTO>> obtenerPorNivelOrdenado(@PathVariable String nivel) {
        List<PerfilResponseDTO> perfiles = perfilService.obtenerPorNivelOrdenado(nivel);
        return ResponseEntity.ok(perfiles);
    }

    /**
     * POST /api/perfiles/{id}/puntos/{puntos}
     * Incrementa los puntos de un perfil
     */
    @PostMapping("/{id}/puntos/{puntos}")
    public ResponseEntity<PerfilResponseDTO> incrementarPuntos(
            @PathVariable Long id,
            @PathVariable Integer puntos) {
        PerfilResponseDTO perfilActualizado = perfilService.incrementarPuntos(id, puntos);
        return ResponseEntity.ok(perfilActualizado);
    }
}

