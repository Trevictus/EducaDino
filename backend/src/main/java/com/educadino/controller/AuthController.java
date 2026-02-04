package com.educadino.controller;

import com.educadino.dto.*;
import com.educadino.service.AuthService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

/**
 * Controlador de Autenticación
 *
 * Endpoints públicos para login, registro y reset de contraseña.
 *
 * Base URL: /api/auth
 */
@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
@Tag(name = "Autenticación", description = "Endpoints de login, registro y reset de contraseña")
public class AuthController {

    private final AuthService authService;

    /**
     * Login de usuario.
     *
     * POST /api/auth/login
     *
     * Body: { "username": "...", "password": "..." }
     * Response: { "success": true, "token": "...", "username": "...", ... }
     */
    @PostMapping("/login")
    @Operation(summary = "Iniciar sesión", description = "Autentica un usuario y devuelve un token JWT")
    public ResponseEntity<AuthResponse> login(@Valid @RequestBody LoginRequest request) {
        return ResponseEntity.ok(authService.login(request));
    }

    /**
     * Registro de nuevo usuario.
     *
     * POST /api/auth/register
     *
     * Body: { "username": "...", "email": "...", "password": "...", "ageRange": "..." }
     * Response: { "success": true, "token": "...", "username": "...", ... }
     */
    @PostMapping("/register")
    @Operation(summary = "Registrar usuario", description = "Crea una nueva cuenta de usuario")
    public ResponseEntity<AuthResponse> register(@Valid @RequestBody RegisterRequest request) {
        return ResponseEntity.ok(authService.register(request));
    }

    /**
     * Resetear contraseña.
     *
     * POST /api/auth/reset-password
     *
     * Body: { "email": "...", "newPassword": "..." }
     * Response: { "success": true, "message": "Contraseña actualizada" }
     */
    @PostMapping("/reset-password")
    @Operation(summary = "Resetear contraseña", description = "Cambia la contraseña de un usuario por su email")
    public ResponseEntity<ApiResponse<Void>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        return ResponseEntity.ok(authService.resetPassword(request));
    }
}
