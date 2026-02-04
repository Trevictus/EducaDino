package com.educadino.security;

import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.stereotype.Component;

import java.io.IOException;

/**
 * Punto de Entrada de Autenticación JWT
 *
 * Este componente maneja los errores de autenticación.
 * Cuando un usuario intenta acceder a un recurso protegido
 * sin un token válido, se ejecuta este método.
 */
@Component
public class JwtAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(
            HttpServletRequest request,
            HttpServletResponse response,
            AuthenticationException authException
    ) throws IOException {

        // Devolver error 401 Unauthorized con mensaje JSON
        response.setContentType("application/json");
        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
        response.getOutputStream().println(
            "{\"success\": false, \"message\": \"No autorizado. Token inválido o expirado.\"}"
        );
    }
}
