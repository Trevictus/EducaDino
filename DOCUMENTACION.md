# 📚 EducaDIno - Backend - Documentación de Estructura

## 🎯 Introducción

Este documento describe toda la estructura base creada para el backend de **EducaDIno**, una aplicación web educativa sobre dinosaurios, construida con **Spring Boot 4.0** y **H2 Database**.

---

## 📦 Componentes Principales Creados

### 1. **Entidades JPA** (`entity/`)
Representan las tablas de la base de datos H2.

#### ✅ Usuario
- `id_usuario` (PK, autoincremental)
- `nombre`, `apellido`, `email` (único)
- `contraseña` (encriptada con BCrypt)
- `rol` (ALUMNO, PROFESOR, ADMIN)
- `fecha_creacion`, `fecha_actualizacion` (timestamps automáticos)
- Relación 1:1 con Perfil (cascade delete)

#### ✅ Perfil
- `id_perfil` (PK)
- `id_usuario` (FK → Usuario)
- `avatar`, `nivel`, `puntos`
- Enriquece la experiencia del usuario con datos personalizados

#### ✅ Dinosaurio
- `id_dino` (PK)
- `nombre` (único), `época`, `alimentación` (HERBÍVORO, CARNÍVORO, OMNÍVORO)
- `descripción`, `imagen`
- Contenido educativo

#### ✅ Actividad
- `id_actividad` (PK)
- `titulo`, `descripción`
- `tipo` (QUIZ, MEMORIA, ARRASTRA_Y_SUELTA, VERDADERO_FALSO, MATCHING)
- `nivelDificultad` (FÁCIL, MEDIO, DIFÍCIL)

---

### 2. **DTOs (Data Transfer Objects)** (`dto/`)
Transferencia de datos entre cliente y servidor, separados en Create/Update/Response.

#### ✅ Usuario
- `UsuarioCreateDTO` - Para crear usuarios
- `UsuarioUpdateDTO` - Para actualizar usuarios (sin contraseña)
- `UsuarioResponseDTO` - Para responder sin exponer la contraseña

#### ✅ Perfil
- `PerfilCreateDTO` - Para crear perfiles
- `PerfilUpdateDTO` - Para actualizar perfiles
- `PerfilResponseDTO` - Para responder

#### ✅ Dinosaurio
- `DinosaurioCreateDTO` - Para crear dinosaurios
- `DinosaurioUpdateDTO` - Para actualizar dinosaurios
- `DinosaurioResponseDTO` - Para responder

#### ✅ Actividad
- `ActividadCreateDTO` - Para crear actividades
- `ActividadUpdateDTO` - Para actualizar actividades
- `ActividadResponseDTO` - Para responder

---

### 3. **Repositories** (`repository/`)
Acceso a datos con consultas personalizadas.

#### ✅ UsuarioRepository
- `findByEmail()` - Buscar por email
- `existsByEmail()` - Verificar si existe email
- `findByRol()` - Filtrar por rol
- `buscarPorNombre()` - Búsqueda por nombre/apellido
- `findAllAlumnos()`, `findAllProfesores()`, `findAllAdmins()`
- `countUsuarios()` - Contar total

#### ✅ PerfilRepository
- `findByUsuario()` - Perfil de un usuario
- `findByNivel()` - Filtrar por nivel
- `findTop10ByPuntos()` - Ranking top 10
- `findByNivelOrderByPuntos()` - Ranking por nivel

#### ✅ DinosaurioRepository
- `findByNombre()` - Buscar por nombre
- `findByEpoca()` - Filtrar por época
- `findByAlimentacion()` - Filtrar por tipo
- `buscarPorNombreODescripcion()` - Búsqueda general
- `findAllHerbivoros()`, `findAllCarnivoros()`, `findAllOmnivoros()`

#### ✅ ActividadRepository
- `findByTipo()` - Filtrar por tipo
- `findByNivelDificultad()` - Filtrar por dificultad
- `buscarPorTituloODescripcion()` - Búsqueda general
- `findAllQuiz()`, `findAllMemoria()` - Filtros específicos
- `findByTipoAndNivel()` - Filtro combinado

---

### 4. **Mappers** (`mapper/`)
Conversión entre entidades y DTOs (mapeo manual sin dependencias externas).

#### ✅ UsuarioMapper
- `toResponseDTO()` - Entidad → DTO Response
- `toEntity()` - DTO Create → Entidad
- `updateEntityFromDTO()` - Actualizar desde DTO

#### ✅ PerfilMapper, DinosaurioMapper, ActividadMapper
- Misma estructura para cada entidad

---

### 5. **Services** (`service/`)
Lógica de negocio y validaciones.

#### ✅ UsuarioService
- CRUD completo
- Encriptación de contraseñas con BCrypt
- Validación de emails únicos
- Búsquedas por rol, nombre, email
- Estadísticas

#### ✅ PerfilService
- CRUD de perfiles
- Rankings (top 10, por nivel)
- Incremento de puntos

#### ✅ DinosaurioService
- CRUD de dinosaurios
- Búsquedas por época, alimentación
- Validación de nombres únicos

#### ✅ ActividadService
- CRUD de actividades
- Búsquedas por tipo, dificultad
- Filtros combinados

---

### 6. **Controllers** (`controller/`)
Endpoints REST con validación automática.

#### ✅ UsuarioController (`/api/usuarios`)
```
GET    /api/usuarios               → Obtener todos
GET    /api/usuarios/{id}          → Obtener por ID
GET    /api/usuarios/email/{email} → Obtener por email
GET    /api/usuarios/rol/{rol}     → Filtrar por rol
GET    /api/usuarios/buscar/{nombre} → Búsqueda
GET    /api/usuarios/stats/total   → Total de usuarios
GET    /api/usuarios/check/email/{email} → Verificar email
POST   /api/usuarios               → Crear usuario
PUT    /api/usuarios/{id}          → Actualizar usuario
DELETE /api/usuarios/{id}          → Eliminar usuario
```

#### ✅ PerfilController (`/api/perfiles`)
```
GET    /api/perfiles               → Obtener todos
GET    /api/perfiles/{id}          → Obtener por ID
GET    /api/perfiles/usuario/{idUsuario} → Perfil de usuario
GET    /api/perfiles/nivel/{nivel} → Filtrar por nivel
GET    /api/perfiles/ranking/top10 → Top 10
GET    /api/perfiles/nivel/{nivel}/ranking → Ranking por nivel
POST   /api/perfiles/{idUsuario}   → Crear perfil
PUT    /api/perfiles/{id}          → Actualizar perfil
DELETE /api/perfiles/{id}          → Eliminar perfil
POST   /api/perfiles/{id}/puntos/{puntos} → Incrementar puntos
```

#### ✅ DinosaurioController (`/api/dinosaurios`)
```
GET    /api/dinosaurios                    → Obtener todos
GET    /api/dinosaurios/{id}               → Obtener por ID
GET    /api/dinosaurios/nombre/{nombre}    → Buscar por nombre
GET    /api/dinosaurios/epoca/{epoca}      → Filtrar por época
GET    /api/dinosaurios/alimentacion/herbivoros → Herbívoros
GET    /api/dinosaurios/alimentacion/carnivoros → Carnívoros
GET    /api/dinosaurios/buscar/{busqueda}  → Búsqueda general
GET    /api/dinosaurios/stats/total        → Total
POST   /api/dinosaurios                    → Crear dinosaurio
PUT    /api/dinosaurios/{id}               → Actualizar dinosaurio
DELETE /api/dinosaurios/{id}               → Eliminar dinosaurio
```

#### ✅ ActividadController (`/api/actividades`)
```
GET    /api/actividades                      → Obtener todas
GET    /api/actividades/{id}                 → Obtener por ID
GET    /api/actividades/tipo/{tipo}          → Filtrar por tipo
GET    /api/actividades/nivel/{nivel}        → Filtrar por nivel
GET    /api/actividades/tipo/quiz            → Solo quiz
GET    /api/actividades/tipo/memoria         → Solo memoria
GET    /api/actividades/tipo/{tipo}/nivel/{nivel} → Filtro combinado
GET    /api/actividades/buscar/{busqueda}    → Búsqueda general
GET    /api/actividades/stats/total          → Total
POST   /api/actividades                      → Crear actividad
PUT    /api/actividades/{id}                 → Actualizar actividad
DELETE /api/actividades/{id}                 → Eliminar actividad
```

---

### 7. **Manejo de Excepciones** (`exception/`)

#### ✅ GlobalExceptionHandler
- Centralización de errores
- Validación automática con Hibernate Validator
- Respuestas estandarizadas

#### ✅ ErrorResponse
- Formato consistente para errores
- Status, mensaje, timestamp y detalles

---

### 8. **Configuración** (`config/`)

#### ✅ SecurityConfig
- Bean de PasswordEncoder (BCrypt)
- Encriptación de contraseñas automática

---

### 9. **Base de Datos (H2)**

**Configuración:**
- URL: `jdbc:h2:mem:educadino`
- Usuario: `sa`
- Contraseña: (vacía)
- Consola H2: `http://localhost:8080/h2-console`

**Características:**
- In-memory (se reinicia con cada ejecución)
- Ideal para desarrollo y testing
- DDL Auto: `create-drop` (crea y elimina tablas)

---

## 🔐 Características de Seguridad

✅ **Encriptación de Contraseñas**: BCrypt  
✅ **Validación de Emails Únicos**: En database y lógica  
✅ **Validaciones Hibernate**: Anotaciones `@Valid`  
✅ **CORS Habilitado**: `@CrossOrigin(origins = "*")`  
✅ **Manejo Global de Excepciones**: Respuestas estandarizadas  

---

## 📋 Validaciones Implementadas

### Usuario
- Nombre: 2-100 caracteres
- Apellido: 2-100 caracteres
- Email: Formato válido y único
- Contraseña: Mínimo 6 caracteres
- Rol: ALUMNO, PROFESOR, ADMIN

### Perfil
- Avatar: No vacío
- Nivel: No vacío
- Puntos: ≥ 0

### Dinosaurio
- Nombre: No vacío y único
- Época: No vacía
- Alimentación: HERBÍVORO, CARNÍVORO, OMNÍVORO
- Imagen: No vacía

### Actividad
- Título: No vacío
- Tipo: QUIZ, MEMORIA, ARRASTRA_Y_SUELTA, VERDADERO_FALSO, MATCHING
- Nivel: FÁCIL, MEDIO, DIFÍCIL

---

## 🚀 Cómo Ejecutar

```bash
# Compilar el proyecto
./gradlew clean build

# Ejecutar la aplicación
./gradlew bootRun

# Acceso a la consola H2
# URL: http://localhost:8080/h2-console
# Usuario: sa
# Contraseña: (vacía)
```

---

## 📂 Estructura de Carpetas

```
src/main/java/com/educadino/
├── controller/           # Endpoints REST
├── service/             # Lógica de negocio
├── repository/          # Acceso a datos
├── entity/              # Entidades JPA
├── dto/                 # Data Transfer Objects
├── mapper/              # Conversión Entity ↔ DTO
├── exception/           # Manejo de excepciones
├── config/              # Configuraciones
└── EducaDinoApplication.java  # Clase principal

src/main/resources/
└── application.properties  # Configuración de la aplicación
```

---

## 📦 Dependencias Utilizadas

- **Spring Boot 4.0**
- **Spring Data JPA**
- **Spring Security**
- **Spring Validation** (Hibernate Validator)
- **H2 Database**
- **Lombok** (Reducción de boilerplate)
- **BCrypt** (Encriptación de contraseñas)

---

## ✨ Buenas Prácticas Aplicadas

✅ **Arquitectura en Capas**: Controller → Service → Repository  
✅ **DTOs Separados**: Create, Update, Response  
✅ **Validación Automática**: Anotaciones `@Valid`  
✅ **Manejo de Errores**: GlobalExceptionHandler  
✅ **Timestamps Automáticos**: `@PrePersist`, `@PreUpdate`  
✅ **Transaccionalidad**: `@Transactional`  
✅ **Inyección de Dependencias**: Constructor con `@RequiredArgsConstructor`  
✅ **Documentación**: Javadoc en todas las clases  
✅ **CORS**: Habilitado para frontend  
✅ **Encriptación**: Contraseñas con BCrypt  

---

## 🎓 Próximos Pasos

1. **Autenticación JWT**: Implementar login y tokens
2. **Roles y Permisos**: Autorización por rol
3. **Pruebas Unitarias**: Tests con JUnit y Mockito
4. **Pruebas de Integración**: Tests e2e
5. **Documentación OpenAPI/Swagger**: API docs automática
6. **Paginación y Sorting**: Mejora de consultas
7. **Relaciones N:M**: Usuario-Actividad para historial
8. **WebSockets**: Notificaciones en tiempo real
9. **Cache**: Redis para datos frecuentes
10. **Monitoreo**: Actuator y métricas

---

## 📝 Notas Finales

- La base de datos se **reinicia cada vez** que ejecutas la aplicación (modo in-memory)
- Para **persistencia**, cambia a MySQL o PostgreSQL
- Todos los **endpoints usan validación automática** con Hibernate
- Las **respuestas excluyen contraseñas** por seguridad
- Los **emails son únicos** a nivel de base de datos y lógica

---

**Estado**: ✅ **LISTO PARA DESARROLLO**

Víctor, ¡tu estructura base está completa y funcional! 🎉🦕

