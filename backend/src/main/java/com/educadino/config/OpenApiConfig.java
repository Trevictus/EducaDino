package com.educadino.config;

import io.swagger.v3.oas.models.Components;
import io.swagger.v3.oas.models.OpenAPI;
import io.swagger.v3.oas.models.info.Contact;
import io.swagger.v3.oas.models.info.Info;
import io.swagger.v3.oas.models.info.License;
import io.swagger.v3.oas.models.security.SecurityRequirement;
import io.swagger.v3.oas.models.security.SecurityScheme;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

/**
 * Configuración de OpenAPI/Swagger
 *
 * Swagger UI estará disponible en:
 *   http://localhost:8080/api/swagger-ui.html
 *
 * La documentación JSON estará en:
 *   http://localhost:8080/api/docs
 */
@Configuration
public class OpenApiConfig {

    @Bean
    public OpenAPI customOpenAPI() {
        final String securitySchemeName = "bearerAuth";

        return new OpenAPI()
            .info(new Info()
                .title("🦕 EducaDino API")
                .version("1.0.0")
                .description("""
                    API REST para la aplicación educativa EducaDino.

                    ## Autenticación
                    La mayoría de endpoints requieren autenticación JWT.
                    1. Usa `/auth/login` para obtener un token
                    2. Incluye el token en el header: `Authorization: Bearer <token>`

                    ## Roles
                    - **USER**: Puede ver contenido, jugar minijuegos y usar el carrito
                    - **ADMIN**: Puede gestionar dinosaurios, productos y usuarios
                    """)
                .contact(new Contact()
                    .name("EducaDino Team")
                    .email("contacto@educadino.com"))
                .license(new License()
                    .name("MIT License")
                    .url("https://opensource.org/licenses/MIT")))
            .addSecurityItem(new SecurityRequirement().addList(securitySchemeName))
            .components(new Components()
                .addSecuritySchemes(securitySchemeName,
                    new SecurityScheme()
                        .name(securitySchemeName)
                        .type(SecurityScheme.Type.HTTP)
                        .scheme("bearer")
                        .bearerFormat("JWT")
                        .description("Ingresa tu token JWT")));
    }
}
