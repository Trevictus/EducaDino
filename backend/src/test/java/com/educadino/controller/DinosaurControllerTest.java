package com.educadino.controller;

import org.junit.jupiter.api.DisplayName;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

/**
 * Tests de integración para DinosaurController.
 * Verifica el control de acceso basado en roles.
 */
@SpringBootTest
@AutoConfigureMockMvc
@ActiveProfiles("test")
@DisplayName("Tests de Dinosaurios y Control de Acceso")
class DinosaurControllerTest {

    @Autowired
    private MockMvc mockMvc;

    // ═══════════════════════════════════════════════════════════════
    // TESTS DE ENDPOINTS PÚBLICOS
    // ═══════════════════════════════════════════════════════════════

    @Test
    @DisplayName("GET /dinosaurs debe ser accesible sin autenticación")
    void getAllDinosaurs_withoutAuth_shouldReturnOk() throws Exception {
        mockMvc.perform(get("/dinosaurs")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    @Test
    @DisplayName("GET /dinosaurs/search debe ser accesible sin autenticación")
    void searchDinosaurs_withoutAuth_shouldReturnOk() throws Exception {
        mockMvc.perform(get("/dinosaurs/search")
                .param("name", "rex")
                .contentType(MediaType.APPLICATION_JSON))
                .andExpect(status().isOk());
    }

    // ═══════════════════════════════════════════════════════════════
    // TESTS DE CONTROL DE ACCESO - ADMIN
    // ═══════════════════════════════════════════════════════════════

    @Test
    @DisplayName("POST /dinosaurs sin autenticación debe devolver 401")
    void createDinosaur_withoutAuth_shouldReturnUnauthorized() throws Exception {
        String dinosaurJson = """
            {
                "name": "Test Dino",
                "species": "Test Species",
                "diet": "Carnívoro",
                "period": "Cretácico"
            }
            """;

        mockMvc.perform(post("/dinosaurs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(dinosaurJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("POST /dinosaurs con rol USER debe devolver 403")
    @WithMockUser(roles = "USER")
    void createDinosaur_withUserRole_shouldReturnForbidden() throws Exception {
        String dinosaurJson = """
            {
                "name": "Test Dino",
                "species": "Test Species",
                "diet": "Carnívoro",
                "period": "Cretácico"
            }
            """;

        mockMvc.perform(post("/dinosaurs")
                .contentType(MediaType.APPLICATION_JSON)
                .content(dinosaurJson))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("DELETE /dinosaurs/{id} sin autenticación debe devolver 401")
    void deleteDinosaur_withoutAuth_shouldReturnUnauthorized() throws Exception {
        mockMvc.perform(delete("/dinosaurs/1"))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("DELETE /dinosaurs/{id} con rol USER debe devolver 403")
    @WithMockUser(roles = "USER")
    void deleteDinosaur_withUserRole_shouldReturnForbidden() throws Exception {
        mockMvc.perform(delete("/dinosaurs/1"))
                .andExpect(status().isForbidden());
    }

    @Test
    @DisplayName("PUT /dinosaurs/{id} sin autenticación debe devolver 401")
    void updateDinosaur_withoutAuth_shouldReturnUnauthorized() throws Exception {
        String dinosaurJson = """
            {
                "name": "Updated Dino"
            }
            """;

        mockMvc.perform(put("/dinosaurs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(dinosaurJson))
                .andExpect(status().isUnauthorized());
    }

    @Test
    @DisplayName("PUT /dinosaurs/{id} con rol USER debe devolver 403")
    @WithMockUser(roles = "USER")
    void updateDinosaur_withUserRole_shouldReturnForbidden() throws Exception {
        String dinosaurJson = """
            {
                "name": "Updated Dino"
            }
            """;

        mockMvc.perform(put("/dinosaurs/1")
                .contentType(MediaType.APPLICATION_JSON)
                .content(dinosaurJson))
                .andExpect(status().isForbidden());
    }
}

