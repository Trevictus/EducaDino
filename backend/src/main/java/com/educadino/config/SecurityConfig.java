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
import org.springframework.security.config.Customizer;
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

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

  private final JwtAuthenticationFilter jwtAuthFilter;
  private final JwtAuthenticationEntryPoint jwtAuthEntryPoint;
  private final UserDetailsService userDetailsService;

  @Bean
  public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

    http
      .csrf(csrf -> csrf.disable())
      .cors(cors -> cors.configurationSource(corsConfigurationSource()))
      .exceptionHandling(ex -> ex.authenticationEntryPoint(jwtAuthEntryPoint))
      .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))

      .authorizeHttpRequests(auth -> auth

        // Rutas públicas
        .requestMatchers("/auth/**").permitAll()
        .requestMatchers("/docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
        .requestMatchers("/actuator/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/dinosaurs/**").permitAll()
        .requestMatchers(HttpMethod.GET, "/products/**").permitAll()
        .requestMatchers(HttpMethod.POST, "/contact").permitAll()

        // Rutas examen / pruebas
        .requestMatchers(HttpMethod.POST, "/api/auth/**").permitAll()

        // Admin
        .requestMatchers(HttpMethod.POST, "/dinosaurs/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/dinosaurs/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/dinosaurs/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.POST, "/products/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.PUT, "/products/**").hasRole("ADMIN")
        .requestMatchers(HttpMethod.DELETE, "/products/**").hasRole("ADMIN")
        .requestMatchers("/admin/**").hasRole("ADMIN")
        .requestMatchers("/contact/all").hasRole("ADMIN")

        // Sugerencias
        .requestMatchers(HttpMethod.POST, "/api/sugerencias/**")
        .hasAnyRole("USER", "ADMIN")

        // Todo lo demás requiere autenticación
        .anyRequest().authenticated()
      )

      .authenticationProvider(authenticationProvider())
      .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

    return http.build();
  }

  @Bean
  public org.springframework.web.cors.CorsConfigurationSource corsConfigurationSource() {
    var configuration = new org.springframework.web.cors.CorsConfiguration();
    configuration.addAllowedOrigin("http://localhost:4200");
    configuration.addAllowedOrigin("http://localhost:4201");
    configuration.addAllowedOrigin("https://educadino.alcina.es");
    configuration.addAllowedOrigin("http://educadino.alcina.es");
    configuration.addAllowedMethod("*");
    configuration.addAllowedHeader("*");
    configuration.setAllowCredentials(true);

    var source = new org.springframework.web.cors.UrlBasedCorsConfigurationSource();
    source.registerCorsConfiguration("/**", configuration);
    return source;
  }

  @Bean
  public AuthenticationProvider authenticationProvider() {
    DaoAuthenticationProvider authProvider = new DaoAuthenticationProvider();
    authProvider.setUserDetailsService(userDetailsService);
    authProvider.setPasswordEncoder(passwordEncoder());
    return authProvider;
  }

  @Bean
  public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
    throws Exception {
    return config.getAuthenticationManager();
  }

  @Bean
  public PasswordEncoder passwordEncoder() {
    return new BCryptPasswordEncoder();
  }
}
