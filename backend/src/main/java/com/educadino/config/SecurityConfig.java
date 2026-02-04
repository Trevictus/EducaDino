package com.educadino.config;

import com.educadino.security.JwtAuthenticationEntryPoint;
import com.educadino.security.JwtAuthenticationFilter;
import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

/**
 * Configuración de Seguridad
 *
 * ═══════════════════════════════════════════════════════════════
 * ¿CÓMO FUNCIONA SPRING SECURITY?
 * ═══════════════════════════════════════════════════════════════
 *
 * Spring Security es un framework de seguridad que protege la aplicación.
 *
 * CONCEPTOS CLAVE:
 * ────────────────
 * 1. SecurityFilterChain: Cadena de filtros que procesan cada petición
 * 2. AuthenticationManager: Gestiona la autenticación de usuarios
 * 3. PasswordEncoder: Encripta contraseñas (BCrypt es muy seguro)
 * 4. JWT Filter: Nuestro filtro personalizado para validar tokens
 *
 * FLUJO DE UNA PETICIÓN:
 * ──────────────────────
 * Petición HTTP → CORS → JWT Filter → Autorización → Controller
 *                           ↓
 *                  ¿Token válido?
 *                  ↓           ↓
 *                 SÍ          NO
 *                  ↓           ↓
 *              Continúa    401 Unauthorized
 */
@Configuration
@EnableWebSecurity
@EnableMethodSecurity  // Habilita @PreAuthorize en controllers
@RequiredArgsConstructor
public class SecurityConfig {

    private final JwtAuthenticationFilter jwtAuthFilter;
    private final JwtAuthenticationEntryPoint jwtAuthEntryPoint;
    private final UserDetailsService userDetailsService;

    /**
     * Configura la cadena de filtros de seguridad.
     */
    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // Deshabilitar CSRF (no necesario con JWT)
            .csrf(csrf -> csrf.disable())

            // Configurar CORS (permitir peticiones desde Angular)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))

            // Configurar manejo de excepciones de autenticación
            .exceptionHandling(ex -> ex
                .authenticationEntryPoint(jwtAuthEntryPoint)
            )

            // Configurar sesiones como STATELESS (no guardar sesión en servidor)
            .sessionManagement(session -> session
                .sessionCreationPolicy(SessionCreationPolicy.STATELESS)
            )

            // Configurar autorización de rutas
            .authorizeHttpRequests(auth -> auth
                // ═══════════════════════════════════════════════════════════
                // RUTAS PÚBLICAS (no requieren autenticación)
                // ═══════════════════════════════════════════════════════════
                .requestMatchers("/auth/**").permitAll()           // Login, registro, reset
                .requestMatchers("/docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()  // Swagger
                .requestMatchers(HttpMethod.GET, "/dinosaurs/**").permitAll()  // Ver dinosaurios
                .requestMatchers(HttpMethod.GET, "/products/**").permitAll()   // Ver productos
                .requestMatchers(HttpMethod.POST, "/contact").permitAll()      // Enviar contacto

                // ═══════════════════════════════════════════════════════════
                // RUTAS DE ADMIN (requieren rol ADMIN)
                // ═══════════════════════════════════════════════════════════
                .requestMatchers(HttpMethod.POST, "/dinosaurs/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/dinosaurs/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/dinosaurs/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")
                .requestMatchers("/admin/**").hasRole("ADMIN")
                .requestMatchers("/contact/all").hasRole("ADMIN")

                // ═══════════════════════════════════════════════════════════
                // RUTAS PROTEGIDAS (requieren autenticación)
                // ═══════════════════════════════════════════════════════════
                .anyRequest().authenticated()
            )

            // Agregar el filtro JWT antes del filtro de autenticación estándar
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    /**
     * Configuración de CORS para permitir peticiones desde Angular.
     */
    @Bean
    public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
        var configuration = new org.springframework.web.cors.CorsConfiguration();

        // Orígenes permitidos (frontend Angular)
        configuration.addAllowedOrigin("http://localhost:4200");
        configuration.addAllowedOrigin("http://localhost:4201");

        // Métodos HTTP permitidos
        configuration.addAllowedMethod("*");

        // Headers permitidos
        configuration.addAllowedHeader("*");

        // Permitir envío de credenciales (cookies, auth headers)
        configuration.setAllowCredentials(true);

        var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);

        return source;
    }

    /**
     * Proveedor de autenticación que usa nuestra BD.
     */
    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
        authProvider.setUserDetailsService(userDetailsService);
        authProvider.setPasswordEncoder(passwordEncoder());
        return authProvider;
    }

    /**
     * Gestor de autenticación.
     */
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    /**
     * Codificador de contraseñas BCrypt.
     *
     * BCrypt es un algoritmo de hashing seguro que:
     * - Genera un salt aleatorio automáticamente
     * - Es lento por diseño (dificulta ataques de fuerza bruta)
     * - Produce hashes únicos incluso para la misma contraseña
     */
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}
