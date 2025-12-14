# 🦕 EducaDIno Backend

Una aplicación web educativa sobre dinosaurios construida con **Spring Boot 4.0** y **H2 Database**.

## 🚀 Inicio Rápido

### Requisitos
- Java 21+
- Gradle 9.2+

### Compilar y Ejecutar

```bash
# Compilar el proyecto
./gradlew clean build

# Ejecutar la aplicación
./gradlew bootRun
```

La aplicación estará disponible en: **http://localhost:8080**

### Acceso a la Consola H2

- URL: http://localhost:8080/h2-console
- Usuario: `sa`
- Contraseña: (dejar vacía)
- JDBC URL: `jdbc:h2:mem:educadino`

---

## 📚 Documentación

Ver `DOCUMENTACION.md` para la documentación completa de la estructura.

---

## 🔌 Endpoints Principales

### 👤 Usuarios (`/api/usuarios`)
```
GET    /api/usuarios                  - Obtener todos
POST   /api/usuarios                  - Crear usuario
GET    /api/usuarios/{id}             - Obtener por ID
PUT    /api/usuarios/{id}             - Actualizar usuario
DELETE /api/usuarios/{id}             - Eliminar usuario
```

### 🎯 Perfiles (`/api/perfiles`)
```
GET    /api/perfiles                  - Obtener todos
POST   /api/perfiles/{idUsuario}      - Crear perfil
GET    /api/perfiles/ranking/top10    - Top 10 usuarios
```

### 🦕 Dinosaurios (`/api/dinosaurios`)
```
GET    /api/dinosaurios               - Obtener todos
POST   /api/dinosaurios               - Crear dinosaurio
GET    /api/dinosaurios/herbivoros    - Filtrar herbívoros
GET    /api/dinosaurios/carnivoros    - Filtrar carnívoros
```

### 🎮 Actividades (`/api/actividades`)
```
GET    /api/actividades               - Obtener todas
POST   /api/actividades               - Crear actividad
GET    /api/actividades/tipo/quiz     - Solo quiz
GET    /api/actividades/tipo/memoria  - Solo memoria
```

---

## ✅ Estructura Implementada

- ✅ **4 Entidades**: Usuario, Perfil, Dinosaurio, Actividad
- ✅ **DTOs Separados**: Create, Update, Response
- ✅ **Services Completos**: Lógica de negocio
- ✅ **Repositories Avanzados**: Consultas personalizadas
- ✅ **Validaciones**: Hibernate Validator
- ✅ **Seguridad**: BCrypt para contraseñas
- ✅ **CORS**: Habilitado para frontend
- ✅ **Manejo de Errores**: GlobalExceptionHandler

---

## 📝 Ejemplo de Creación de Usuario

```bash
curl -X POST http://localhost:8080/api/usuarios \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Juan",
    "apellido": "Pérez",
    "email": "juan@example.com",
    "contrasena": "password123",
    "rol": "ALUMNO"
  }'
```

---

## 🎓 Próximos Pasos

1. Implementar autenticación JWT
2. Agregar autorización por roles
3. Crear pruebas unitarias
4. Agregar Swagger/OpenAPI
5. Implementar paginación
6. Crear relaciones N:M para historial de actividades

---

**Estado**: ✅ Listo para desarrollo

Para más detalles, consulta `DOCUMENTACION.md`

