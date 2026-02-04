package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.service.UserService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.security.SecurityRequirement;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Controlador de Usuarios
 *
 * Endpoints para gestión del perfil y administración de usuarios.
 *
 * Base URL: /api/users
 */
@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
@Tag(name = "Usuarios", description = "Gestión de perfil y usuarios")
@SecurityRequirement(name = "bearerAuth")
public class UserController {

    private final UserService userService;

    /**
     * Obtiene el perfil del usuario autenticado.
     *
     * GET /api/users/me
     */
    @GetMapping("/me")
    @Operation(summary = "Mi perfil", description = "Obtiene los datos del usuario autenticado")
    public ResponseEntity<ApiResponse<UserDto>> getProfile() {
        return ResponseEntity.ok(ApiResponse.success(userService.getProfile()));
    }

    /**
     * Actualiza el perfil del usuario autenticado.
     *
     * PUT /api/users/me
     */
    @PutMapping("/me")
    @Operation(summary = "Actualizar perfil", description = "Actualiza los datos del usuario autenticado")
    public ResponseEntity<ApiResponse<UserDto>> updateProfile(@RequestBody UpdateProfileRequest request) {
        return ResponseEntity.ok(ApiResponse.success(userService.updateProfile(request)));
    }

    /**
     * Añade tiempo de aprendizaje al usuario.
     *
     * POST /api/users/me/learning-time
     */
    @PostMapping("/me/learning-time")
    @Operation(summary = "Añadir tiempo de aprendizaje", description = "Incrementa el tiempo de aprendizaje del usuario")
    public ResponseEntity<ApiResponse<Void>> addLearningTime(@RequestParam int minutes) {
        userService.addLearningTime(minutes);
        return ResponseEntity.ok(ApiResponse.success(null, "Tiempo de aprendizaje actualizado"));
    }

    // ═══════════════════════════════════════════════════════════════
    // ENDPOINTS DE ADMIN
    // ═══════════════════════════════════════════════════════════════

    /**
     * Obtiene todos los usuarios (solo admin).
     *
     * GET /api/users
     */
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Listar usuarios", description = "Obtiene todos los usuarios (solo admin)")
    public ResponseEntity<ApiResponse<List<UserDto>>> getAllUsers() {
        return ResponseEntity.ok(ApiResponse.success(userService.getAllUsers()));
    }

    /**
     * Obtiene un usuario por ID (solo admin).
     *
     * GET /api/users/{id}
     */
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    @Operation(summary = "Obtener usuario", description = "Obtiene un usuario por su ID (solo admin)")
    public ResponseEntity<ApiResponse<UserDto>> getUserById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.success(userService.getUserById(id)));
    }
}
