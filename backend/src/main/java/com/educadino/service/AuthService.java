package com.educadino.service;

import com.educadino.dto.*;
import com.educadino.entity.Role;
import com.educadino.entity.User;
import com.educadino.exception.BadRequestException;
import com.educadino.repository.UserRepository;
import com.educadino.security.JwtTokenProvider;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

/**
 * Servicio de Autenticación
 *
 * Maneja login, registro y reset de contraseña.
 */
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;
    private final AuthenticationManager authenticationManager;

    /**
     * Autentica un usuario y devuelve un token JWT.
     */
    @Transactional(readOnly = true)
    public AuthResponse login(LoginRequest request) {
        // Autenticar con Spring Security
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        request.getUsername(),
                        request.getPassword()
                )
        );

        // Generar token JWT
        String token = jwtTokenProvider.generateToken(authentication);

        // Obtener datos del usuario
        User user = userRepository.findByUsername(request.getUsername())
                .orElseThrow();

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .profileImage(user.getProfileImage())
                .level(user.getLevel())
                .learningTime(user.getLearningTime())
                .completedMinigames(user.getCompletedMinigames())
                .totalScore(user.getTotalScore())
                .message("Login exitoso")
                .build();
    }

    /**
     * Registra un nuevo usuario.
     */
    @Transactional
    public AuthResponse register(RegisterRequest request) {
        // Validar que el username no exista
        if (userRepository.existsByUsername(request.getUsername())) {
            throw new BadRequestException("El nombre de usuario ya está en uso");
        }

        // Validar que el email no exista
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new BadRequestException("El email ya está registrado");
        }

        // Crear nuevo usuario
        User user = User.builder()
                .username(request.getUsername())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .role(Role.USER)
                .ageRange(request.getAgeRange())
                .level(1)
                .learningTime(0)
                .completedMinigames(0)
                .totalScore(0)
                .build();

        userRepository.save(user);

        // Generar token para el nuevo usuario
        String token = jwtTokenProvider.generateToken(user.getUsername());

        return AuthResponse.builder()
                .success(true)
                .token(token)
                .username(user.getUsername())
                .email(user.getEmail())
                .role(user.getRole().name())
                .level(user.getLevel())
                .message("Registro exitoso")
                .build();
    }

    /**
     * Resetea la contraseña de un usuario.
     *
     * NOTA: En una aplicación real, esto enviaría un email con un link.
     * Para simplificar, aquí solo cambiamos la contraseña directamente.
     */
    @Transactional
    public ApiResponse<Void> resetPassword(ResetPasswordRequest request) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new BadRequestException("No existe un usuario con ese email"));

        user.setPassword(passwordEncoder.encode(request.getNewPassword()));
        userRepository.save(user);

        return ApiResponse.success(null, "Contraseña actualizada correctamente");
    }
}
