package com.educadino.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

/**
 * Filtro de Autenticación JWT
 *
 * ═══════════════════════════════════════════════════════════════
 * ¿CÓMO FUNCIONA ESTE FILTRO?
 * ═══════════════════════════════════════════════════════════════
 *
 * Este filtro se ejecuta UNA VEZ por cada petición HTTP.
 * Su trabajo es:
 *
 * 1. Buscar el header "Authorization" en la petición
 * 2. Verificar que empiece con "Bearer "
 * 3. Extraer el token JWT
 * 4. Validar el token (firma, expiración, etc.)
 * 5. Si es válido, cargar los datos del usuario
 * 6. Establecer la autenticación en el contexto de Spring Security
 *
 * Ejemplo de header:
 *   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 */
@Component
@RequiredArgsConstructor
public class JwtAuthenticationFilter extends OncePerRequestFilter {

    private final JwtTokenProvider jwtTokenProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(
            HttpServletRequest request,
            HttpServletResponse response,
            FilterChain filterChain
    ) throws ServletException, IOException {

        try {
            // 1. Extraer el token del header
            String jwt = getJwtFromRequest(request);

            // 2. Si hay token y es válido
            if (StringUtils.hasText(jwt) && jwtTokenProvider.validateToken(jwt)) {

                // 3. Obtener el username del token
                String username = jwtTokenProvider.getUsernameFromToken(jwt);

                // 4. Cargar los datos completos del usuario desde la BD
                UserDetails userDetails = userDetailsService.loadUserByUsername(username);

                // 5. Crear objeto de autenticación
                UsernamePasswordAuthenticationToken authentication =
                        new UsernamePasswordAuthenticationToken(
                                userDetails,
                                null,
                                userDetails.getAuthorities()
                        );

                authentication.setDetails(
                        new WebAuthenticationDetailsSource().buildDetails(request)
                );

                // 6. Establecer la autenticación en el contexto de Spring Security
                // A partir de aquí, el usuario está "logueado" para esta petición
                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            logger.error("No se pudo establecer la autenticación del usuario", e);
        }

        // Continuar con el siguiente filtro
        filterChain.doFilter(request, response);
    }

    /**
     * Extrae el token JWT del header Authorization.
     *
     * @param request Petición HTTP
     * @return Token JWT sin el prefijo "Bearer " o null si no existe
     */
    private String getJwtFromRequest(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");

        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            return bearerToken.substring(7); // Quitar "Bearer "
        }

        return null;
    }
}
