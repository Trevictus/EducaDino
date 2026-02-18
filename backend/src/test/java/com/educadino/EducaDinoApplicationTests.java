package com.educadino;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.context.ActiveProfiles;

/**
 * Tests de integración para verificar que la aplicación arranca correctamente.
 */
@SpringBootTest
@ActiveProfiles("test")
class EducaDinoApplicationTests {

    @Test
    void contextLoads() {
        // Verifica que el contexto de Spring se carga correctamente
    }
}

