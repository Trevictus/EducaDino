package com.educadino.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.io.Decoders;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import java.util.Date;

/**
 * Proveedor de JWT (JSON Web Token)
 *
 * ═══════════════════════════════════════════════════════════════
 * ¿CÓMO FUNCIONA JWT?
 * ═══════════════════════════════════════════════════════════════
 *
 * JWT es un estándar para crear tokens de acceso seguros.
 * Un token JWT tiene 3 partes separadas por puntos:
 *
 *   HEADER.PAYLOAD.SIGNATURE
 *
 * 1. HEADER: Contiene el tipo de token (JWT) y el algoritmo (HS256)
 * 2. PAYLOAD: Contiene los datos del usuario (claims):
 *    - sub: subject (username)
 *    - iat: issued at (fecha de creación)
 *    - exp: expiration (fecha de expiración)
 * 3. SIGNATURE: Firma digital para verificar que el token no fue modificado
 *
 * FLUJO DE AUTENTICACIÓN:
 * ─────────────────────────
 * 1. Usuario envía credenciales (POST /auth/login)
 * 2. Backend valida credenciales contra la BD
 * 3. Si son correctas, se genera un JWT con los datos del usuario
 * 4. Se devuelve el token al frontend
 * 5. Frontend guarda el token (localStorage)
 * 6. En cada petición, frontend envía: Authorization: Bearer <token>
 * 7. Backend valida el token en cada petición
 * 8. Si es válido, permite el acceso; si no, devuelve 401
 */
@Component
public class JwtTokenProvider {

    @Value("${jwt.secret}")
    private String jwtSecret;

    @Value("${jwt.expiration}")
    private long jwtExpiration;

    /**
     * Genera un token JWT para el usuario autenticado.
     *
     * @param authentication Objeto de autenticación de Spring Security
     * @return Token JWT como String
     */
    public String generateToken(Authentication authentication) {
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        return generateToken(userDetails.getUsername());
    }

    /**
     * Genera un token JWT para un username específico.
     *
     * @param username Nombre de usuario
     * @return Token JWT como String
     */
    public String generateToken(String username) {
        Date now = new Date();
        Date expiryDate = new Date(now.getTime() + jwtExpiration);

        return Jwts.builder()
                .subject(username)                    // Quién es el usuario
                .issuedAt(now)                        // Cuándo se creó
                .expiration(expiryDate)               // Cuándo expira
                .signWith(getSigningKey())            // Firma con clave secreta
                .compact();
    }

    /**
     * Extrae el username del token JWT.
     *
     * @param token Token JWT
     * @return Username contenido en el token
     */
    public String getUsernameFromToken(String token) {
        Claims claims = Jwts.parser()
                .verifyWith(getSigningKey())
                .build()
                .parseSignedClaims(token)
                .getPayload();

        return claims.getSubject();
    }

    /**
     * Valida si el token JWT es válido.
     *
     * @param token Token JWT a validar
     * @return true si es válido, false en caso contrario
     */
    public boolean validateToken(String token) {
        try {
            Jwts.parser()
                    .verifyWith(getSigningKey())
                    .build()
                    .parseSignedClaims(token);
            return true;
        } catch (MalformedJwtException e) {
            System.err.println("Token JWT mal formado: " + e.getMessage());
        } catch (ExpiredJwtException e) {
            System.err.println("Token JWT expirado: " + e.getMessage());
        } catch (UnsupportedJwtException e) {
            System.err.println("Token JWT no soportado: " + e.getMessage());
        } catch (IllegalArgumentException e) {
            System.err.println("Token JWT vacío: " + e.getMessage());
        }
        return false;
    }

    /**
     * Obtiene la clave secreta para firmar/verificar tokens.
     */
    private SecretKey getSigningKey() {
        byte[] keyBytes = Decoders.BASE64.decode(
            java.util.Base64.getEncoder().encodeToString(jwtSecret.getBytes())
        );
        return Keys.hmacShaKeyFor(keyBytes);
    }
}
