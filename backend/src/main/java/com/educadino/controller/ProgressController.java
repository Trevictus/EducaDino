package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.service.UserProgressService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

/**
 * Controlador de Progreso de Usuario
 *
 * Endpoints para registrar y consultar el progreso en minijuegos.
 *
 * Base URL: /api/progress
 */
@RestController
@RequestMapping("/progress")
@RequiredArgsConstructor
@Tag(name = "Progreso", description = "Progreso del usuario en minijuegos")
@SecurityRequirement(name = "bearerAuth")
public class ProgressController {

    private final UserProgressService progressService;

    /**
     * Guarda el progreso de un minijuego.
     *
     * POST /api/progress
     *
     * Body: { "minigameType": "dino-ride", "score": 100, "timePlayed": 60, "completed": true }
     */
    @PostMapping
    @Operation(summary = "Guardar progreso", description = "Registra el resultado de un minijuego")
    public ResponseEntity<ApiResponse<UserProgressDto>> saveProgress(@Valid @RequestBody SaveProgressRequest request) {
        UserProgressDto saved = progressService.saveProgress(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.success(saved, "Progreso guardado correctamente"));
    }

    /**
     * Obtiene todo el progreso del usuario.
     *
     * GET /api/progress
     */
    @GetMapping
    @Operation(summary = "Mi progreso", description = "Obtiene todo el historial de progreso del usuario")
    public ResponseEntity<ApiResponse<List<UserProgressDto>>> getMyProgress() {
        return ResponseEntity.ok(ApiResponse.success(progressService.getMyProgress()));
    }

    /**
     * Obtiene el progreso filtrado por tipo de minijuego.
     *
     * GET /api/progress/minigame/{type}
     */
    @GetMapping("/minigame/{type}")
    @Operation(summary = "Progreso por minijuego", description = "Obtiene el progreso en un minijuego específico")
    public ResponseEntity<ApiResponse<List<UserProgressDto>>> getProgressByMinigame(@PathVariable String type) {
        return ResponseEntity.ok(ApiResponse.success(progressService.getProgressByMinigame(type)));
    }

    /**
     * Obtiene las estadísticas resumidas del usuario.
     *
     * GET /api/progress/stats
     *
     * Response: { "totalScore": 1500, "totalTimePlayed": 3600, "completedMinigames": 5, ... }
     */
    @GetMapping("/stats")
    @Operation(summary = "Estadísticas", description = "Obtiene estadísticas resumidas del progreso")
    public ResponseEntity<ApiResponse<Map<String, Object>>> getStats() {
        return ResponseEntity.ok(ApiResponse.success(progressService.getStats()));
    }
}
