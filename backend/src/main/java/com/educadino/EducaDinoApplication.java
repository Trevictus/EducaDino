package com.educadino;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

/**
 * EducaDino Backend Application
 *
 * Aplicación Spring Boot que sirve como backend REST API
 * para la aplicación educativa de dinosaurios EducaDino.
 *
 * @author EducaDino Team
 * @version 1.0.0
 */
@SpringBootApplication
public class EducaDinoApplication {

    public static void main(String[] args) {
        SpringApplication.run(EducaDinoApplication.class, args);
        System.out.println("""

            ╔═══════════════════════════════════════════════════════════════╗
            ║                                                               ║
            ║   🦕 EducaDino Backend iniciado correctamente! 🦖             ║
            ║                                                               ║
            ║   API REST:     http://localhost:8080/api                     ║
            ║   Swagger UI:   http://localhost:8080/api/swagger-ui.html     ║
            ║   API Docs:     http://localhost:8080/api/docs                ║
            ║                                                               ║
            ╚═══════════════════════════════════════════════════════════════╝
            """);
    }
}
