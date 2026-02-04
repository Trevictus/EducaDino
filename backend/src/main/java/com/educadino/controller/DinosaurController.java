package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.service.DinosaurService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Dinosaurios
 *
 * Endpoints para consultar y gestionar información de dinosaurios.
 *
 * Base URL: /api/dinosaurs
 */
@RestController
@RequestMapping("/dinosaurs")
@RequiredArgsConstructor
@Tag(name = "Dinosaurios", description = "Información educativa sobre dinosaurios")
public class DinosaurController {

    private final DinosaurService dinosaurService;

    // ═══════════════════════════════════════════════════════════════
    // ENDPOINTS PÚBLICOS (sin autenticación)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Obtiene todos los dinosaurios.
     *
     * GET /api/dinosaurs
     */
    @GetMapping
    @Operation(summary = "Listar dinosaurios", description = "Obtiene todos los dinosaurios")
    public ResponseEntity<ApiResponse<List<DinosaurDto>>> getAllDinosaurs() {
        return ResponseEntity.ok(ApiResponse.success(dinosaurService.getAllDinosaurs()));
    }

    /**
     * Obtiene un dinosaurio por ID.
     *
     * GET /api/dinosaurs/{id}
     */
    @GetMapping("/{id}")
    @Operation(summary = "Obtener dinosaurio", description = "Obtiene un dinosaurio por su ID")
    public ResponseEntity<ApiResponse<DinosaurDto>> getDinosaurById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(dinosaurService.getDinosaurById(id)));
    }

    /**
     * Busca dinosaurios por nombre.
     *
     * GET /api/dinosaurs/search?name=rex
     */
    @GetMapping("/search")
    @Operation(summary = "Buscar por nombre", description = "Busca dinosaurios que contengan el texto en su nombre")
    public ResponseEntity<ApiResponse<List<DinosaurDto>>> searchByName(@RequestParam String name) {
        return ResponseEntity.ok(ApiResponse.success(dinosaurService.searchByName(name)));
    }

    /**
     * Filtra dinosaurios por dieta.
     *
     * GET /api/dinosaurs/diet/{diet}
     */
    @GetMapping("/diet/{diet}")
    @Operation(summary = "Filtrar por dieta", description = "Obtiene dinosaurios por tipo de dieta")
    public ResponseEntity<ApiResponse<List<DinosaurDto>>> getByDiet(@PathVariable String diet) {
        return ResponseEntity.ok(ApiResponse.success(dinosaurService.getByDiet(diet)));
    }

    /**
     * Filtra dinosaurios por período.
     *
     * GET /api/dinosaurs/period/{period}
     */
    @GetMapping("/period/{period}")
    @Operation(summary = "Filtrar por período", description = "Obtiene dinosaurios por período geológico")
    public ResponseEntity<ApiResponse<List<DinosaurDto>>> getByPeriod(@PathVariable String period) {
        return ResponseEntity.ok(ApiResponse.success(dinosaurService.getByPeriod(period)));
    }

    // ═══════════════════════════════════════════════════════════════
    // ENDPOINTS DE ADMIN (requieren autenticación)
    // ═══════════════════════════════════════════════════════════════

    /**
     * Crea un nuevo dinosaurio (solo admin).
     *
     * POST /api/dinosaurs
     */
    @PostMapping
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Crear dinosaurio", description = "Crea un nuevo dinosaurio (solo admin)")
    public ResponseEntity<ApiResponse<DinosaurDto>> createDinosaur(@Valid @RequestBody DinosaurRequest request) {
        DinosaurDto created = dinosaurService.createDinosaur(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(created, "Dinosaurio creado correctamente"));
    }

    /**
     * Actualiza un dinosaurio existente (solo admin).
     *
     * PUT /api/dinosaurs/{id}
     */
    @PutMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Actualizar dinosaurio", description = "Actualiza un dinosaurio existente (solo admin)")
    public ResponseEntity<ApiResponse<DinosaurDto>> updateDinosaur(
            @PathVariable Long id,
            @RequestBody DinosaurRequest request
    ) {
        return ResponseEntity.ok(ApiResponse.success(dinosaurService.updateDinosaur(id, request)));
    }

    /**
     * Elimina un dinosaurio (solo admin).
     *
     * DELETE /api/dinosaurs/{id}
     */
    @DeleteMapping("/{id}")
    @SecurityRequirement(name = "bearerAuth")
    @Operation(summary = "Eliminar dinosaurio", description = "Elimina un dinosaurio (solo admin)")
    public ResponseEntity<ApiResponse<Void>> deleteDinosaur(@PathVariable Long id) {
        dinosaurService.deleteDinosaur(id);
        return ResponseEntity.ok(ApiResponse.success(null, "Dinosaurio eliminado correctamente"));
    }
}
