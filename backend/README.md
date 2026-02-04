# 🦕 EducaDino Backend

Backend REST API para la aplicación educativa EducaDino, construido con Spring Boot 3.4 y PostgreSQL.

## 📋 Requisitos Previos

- **Java 21** (ya lo tienes instalado ✅)
- **PostgreSQL** (debes instalarlo)
- **Maven** (incluido con el wrapper `mvnw`)

## 🚀 Instalación Rápida

### 1. Instalar PostgreSQL

1. Descarga PostgreSQL desde: https://www.postgresql.org/download/windows/
2. Durante la instalación:
   - **Puerto**: 5432 (por defecto)
   - **Usuario**: postgres
   - **Contraseña**: postgres (o la que prefieras)
3. Marca la opción de instalar **pgAdmin** (herramienta gráfica)

### 2. Crear la Base de Datos

**Opción A: Usando pgAdmin (recomendado)**
1. Abre pgAdmin
2. Conéctate al servidor PostgreSQL
3. Click derecho en "Databases" → "Create" → "Database"
4. Nombre: `educadino`
5. Click en "Save"

**Opción B: Usando psql (línea de comandos)**
```bash
psql -U postgres
CREATE DATABASE educadino;
\q
```

### 3. Configurar la Conexión

Si usaste una contraseña diferente a `postgres`, edita el archivo:
```
backend/src/main/resources/application.yml
```

Y cambia la línea:
```yaml
password: TU_CONTRASEÑA_AQUÍ
```

### 4. Ejecutar el Backend

Desde la carpeta `backend`:

```bash
# Windows (PowerShell)
.\mvnw.cmd spring-boot:run

# O si tienes Maven instalado globalmente
mvn spring-boot:run
```

El servidor iniciará en: `http://localhost:8080/api`

## 📖 Documentación de la API

Una vez iniciado el servidor, accede a:

- **Swagger UI**: http://localhost:8080/api/swagger-ui.html
- **OpenAPI JSON**: http://localhost:8080/api/docs

## 🔐 Autenticación JWT

### ¿Cómo funciona?

1. **Login**: El usuario envía sus credenciales a `/api/auth/login`
2. **Token**: El servidor devuelve un token JWT
3. **Uso**: El frontend incluye el token en cada petición:
   ```
   Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
   ```
4. **Validación**: El servidor valida el token en cada petición

### Usuarios de Prueba

| Usuario | Contraseña | Rol |
|---------|------------|-----|
| admin | admin | ADMIN |
| dino_fan | 1234 | USER |

### Ejemplo de Login

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin"}'
```

Respuesta:
```json
{
  "success": true,
  "token": "eyJhbGciOiJIUzI1NiJ9...",
  "username": "admin",
  "email": "admin@educadino.com",
  "role": "ADMIN",
  "level": 10,
  "message": "Login exitoso"
}
```

## 📡 Endpoints Principales

### Autenticación (públicos)
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| POST | `/auth/login` | Iniciar sesión |
| POST | `/auth/register` | Registrar usuario |
| POST | `/auth/reset-password` | Cambiar contraseña |

### Dinosaurios
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/dinosaurs` | Listar todos | No |
| GET | `/dinosaurs/{id}` | Obtener uno | No |
| GET | `/dinosaurs/search?name=rex` | Buscar | No |
| POST | `/dinosaurs` | Crear | ADMIN |
| PUT | `/dinosaurs/{id}` | Actualizar | ADMIN |
| DELETE | `/dinosaurs/{id}` | Eliminar | ADMIN |

### Productos
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/products` | Listar (paginado) | No |
| GET | `/products/{id}` | Obtener uno | No |
| GET | `/products/featured` | Destacados | No |
| GET | `/products/categories` | Categorías | No |
| POST | `/products` | Crear | ADMIN |
| PUT | `/products/{id}` | Actualizar | ADMIN |
| DELETE | `/products/{id}` | Eliminar | ADMIN |

### Carrito
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/cart` | Ver carrito | Sí |
| POST | `/cart/items` | Añadir producto | Sí |
| PUT | `/cart/items/{productId}` | Cambiar cantidad | Sí |
| DELETE | `/cart/items/{productId}` | Eliminar producto | Sí |
| POST | `/cart/checkout` | Procesar compra | Sí |

### Progreso (Minijuegos)
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| GET | `/progress` | Mi progreso | Sí |
| GET | `/progress/stats` | Estadísticas | Sí |
| POST | `/progress` | Guardar progreso | Sí |

### Contacto
| Método | Endpoint | Descripción | Auth |
|--------|----------|-------------|------|
| POST | `/contact` | Enviar mensaje | No |
| GET | `/contact/all` | Ver mensajes | ADMIN |

## 🗂️ Estructura del Proyecto

```
backend/
├── src/main/java/com/educadino/
│   ├── EducaDinoApplication.java    # Punto de entrada
│   ├── config/                       # Configuraciones
│   │   ├── SecurityConfig.java      # Spring Security
│   │   ├── OpenApiConfig.java       # Swagger
│   │   └── DataInitializer.java     # Datos iniciales
│   ├── controller/                   # REST Controllers
│   │   ├── AuthController.java
│   │   ├── UserController.java
│   │   ├── DinosaurController.java
│   │   ├── ProductController.java
│   │   ├── CartController.java
│   │   ├── ProgressController.java
│   │   └── ContactController.java
│   ├── dto/                          # Data Transfer Objects
│   ├── entity/                       # Entidades JPA
│   ├── exception/                    # Manejo de errores
│   ├── repository/                   # Repositorios JPA
│   ├── security/                     # JWT y autenticación
│   └── service/                      # Lógica de negocio
└── src/main/resources/
    └── application.yml               # Configuración
```

## 🔧 Configuración para Desarrollo

### Ejecutar Frontend + Backend juntos

1. **Terminal 1 - Backend**:
   ```bash
   cd backend
   .\mvnw.cmd spring-boot:run
   ```

2. **Terminal 2 - Frontend**:
   ```bash
   cd frontend
   npm start
   ```

El proxy configurado en `frontend/proxy.conf.json` redirige las peticiones `/api` al backend.

### Variables de Entorno (Producción)

```yaml
# application-prod.yml
spring:
  datasource:
    url: ${DATABASE_URL}
    username: ${DATABASE_USER}
    password: ${DATABASE_PASSWORD}

jwt:
  secret: ${JWT_SECRET}
```

## 🐛 Solución de Problemas

### "Could not connect to database"
- Verifica que PostgreSQL esté ejecutándose
- Comprueba usuario/contraseña en `application.yml`
- Asegúrate de que la BD `educadino` existe

### "Port 8080 already in use"
- Cierra la aplicación que usa el puerto
- O cambia el puerto en `application.yml`:
  ```yaml
  server:
    port: 8081
  ```

### "JWT token expired"
- El token expira en 24 horas
- El frontend debe renovar el token o hacer logout

## 📚 Recursos Adicionales

- [Spring Boot Documentation](https://docs.spring.io/spring-boot/docs/current/reference/html/)
- [Spring Security](https://spring.io/projects/spring-security)
- [JWT.io](https://jwt.io/) - Decodificar tokens JWT
- [PostgreSQL Tutorial](https://www.postgresqltutorial.com/)
