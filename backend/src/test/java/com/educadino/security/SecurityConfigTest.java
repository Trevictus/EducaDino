package com.educadino.security;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de seguridad para verificar el control de acceso basado en roles.
 * Utiliza spring-security-test para simular usuarios con diferentes roles.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Tests de Seguridad y Roles")
class SecurityConfigTest {

    @Autowired
    private MockMvc mockMvc;

    // ═══════════════════════════════════════════════════════════════
    // TESTS DE RUTAS PÚBLICAS
    // ═══════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Rutas de auth deben ser públicas")
    void authRoutes_shouldBePublic() throws Exception {
        // Las rutas de auth no requieren autenticación
        mockMvc.perform(post("/auth/login"))
                .andExpect(status().isBadRequest()); // Bad request porque no hay body, pero no 401
    }

    @Test
    @DisplayName("Swagger UI debe ser accesible sin autenticación")
    void swaggerUI_shouldBePublic() throws Exception {
        mockMvc.perform(get("/swagger-ui/index.html"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("API Docs debe ser accesible sin autenticación")
    void apiDocs_shouldBePublic() throws Exception {
        mockMvc.perform(get("/docs"))
                .andExpect(status().isOk());
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS DE RUTAS PROTEGIDAS
    // ═══════════════════════════════════════════════════════════════

    @Test
    @DisplayName("Rutas de admin sin autenticación deben devolver 401")
    void adminRoutes_withoutAuth_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("Rutas de admin con rol USER deben devolver 403")
    @WithMockUser(roles = "USER")
    void adminRoutes_withUserRole_shouldReturnForbidden() throws Exception {
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("Rutas de admin con rol ADMIN deben ser accesibles")
    @WithMockUser(roles = "ADMIN")
    void adminRoutes_withAdminRole_shouldBeAccessible() throws Exception {
        // No devuelve 401 ni 403, puede ser 200 o 404 dependiendo de si existe la ruta
        mockMvc.perform(get("/admin/users"))
                .andExpect(status().isNot(status().isUnauthorized().toString().contains("401") ?
                    status().isUnauthorized() : status().isForbidden()));
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS DE CORS
    // ═══════════════════════════════════════════════════════════════

    @Test
    @DisplayName("CORS debe permitir origen localhost:4200")
    void cors_shouldAllowLocalhost4200() throws Exception {
        mockMvc.perform(options("/dinosaurs")
                .header("Origin", "http://localhost:4200")
                .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    @Test
    @DisplayName("CORS debe permitir origen de producción")
    void cors_shouldAllowProductionOrigin() throws Exception {
        mockMvc.perform(options("/dinosaurs")
                .header("Origin", "https://educadino.alcina.es")
                .header("Access-Control-Request-Method", "GET"))
                .andExpect(status().isOk())
                .andExpect(header().exists("Access-Control-Allow-Origin"));
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS DE PRODUCTOS (Control de acceso)
    // ═══════════════════════════════════════════════════════════════

    @Test
    @DisplayName("GET /products debe ser público")
    void getProducts_shouldBePublic() throws Exception {
        mockMvc.perform(get("/products"))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("POST /products sin auth debe devolver 401")
    void createProduct_withoutAuth_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(post("/products")
                .contentType("application/json")
                .content("{}"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /products con rol USER debe devolver 403")
    @WithMockUser(roles = "USER")
    void createProduct_withUserRole_shouldReturnForbidden() throws Exception {
        mockMvc.perform(post("/products")
                .contentType("application/json")
                .content("{}"))
                .andExpect(status().isForbidden());
    }
}

