# Proyecto 4 - Accesibilidad y Multimedia

## Descripción
EducaDino es una aplicación web educativa interactiva para aprender sobre dinosaurios, dirigida a público infantil y familiar. Permite explorar información, curiosidades, minijuegos y actividades de forma visual y divertida, con un enfoque especial en accesibilidad web.

## Componente multimedia añadido
**Tipo:** Galería de tarjetas interactivas + Video
**Descripción:** Tarjetas de curiosidades con navegación dinámica y video documental con transcripción completa.

## Resultados de auditoría de accesibilidad

| Herramienta | Puntuación inicial | Puntuación final | Mejora |
|-------------|-------------------|------------------|--------|
| Lighthouse | 92/100 | 96/100 | +4 |
| WAVE | 35 errores | 0 errores | -35 |
| TAW | 5 problemas | 1 problema | -4 |

**Nivel de conformidad alcanzado:** WCAG 2.1 AA

## Documentación completa
**[Ver análisis completo de accesibilidad](./frontend/src/docs/accesibilidad/README.md)**

## Verificación realizada
- ✅ Auditoría con Lighthouse, WAVE y TAW
- ✅ Test con lector de pantalla (NVDA)
- ✅ Test de navegación por teclado
- ✅ Verificación cross-browser (Chrome, Firefox, Edge)

## Tecnologías utilizadas
- HTML5 semántico
- CSS3/SCSS (con media queries de accesibilidad)
- Angular 21 (standalone components)
- TypeScript 5.9
- Spring Boot 3.4 (Backend)
- PostgreSQL (Base de datos)

## Link a EducaDino desplegado

**--------------------------------------------TODO-----------------------------**

## Autor
**Nombre:** Víctor Gómez Tejada  

**Curso:** 2º DAW - Desarrollo de Aplicaciones Web  

**Módulo:** Diseño de Interfaces Web (DIW)

---

## Enlaces del proyecto
- **URL de producción:** https://trevictus.github.io/EducaDino/  
- **API Backend:** `http://localhost:8080/api` (desarrollo local)  
- **Swagger UI:** `http://localhost:8080/api/swagger-ui.html`  

---

## Arquitectura

EducaDino ahora tiene una **arquitectura full-stack**:

### **Frontend (Angular)**
- Angular 21 (standalone components)
- TypeScript
- SCSS (ITCSS, BEM)
- Angular Signals
- RxJS Observables
- Autenticación JWT
- CORS habilitado

### **Backend (Spring Boot)**
- Spring Boot 3.4
- Java 21
- Spring Security + JWT
- Spring Data JPA
- PostgreSQL (Neon en la nube)
- Swagger/OpenAPI

### **Base de Datos**
- PostgreSQL en Neon
- 6 tablas: users, dinosaurs, products, user_progress, cart_items, contact_messages

---


## Características principales

### Usuario
- ✅ Modo claro/oscuro con cambio instantáneo y persistencia
- ✅ Sistema de registro e login con JWT
- ✅ Perfil de usuario con estadísticas
- ✅ Autenticación segura

### Contenido Educativo
- ✅ Mapa interactivo de dinosaurios
- ✅ Información detallada de 8+ dinosaurios
- ✅ Minijuegos educativos
- ✅ Registro de progreso en BD

### Tienda (Simulada)
- ✅ Catálogo de productos educativos
- ✅ Carrito de compras
- ✅ Sistema de checkout (simulado)
- ✅ Historial de compras

### Admin
- ✅ Gestión de dinosaurios
- ✅ Gestión de productos
- ✅ Ver mensajes de contacto
- ✅ Dashboard de usuarios

---

## Instalación y ejecución

### Requisitos previos
- **Java 21** - [Descargar](https://www.oracle.com/java/technologies/downloads/#java21)
- **Node.js 20+** - [Descargar](https://nodejs.org/)
- **PostgreSQL** (opcional si usas Neon)
- **Git**

### Opción 1: Ejecución manual

#### Terminal 1 - Backend
```powershell
cd backend
.\mvnw.cmd spring-boot:run
```

Espera hasta ver:
```
🦕 EducaDino Backend iniciado correctamente! 🦖
API REST: http://localhost:8080/api
```

#### Terminal 2 - Frontend
```powershell
cd frontend
npm install  # Primera vez
npm start
```

Espera hasta ver:
```
✔ Compiled successfully
ℹ Angular Live Development Server is listening on localhost:4200
```

### Acceso a la aplicación

- **Frontend:** http://localhost:4200
- **Perfil/Login:** http://localhost:4200/perfil
- **Backend API:** http://localhost:8080/api
- **Swagger UI:** http://localhost:8080/api/swagger-ui.html

---

## Credenciales de prueba

| Usuario | Contraseña | Rol | Descripción |
|---------|-----------|-----|------------|
| `admin` | `admin` | ADMIN | Acceso a todo (dinosaurios, productos, admin) |
| `dino_fan` | `1234` | USER | Usuario normal (ver contenido, jugar, comprar) |

O registra tu propio usuario en `/perfil`

---

## Uso de la aplicación

### Para usuarios normales (USER)
1. Abre http://localhost:4200
2. Ve a `/perfil`
3. Selecciona "No" para registrarse
4. Completa el formulario
5. ¡Ya estás registrado! Ahora puedes:
   - Jugar minijuegos
   - Ver dinosaurios
   - Usar el carrito
   - Ver tu progreso

### Para administradores (ADMIN)
1. Abre http://localhost:8080/api/swagger-ui.html
2. Login con `admin/admin`
3. Accede a endpoints de admin:
   - POST/PUT/DELETE `/dinosaurs`
   - POST/PUT/DELETE `/products`
   - GET `/contact/all` (ver mensajes)

---

## Probar CORS

El sistema CORS está completamente configurado. Para verificar:

1. Abre DevTools (F12)
2. Ve a pestaña **Network**
3. Intenta registrarte en `/perfil`
4. Busca petición **register**
5. Verifica headers CORS:
   - `Access-Control-Allow-Origin: http://localhost:4200` ✅
   - Status: **200** ✅
   - Response contiene `"token"` ✅

---

## Estructura del proyecto

```
EducaDino/
├── backend/                    # Spring Boot REST API
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/educadino/
│   │   │   │   ├── controller/    # REST Controllers
│   │   │   │   ├── service/       # Business Logic
│   │   │   │   ├── entity/        # JPA Entities
│   │   │   │   ├── dto/           # Data Transfer Objects
│   │   │   │   ├── security/      # JWT + Spring Security
│   │   │   │   └── config/        # Configuration
│   │   │   └── resources/
│   │   │       └── application.yml # Config (Neon DB)
│   ├── pom.xml                    # Maven Dependencies
│   ├── mvnw.cmd                   # Maven Wrapper (Windows)
│   └── README.md                  # Backend Documentation
│
├── frontend/                   # Angular Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── core/
│   │   │   │   ├── services/      # AuthService, ProductService, etc.
│   │   │   │   └── interceptors/  # authInterceptor
│   │   │   ├── pages/
│   │   │   │   ├── login/         # Login Component
│   │   │   │   ├── profile/       # Profile + Registration
│   │   │   │   ├── products/      # Product List
│   │   │   │   └── ...
│   │   │   └── shared/
│   │   └── assets/
│   ├── package.json               # NPM Dependencies
│   ├── proxy.conf.json            # CORS Proxy config
│   └── README.md                  # Frontend Documentation
│
├── GUIA_CORS_FINAL.md            # Guía completa CORS
├── start-educadino.ps1           # Script de inicio
└── README.md                      # Este archivo
```

---

## Flujo de CORS

```
Navegador (http://localhost:4200)
           ↓
    Usuario registra
           ↓
    ProfileComponent.onRegister()
           ↓
    AuthService.register(data)
           ↓
    POST /api/auth/register
           ↓
    authInterceptor agrega headers
           ↓
    Navegador envía OPTIONS (preflight)
           ↓
    Backend verifica CORS en SecurityConfig
           ↓
    ✅ Permitido → Responde con headers CORS
           ↓
    Navegador envía POST real
           ↓
    Backend procesa registro
           ↓
    Genera JWT token
           ↓
    Devuelve respuesta + token
           ↓
    Frontend guarda token en localStorage
           ↓
    ✅ Usuario registrado
```

---


## Solución de problemas

### Error: "Cannot GET /api/auth/register"
- ✅ Verifica que el backend está corriendo en puerto 8080
- ✅ Abre http://localhost:8080/api para verificar

### Error: "Access to XMLHttpRequest blocked by CORS"
- ✅ Reinicia el backend
- ✅ Verifica que SecurityConfig.java tiene corsConfigurationSource()

### El token no se guarda
- ✅ Abre DevTools → Storage → localStorage
- ✅ Verifica que `auth_token` está ahí
- ✅ Revisa la consola para errores

### Base de datos no conecta
- ✅ Si usas Neon: verifica credenciales en application.yml
- ✅ Si usas PostgreSQL local: crea BD `educadino`

---

## Despliegue a producción

### Backend
- Opción 1: Heroku
- Opción 2: Railway.app
- Opción 3: AWS Elastic Beanstalk

### Frontend
- Opción 1: Vercel
- Opción 2: Netlify
- Opción 3: GitHub Pages

### Base de Datos
- Neon PostgreSQL (ya configurado)
- AWS RDS
- Google Cloud SQL

---

## Licencia

MIT License - Consulta [LICENSE](./LICENSE) para detalles

---

## Autor

**VíctorGT** - Full Stack Developer

---

## Contribuir

Las contribuciones son bienvenidas. Por favor:
1. Fork el repositorio
2. Crea una rama (`git checkout -b feature/AmazingFeature`)
3. Commit cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

---

## Soporte

Para problemas o preguntas:
1. Abre un issue en GitHub
2. Consulta la documentación en `GUIA_CORS_FINAL.md`
3. Revisa Swagger UI en `http://localhost:8080/api/swagger-ui.html`

---

**¡Gracias por usar EducaDino! 🦕🦖**

---

## FASE 1: MANIPULACIÓN DEL DOM Y EVENTOS

### Arquitectura de eventos

La arquitectura de eventos en esta aplicación Angular sigue el patrón unidireccional de datos, utilizando bindings de eventos nativos del DOM como `(click)`, `(keydown)` y `(pointerdown)` directamente en las plantillas de componentes standalone.

Los eventos se capturan con la sintaxis `(eventName)="handler($event)"`, donde `$event` proporciona acceso al objeto nativo del evento. Esta aproximación aprovecha Zone.js para detección de cambios automática.

Para flujos complejos, se centralizan eventos en servicios inyectables que usan `EventEmitter` o RxJS `Subjects`.

### Diagrama de flujo de eventos principales

```
Usuario → DOM Event (click/keydown)
       → Template Binding (event)
       → Component Handler ($event)
       → Service/State Update (signals/RxJS)
       → View Re-render (OnPush/Zone.js)
```

### Tabla de compatibilidad navegadores

| Evento          | Chrome | Firefox | Safari | Edge |
|:----------------|:-------|:--------|:-------|:-----|
| click           | Full   | Full    | Full   | Full |
| keydown/keyup   | Full   | Full    | Full   | Full |
| pointerdown     | Full   | Full    | Full   | Full |
| focus/blur      | Full   | Full    | Full   | Full |
| transitionend   | Full   | Full    | Full   | Full |

---

## FASE 2: ARQUITECTURA Y SERVICIOS

### Diagrama de flujo de datos

```
┌─────────────────────────────────────────────────────────────────┐
│                        FLUJO DE DATOS                           │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  ┌─────────┐    ┌───────────┐    ┌─────────┐    ┌─────────┐    │
│  │ Usuario │ -> │ Componente│ -> │ Servicio│ -> │ Estado  │    │
│  │ (click) │    │  (Dumb)   │    │ (Smart) │    │ (Signal)│    │
│  └─────────┘    └───────────┘    └─────────┘    └─────────┘    │
│                       │                              │          │
│                       └──────────────────────────────┘          │
│                              Re-render (Vista)                  │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### Patrón "Smart Services / Dumb Components"

**Dumb Components (Presentacionales):**
- Solo reciben datos vía `@Input()` y emiten eventos vía `@Output()`
- No tienen lógica de negocio
- Usan Signals para estado local de UI
- Ejemplo: `ButtonComponent`, `CardComponent`, `AlertComponent`

**Smart Services (Lógica):**
- Centralizan datos y lógica de negocio
- Usan `BehaviorSubject` para estado reactivo
- Exponen Signals para consumo en templates
- `providedIn: 'root'` para singleton global
- Ejemplo: `ToastService`, `LoadingService`, `DinoService`

### Servicios principales

| Servicio               | Propósito                                            | Patrón                                    |
|:-----------------------|:-----------------------------------------------------|:------------------------------------------|
| `CommunicationService` | Comunicación entre componentes hermanos              | BehaviorSubject + Observable              |
| `ToastService`         | Notificaciones globales (success, error, warning)    | BehaviorSubject + Signal + Auto-dismiss   |
| `LoadingService`       | Estados de carga global con contador de peticiones   | BehaviorSubject + Signal + Request Counter|
| `DinoService`          | Datos centralizados de dinosaurios                   | BehaviorSubject + Signal + Computed       |
| `ThemeService`         | Modo oscuro/claro con persistencia                   | Signal + localStorage + matchMedia        |

### Uso de Signals vs Observables

**Signals (Angular 17+):**
- Para estado local en templates: `isLoading = signal(false)`
- Para computed values: `favorites = computed(() => this.dinos().filter(d => d.liked))`
- Mejor rendimiento en templates sin `async` pipe

**Observables (RxJS):**
- Para streams de datos asíncronos
- Para operadores complejos (debounce, switchMap, etc.)
- Integración con HTTP Client

---

## FASE 3: FORMULARIOS AVANZADOS

### Tabla de validadores implementados

| Validador                      | Tipo        | Descripción                                                        |
|:-------------------------------|:------------|:-------------------------------------------------------------------|
| `passwordStrength()`           | Síncrono    | Requiere mayúsculas, minúsculas, números y símbolos. Mínimo 8 car. |
| `nifValidator()`               | Síncrono    | Valida formato (8 dígitos + letra) y letra correcta del DNI.       |
| `matchPasswords(ctrl1, ctrl2)` | Cross-Field | Validador de grupo que compara dos campos de contraseña.           |
| `spanishPhone()`               | Síncrono    | Valida teléfono español (9 dígitos, empieza por 6, 7 o 9).         |
| `username()`                   | Síncrono    | Solo letras, números y guiones bajos. Entre 3 y 20 caracteres.     |
| `uniqueEmailValidator()`       | Asíncrono   | Simula llamada a API para verificar email único.                   |
| `usernameAvailableValidator()` | Asíncrono   | Simula verificación de disponibilidad de username.                 |

### Funcionamiento del validador asíncrono

Los validadores asíncronos simulan llamadas a una API usando RxJS:

```typescript
uniqueEmailValidator(debounceTime: number = 800): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    const email = control.value?.toLowerCase().trim();

    if (!email) return of(null);

    // timer() actúa como debounce + delay de "red"
    return timer(debounceTime).pipe(
      switchMap(() => {
        // Simular respuesta del servidor
        const emailExists = this.existingEmails.includes(email);
        return emailExists
          ? of({ emailTaken: { message: 'Este email ya está registrado' } })
          : of(null);
      }),
      catchError(() => of(null))
    );
  };
}
```

**UX implementada:**
- Estado `pending` con mensaje "Comprobando..."
- Clase CSS `.form-field--pending` para feedback visual
- Se puede usar `updateOn: 'blur'` para validar solo al perder foco

### Definición del FormArray (OrderForm)

```typescript
private initForm(): void {
  this.orderForm = this.fb.group({
    nombreCliente: ['', [Validators.required]],
    emailCliente: ['', [Validators.required, Validators.email]],
    direccion: ['', [Validators.required]],

    // FormArray de items del pedido
    items: this.fb.array([], [Validators.required, Validators.minLength(1)]),

    notas: ['']
  });

  this.addItem(); // Añadir un item inicial
}

// Getter para acceder al FormArray
get items(): FormArray {
  return this.orderForm.get('items') as FormArray;
}

// Crear FormGroup para cada item
private createItemFormGroup(): FormGroup {
  return this.fb.group({
    producto: ['', [Validators.required]],
    cantidad: [1, [Validators.required, Validators.min(1)]],
    precio: [0, [Validators.required, Validators.min(0.01)]]
  });
}

// Añadir item al array
addItem(): void {
  this.items.push(this.createItemFormGroup());
}

// Eliminar item por índice
removeItem(index: number): void {
  this.items.removeAt(index);
}
```

### Componentes de formulario creados

| Componente     | Ubicación              | Características                                    |
|:---------------|:-----------------------|:---------------------------------------------------|
| `ContactForm`  | `shared/contact-form/` | Refactorizado a Reactive Forms con validaciones    |
| `RegisterForm` | `shared/register-form/`| Validadores custom, async y cross-field            |
| `OrderForm`    | `shared/order-form/`   | FormArray dinámico con cálculo de precio total     |

---

## FASE 4: SISTEMA DE RUTAS Y NAVEGACIÓN

### Mapa de Rutas de la Aplicación

```
/                           → Redirige a /home
├── /home                   → Página de Inicio
├── /productos              → Lista de Productos (Lazy Loading)
│   ├── /productos/nuevo    → Formulario nuevo producto (Guard: pendingChanges)
│   └── /productos/:id      → Detalle de producto (Resolver: productResolver)
├── /about                  → Sobre Nosotros (Lazy Loading Standalone)
├── /contacto               → Página de Contacto
├── /curiosidades           → Curiosidades de Dinosaurios
├── /style-guide            → Guía de Estilos
├── /login                  → Inicio de Sesión (Lazy Loading Standalone)
├── /admin                  → Panel Admin (Guard: authGuard, Lazy Loading Módulo)
│   ├── /admin/dashboard    → Dashboard (Lazy Loading)
│   ├── /admin/productos    → Gestión de Productos (Lazy Loading)
│   │   └── /admin/productos/:id/editar → Editar (Guard: pendingChanges)
│   └── /admin/usuarios     → Gestión de Usuarios (Lazy Loading)
└── /**                     → Página 404 (NotFound)
```

### Estrategia de Lazy Loading

La aplicación implementa **Lazy Loading** para optimizar el rendimiento inicial:

```typescript
// 1. Lazy Loading de Componentes Standalone
{
  path: 'about',
  loadComponent: () => import('./pages/about/about').then(m => m.About)
}

// 2. Lazy Loading de Módulo de Rutas (Admin)
{
  path: 'admin',
  loadChildren: () => import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
}

// 3. Preloading Strategy - Precarga todos los módulos en segundo plano
provideRouter(
  routes,
  withPreloading(PreloadAllModules),
  withComponentInputBinding()
)
```

| Tipo de Carga | Descripción | Ejemplo |
|:--------------|:------------|:--------|
| **Eager** | Se carga con la app inicial | Home, Contact, Curiosities |
| **Lazy Standalone** | Se carga al navegar a la ruta | About, Login, Productos |
| **Lazy Children** | Carga un módulo completo de rutas | Admin (dashboard, productos, usuarios) |

### Guards Implementados

#### 1. AuthGuard (CanActivateFn)
Protege rutas que requieren autenticación.

```typescript
// Ubicación: src/app/guards/auth.guard.ts
export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  const isLoggedIn = false; // Simular autenticación

  if (isLoggedIn) return true;

  // Redirigir a login con URL de retorno
  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};
```

**Uso:** Aplicado a `/admin` para proteger el panel de administración.

#### 2. PendingChangesGuard (CanDeactivateFn)
Previene la pérdida de datos en formularios sin guardar.

```typescript
// Ubicación: src/app/guards/pending-changes.guard.ts
export interface CanComponentDeactivate {
  canDeactivate(): boolean;
}

export const pendingChangesGuard: CanDeactivateFn<CanComponentDeactivate> = (component) => {
  if (component.canDeactivate && !component.canDeactivate()) {
    return confirm('¿Estás seguro? Tienes cambios sin guardar.');
  }
  return true;
};
```

**Uso:** Aplicado a `/productos/nuevo` y `/admin/productos/:id/editar`.

### Resolver Implementado

#### ProductResolver (ResolveFn)
Precarga datos del producto antes de mostrar la vista.

```typescript
// Ubicación: src/app/resolvers/product.resolver.ts
export const productResolver: ResolveFn<Product | null> = (route) => {
  const productService = inject(ProductService);
  const router = inject(Router);
  const productId = route.paramMap.get('id');

  return productService.getProductById(productId).pipe(
    catchError((error) => {
      // Redirigir con error en el state
      router.navigate(['/productos'], {
        state: { error: `Producto "${productId}" no encontrado` }
      });
      return of(null);
    })
  );
};
```

### Navegación Programática

```typescript
// 1. Navegación con parámetros de ruta
this.router.navigate(['/productos', productId]);

// 2. Navegación con queryParams (merge mantiene los existentes)
this.router.navigate(['/productos'], {
  queryParams: { category: 'figuras', page: 1 },
  queryParamsHandling: 'merge'
});

// 3. Navegación con state (datos ocultos, no en URL)
this.router.navigate(['/productos', productId], {
  state: {
    fromList: true,
    previousProduct: product,
    timestamp: Date.now()
  }
});

// Recuperar state en destino
const state = history.state;
if (state?.fromList) {
  console.log('Navegación desde lista');
}
```

### Breadcrumbs Dinámicos

El sistema de breadcrumbs se construye automáticamente basándose en la propiedad `data.breadcrumb` de cada ruta:

```typescript
// Configuración en rutas
{
  path: 'productos',
  data: { breadcrumb: 'Productos' },
  children: [
    { path: ':id', data: { breadcrumb: 'Detalle' } }
  ]
}

// BreadcrumbService escucha NavigationEnd
this.router.events
  .pipe(filter(event => event instanceof NavigationEnd))
  .subscribe(() => this.generateBreadcrumbs());
```

**Componente:** `src/app/components/shared/breadcrumb/`

### Archivos Creados en Fase 4

| Archivo | Ubicación | Descripción |
|:--------|:----------|:------------|
| `auth.guard.ts` | `guards/` | Guard de autenticación |
| `pending-changes.guard.ts` | `guards/` | Guard para formularios |
| `product.resolver.ts` | `resolvers/` | Resolver de productos |
| `product.service.ts` | `services/` | Servicio de productos |
| `breadcrumb.service.ts` | `services/` | Servicio de breadcrumbs |
| `breadcrumb/` | `components/shared/` | Componente visual |
| `product-list/` | `pages/products/` | Lista de productos |
| `product-detail/` | `pages/products/` | Detalle de producto |
| `product-form/` | `pages/products/` | Formulario de producto |
| `about/` | `pages/` | Página About |
| `login/` | `pages/` | Página de Login |
| `not-found/` | `pages/` | Página 404 |
| `admin/` | `pages/` | Módulo de administración |

---

## FASE 5: HTTP CLIENT Y SERVICIOS

### Arquitectura HTTP

La aplicación implementa una arquitectura robusta para comunicación HTTP con el servidor:

```
┌─────────────────────────────────────────────────────────────────────────┐
│                      ARQUITECTURA HTTP (FASE 5)                         │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────┐    ┌──────────────────┐    ┌──────────────────┐         │
│  │ Componente│ -> │ ProductService   │ -> │ ApiService       │ ──┐     │
│  │ (Lista)   │    │ (Lógica negocio) │    │ (HTTP wrapper)   │   │     │
│  └───────────┘    └──────────────────┘    └──────────────────┘   │     │
│       ↑                                                           │     │
│       │              ┌────────────────────────────────────────────┘     │
│       │              ↓                                                  │
│       │         ┌─────────────────────────────────────────────┐        │
│       │         │           INTERCEPTORES                      │        │
│       │         ├─────────────────────────────────────────────┤        │
│       │         │ 1. authInterceptor    → Headers Auth        │        │
│       │         │ 2. loggingInterceptor → Console logging     │        │
│       │         │ 3. errorInterceptor   → Manejo errores      │        │
│       │         └─────────────────────────────────────────────┘        │
│       │                        │                                        │
│       │                        ↓                                        │
│       │                  ┌──────────┐                                  │
│       └──────────────────│   API    │                                  │
│         (Observable)     │  REST    │                                  │
│                          └──────────┘                                  │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Configuración de HttpClient

```typescript
// app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),                          // Usa Fetch API nativa
      withInterceptors([
        authInterceptor,                    // 1. Headers de autenticación
        loggingInterceptor,                 // 2. Logging (solo dev)
        errorInterceptor                    // 3. Manejo global de errores
      ])
    )
  ]
};
```

### Interceptores Funcionales

#### 1. Auth Interceptor
Añade headers de autenticación a todas las peticiones hacia la API.

```typescript
// core/interceptors/auth.interceptor.ts
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const isApiRequest = req.url.startsWith(environment.apiUrl);
  
  if (!isApiRequest) return next(req);

  const token = localStorage.getItem(environment.tokenKey);
  
  const modifiedReq = req.clone({
    setHeaders: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      'X-App-Client': `${environment.appName}/${environment.appVersion}`,
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
  });

  return next(modifiedReq);
};
```

#### 2. Logging Interceptor
Registra información de peticiones/respuestas (solo en desarrollo).

```typescript
// core/interceptors/logging.interceptor.ts
export const loggingInterceptor: HttpInterceptorFn = (req, next) => {
  if (!environment.enableLogging) return next(req);

  const startTime = performance.now();
  
  console.log(`[HTTP] → ${req.method} ${req.url}`);

  return next(req).pipe(
    tap(event => {
      if (event instanceof HttpResponse) {
        const elapsed = Math.round(performance.now() - startTime);
        console.log(`[HTTP] ← ${req.method} ${req.url} (${event.status}) - ${elapsed}ms`);
      }
    })
  );
};
```

#### 3. Error Interceptor
Captura y transforma errores HTTP globalmente.

```typescript
// core/interceptors/error.interceptor.ts
const ERROR_MESSAGES: Record<number, string> = {
  400: 'La solicitud contiene datos inválidos.',
  401: 'Tu sesión ha expirado. Inicia sesión nuevamente.',
  403: 'No tienes permisos para realizar esta acción.',
  404: 'El recurso solicitado no fue encontrado.',
  500: 'Error en el servidor. Intenta más tarde.',
};

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      const errorInfo: HttpErrorInfo = {
        code: error.status,
        message: error.message,
        friendlyMessage: ERROR_MESSAGES[error.status] || 'Error desconocido',
        timestamp: new Date(),
        url: req.url,
      };

      // Redirigir a login si 401
      if (error.status === 401) {
        router.navigate(['/login']);
      }

      return throwError(() => errorInfo);
    })
  );
};
```

### ApiService (Servicio Base)

Wrapper genérico sobre HttpClient que centraliza la comunicación HTTP.

```typescript
// core/services/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.apiUrl;

  get<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> {
    return this.http.get<T>(this.buildUrl(endpoint), this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  post<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> {
    return this.http.post<T>(this.buildUrl(endpoint), body, this.buildOptions(options))
      .pipe(catchError(this.handleError));
  }

  put<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> { ... }
  patch<T>(endpoint: string, body: unknown, options?: ApiRequestOptions): Observable<T> { ... }
  delete<T>(endpoint: string, options?: ApiRequestOptions): Observable<T> { ... }

  // Subida de archivos con FormData
  uploadFile<T>(endpoint: string, file: File, fieldName = 'file'): Observable<T> {
    const formData = new FormData();
    formData.append(fieldName, file, file.name);
    return this.http.post<T>(this.buildUrl(endpoint), formData);
  }
}
```

### ProductService (CRUD Completo)

Implementa todas las operaciones CRUD con tipado estricto y operadores RxJS.

| Método | HTTP | Endpoint | Descripción |
|:-------|:-----|:---------|:------------|
| `getProducts()` | GET | `/products` | Lista todos los productos |
| `getProductById(id)` | GET | `/products/:id` | Obtiene un producto por ID |
| `getFeaturedProducts()` | GET | `/products/featured` | Productos destacados |
| `search(params)` | GET | `/products/search` | Búsqueda con paginación y filtros |
| `getProductsByCategory(cat)` | GET | `/products?category=cat` | Filtra por categoría |
| `createProduct(dto)` | POST | `/products` | Crea un producto (JSON) |
| `updateProduct(id, dto)` | PUT | `/products/:id` | Actualiza un producto |
| `deleteProduct(id)` | DELETE | `/products/:id` | Elimina un producto |
| `uploadImage(id, file)` | POST | `/products/:id/image` | Sube imagen (FormData) |

#### Operadores RxJS Utilizados

```typescript
// Ejemplo de getProducts() con operadores
getProducts(): Observable<Product[]> {
  return this.api.get<Product[]>(this.endpoint).pipe(
    retry(2),                                    // Reintenta 2 veces en caso de error
    map(products => this.transformProducts(products)),  // Transforma datos
    tap(products => this.productsCache.set(products)),  // Actualiza caché local
    catchError(error => this.handleError('getProducts', error))
  );
}

// Búsqueda con HttpParams
search(params: ProductSearchParams): Observable<PaginatedResponse<Product>> {
  const httpParams = this.buildSearchParams(params);
  return this.api.get<PaginatedResponse<Product>>(`${this.endpoint}/search`, {
    params: httpParams
  });
}
```

### Gestión de Estados con Signals

El componente `ProductListComponent` implementa gestión de estados reactiva:

```typescript
// Estado del componente
interface ProductListState {
  loading: boolean;
  error: string | null;
  data: Product[];
  successMessage: string | null;
}

// Signal principal
readonly state = signal<ProductListState>({
  loading: true,
  error: null,
  data: [],
  successMessage: null
});

// Computed signals para UI
readonly hasProducts = computed(() => this.state().data.length > 0);
readonly isEmpty = computed(() => !this.state().loading && !this.state().error && this.state().data.length === 0);
readonly hasError = computed(() => !!this.state().error);
readonly isLoading = computed(() => this.state().loading);
readonly hasSuccess = computed(() => !!this.state().successMessage);
```

#### Estados de UI Implementados

| Estado | Descripción | UI |
|:-------|:------------|:---|
| **Loading** | Cargando datos | Spinner animado con dinosaurio |
| **Error** | Error en petición | Alerta roja + botón reintentar |
| **Empty** | Sin productos | Mensaje + botón añadir |
| **Success** | Operación exitosa | Toast verde auto-dismiss |
| **Data** | Productos cargados | Grid de cards |

### Tabla de Endpoints API

| Método | URL | Descripción | Body |
|:-------|:----|:------------|:-----|
| GET | `/api/products` | Lista productos | - |
| GET | `/api/products/:id` | Detalle producto | - |
| GET | `/api/products/featured` | Productos destacados | - |
| GET | `/api/products/search?category=x&page=1` | Búsqueda paginada | - |
| POST | `/api/products` | Crear producto | JSON: CreateProductDto |
| PUT | `/api/products/:id` | Actualizar producto | JSON: UpdateProductDto |
| DELETE | `/api/products/:id` | Eliminar producto | - |
| POST | `/api/products/:id/image` | Subir imagen | FormData: file |

---

## FASE 6: GESTIÓN DE ESTADO Y ACTUALIZACIÓN DINÁMICA

### Arquitectura de Estado con Angular Signals

La aplicación implementa un patrón de gestión de estado centralizado usando **Angular Signals** (Angular 17+), evitando la sobreingeniería de NgRx y aprovechando las ventajas de rendimiento de las señales nativas.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE ESTADO (FASE 6)                      │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────┐    ┌──────────────────┐    ┌──────────────────┐         │
│  │ Componente│ <- │ ProductStore     │ <- │ ProductService   │         │
│  │  (OnPush) │    │ (Signals)        │    │ (HTTP/API)       │         │
│  └───────────┘    └──────────────────┘    └──────────────────┘         │
│       │                    │                       │                    │
│       │   ┌────────────────┴────────────────┐     │                    │
│       │   │     ESTADO CENTRALIZADO         │     │                    │
│       │   ├─────────────────────────────────┤     │                    │
│       │   │ • products: signal<Product[]>   │     │                    │
│       │   │ • loading: signal<boolean>      │     │                    │
│       │   │ • error: signal<string | null>  │     │                    │
│       │   │ • searchTerm: signal<string>    │     │                    │
│       │   │ • currentPage: signal<number>   │     │                    │
│       │   └─────────────────────────────────┘     │                    │
│       │                    │                       │                    │
│       │   ┌────────────────┴────────────────┐     │                    │
│       │   │     COMPUTED SIGNALS            │     │                    │
│       │   ├─────────────────────────────────┤     │                    │
│       │   │ • filteredProducts (auto-filter)│     │                    │
│       │   │ • paginatedProducts (slicing)   │     │                    │
│       │   │ • totalPages (calculated)       │     │                    │
│       │   │ • isEmpty, hasError (UI states) │     │                    │
│       │   └─────────────────────────────────┘     │                    │
│       │                                           │                    │
│       └───────────────────────────────────────────┘                    │
│                     Reactividad Automática                              │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### ¿Por qué Angular Signals en lugar de NgRx?

| Criterio | Angular Signals | NgRx | BehaviorSubject |
|:---------|:----------------|:-----|:----------------|
| **Complejidad** | Baja | Alta (boilerplate) | Media |
| **Curva de aprendizaje** | Rápida | Lenta | Media |
| **Rendimiento** | Óptimo (fine-grained) | Bueno | Bueno |
| **Integración Angular** | Nativa (17+) | Librería externa | RxJS |
| **Detección de cambios** | Automática con OnPush | Manual con async pipe | Manual |
| **Caso de uso ideal** | Apps medianas | Apps enterprise complejas | Casos simples |

**Decisión:** Signals es la opción recomendada por Angular para nuevos proyectos. Proporciona reactividad fine-grained sin el boilerplate de NgRx, manteniendo código limpio y fácil de mantener.

### ProductStore - Implementación del Patrón Store

```typescript
// src/app/store/product.store.ts
@Injectable({ providedIn: 'root' })
export class ProductStore {
  // ═══════════════════════════════════════════════════════════════
  // ESTADO PRIVADO (Signals mutables internamente)
  // ═══════════════════════════════════════════════════════════════
  private readonly _products = signal<Product[]>([]);
  private readonly _loading = signal<boolean>(false);
  private readonly _error = signal<string | null>(null);
  private readonly _searchTerm = signal<string>('');
  private readonly _currentPage = signal<number>(1);
  private readonly _pageSize = signal<number>(10);

  // ═══════════════════════════════════════════════════════════════
  // SELECTORES PÚBLICOS (Solo lectura)
  // ═══════════════════════════════════════════════════════════════
  readonly products = this._products.asReadonly();
  readonly loading = this._loading.asReadonly();
  readonly error = this._error.asReadonly();

  // ═══════════════════════════════════════════════════════════════
  // COMPUTED SIGNALS (Datos derivados automáticos)
  // ═══════════════════════════════════════════════════════════════
  readonly filteredProducts = computed(() => {
    let result = this._products();
    const search = this._searchTerm().toLowerCase();
    if (search) {
      result = result.filter(p => 
        p.name.toLowerCase().includes(search)
      );
    }
    return result;
  });

  readonly totalPages = computed(() => 
    Math.ceil(this.filteredProducts().length / this._pageSize())
  );

  readonly paginatedProducts = computed(() => {
    const start = (this._currentPage() - 1) * this._pageSize();
    return this.filteredProducts().slice(start, start + this._pageSize());
  });

  // ═══════════════════════════════════════════════════════════════
  // ACCIONES CRUD (Actualización inmutable)
  // ═══════════════════════════════════════════════════════════════
  add(product: CreateProductDto): void {
    this.productService.createProduct(product).subscribe({
      next: (newProduct) => {
        // ⚡ Actualización inmutable - UI se actualiza automáticamente
        this._products.update(products => [...products, newProduct]);
      }
    });
  }

  delete(id: string): void {
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        // ⚡ Actualización inmutable - El producto desaparece instantáneamente
        this._products.update(products => 
          products.filter(p => p.id !== id)
        );
      }
    });
  }
}
```

### Optimización de Rendimiento

#### 1. ChangeDetectionStrategy.OnPush

Todos los componentes que consumen el Store usan `OnPush` para optimizar la detección de cambios:

```typescript
@Component({
  selector: 'app-product-list',
  changeDetection: ChangeDetectionStrategy.OnPush,  // ✅ Solo re-renderiza cuando cambian inputs o signals
  // ...
})
export class ProductListComponent {
  readonly store = inject(ProductStore);
  // Los signals del store disparan re-render automáticamente
}
```

**Beneficio:** Angular solo verifica cambios cuando:
- Cambia un `@Input()`
- Se dispara un evento en el template
- Un Signal cambia de valor (fine-grained reactivity)

#### 2. TrackBy en Listas (@for con track)

El nuevo control flow de Angular 17+ incluye `track` obligatorio para optimizar listas:

```html
<!-- ✅ Angular 17+ @for con track -->
@for (product of store.paginatedProducts(); track product.id) {
  <article class="product-card">
    <!-- ... -->
  </article>
}
```

**Beneficio:** Angular identifica elementos únicos por `id`, evitando re-crear elementos DOM que no cambiaron.

#### 3. Limpieza Automática de Suscripciones

Usamos `takeUntilDestroyed()` para limpieza automática sin `OnDestroy`:

```typescript
export class ProductListComponent {
  private readonly destroyRef = inject(DestroyRef);

  ngOnInit(): void {
    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntilDestroyed(this.destroyRef)  // ✅ Se limpia automáticamente
    ).subscribe(term => {
      this.store.setSearchTerm(term);
    });
  }
}
```

### Búsqueda Reactiva con Debounce

La búsqueda implementa `debounceTime` para evitar saturar la UI y mejorar UX:

```typescript
// Configuración del FormControl reactivo
readonly searchControl = new FormControl<string>('', { nonNullable: true });

private setupSearchDebounce(): void {
  this.searchControl.valueChanges.pipe(
    debounceTime(300),           // ⏱️ Espera 300ms después de que el usuario deje de escribir
    distinctUntilChanged(),      // 🔄 Solo emite si el valor cambió
    takeUntilDestroyed(this.destroyRef)
  ).subscribe(term => {
    this.store.setSearchTerm(term);  // Actualiza el store → UI reacciona
  });
}
```

```html
<!-- Template con FormControl -->
<input 
  type="text"
  [formControl]="searchControl"
  placeholder="Buscar productos..."
/>
```

**UX lograda:**
- ✅ Sin parpadeos mientras el usuario escribe
- ✅ Solo filtra cuando el usuario "termina" de escribir
- ✅ Actualización instantánea del grid

### Actualización Dinámica sin Recargas

**Requisito cumplido:** La UI se actualiza inmediatamente tras operaciones CRUD sin usar `window.location.reload()`.

```typescript
// ❌ PROHIBIDO - Recarga toda la página
window.location.reload();

// ✅ CORRECTO - Actualización reactiva con Signals
this._products.update(products => products.filter(p => p.id !== id));
// El computed `paginatedProducts` se recalcula automáticamente
// El componente con OnPush detecta el cambio y re-renderiza
```

| Operación | Actualización UI | Mantiene Scroll | Sin Parpadeo |
|:----------|:-----------------|:----------------|:-------------|
| **Create** | Producto aparece al final | ✅ | ✅ |
| **Update** | Producto se actualiza in-place | ✅ | ✅ |
| **Delete** | Producto desaparece | ✅ | ✅ |
| **Search** | Lista se filtra | ✅ | ✅ |
| **Paginate** | Lista cambia de página | ✅ | ✅ |

### Paginación Reactiva

La paginación es completamente reactiva usando computed signals:

```typescript
// Store
readonly totalPages = computed(() =>
  Math.ceil(this.filteredProducts().length / this._pageSize()) || 1
);

readonly hasPreviousPage = computed(() => this._currentPage() > 1);
readonly hasNextPage = computed(() => this._currentPage() < this.totalPages());

goToPage(page: number): void {
  if (page >= 1 && page <= this.totalPages()) {
    this._currentPage.set(page);
    // paginatedProducts se recalcula automáticamente
  }
}
```

```html
<!-- Template -->
@if (store.totalPages() > 1) {
  <nav class="product-list__pagination">
    <button [disabled]="!store.hasPreviousPage()" (click)="previousPage()">
      <span class="material-icons">chevron_left</span>
    </button>
    
    <span>Página {{ store.viewState().pagination.currentPage }} de {{ store.totalPages() }}</span>
    
    <button [disabled]="!store.hasNextPage()" (click)="nextPage()">
      <span class="material-icons">chevron_right</span>
    </button>
  </nav>
}
```

---

## FASE 7: TESTING, OPTIMIZACIÓN Y ENTREGA FINAL

### Arquitectura de Testing

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ARQUITECTURA DE TESTING (FASE 7)                     │
├─────────────────────────────────────────────────────────────────────────┤
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                    TESTS UNITARIOS                                 │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ • ApiService.spec.ts      (15 tests) - HTTP mock testing          │ │
│  │ • ProductService.spec.ts  (23 tests) - CRUD + cache testing       │ │
│  │ • ProductStore.spec.ts    (50 tests) - State management testing   │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                 TESTS DE COMPONENTES                               │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ • Home.spec.ts            (20 tests) - UI + interactions          │ │
│  │ • ContactForm.spec.ts     (30 tests) - Form validation            │ │
│  │ • ProductList.spec.ts     (25 tests) - List + filters + CRUD      │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
│  ┌───────────────────────────────────────────────────────────────────┐ │
│  │                 TESTS DE INTEGRACIÓN                               │ │
│  ├───────────────────────────────────────────────────────────────────┤ │
│  │ • product-crud.integration.spec.ts (15 tests)                     │ │
│  │   - Flujo CRUD completo sin recargar página                       │ │
│  │   - Búsqueda + Filtros + Paginación combinados                    │ │
│  │   - Selección y edición reactiva                                  │ │
│  │   - Computed signals y manejo de errores                          │ │
│  └───────────────────────────────────────────────────────────────────┘ │
│                                                                         │
└─────────────────────────────────────────────────────────────────────────┘
```

### Cobertura de Tests

| Tipo | Archivos | Tests | Estado |
|:-----|:---------|:------|:-------|
| Servicios | 3 | 88 | ✅ 100% |
| Componentes | 10+ | 80+ | ✅ |
| Integración | 1 | 15 | ✅ |
| **Total** | **17** | **219** | ✅ **Todos pasando** |

### Optimización de Rendimiento

#### ChangeDetectionStrategy.OnPush

Componentes optimizados con `OnPush` para reducir ciclos de detección de cambios:

| Componente | Tipo | OnPush |
|:-----------|:-----|:-------|
| ProductListComponent | Smart | ✅ |
| Card | Presentacional | ✅ |
| Alert | Presentacional | ✅ |
| Toast | Presentacional | ✅ |
| Button | Presentacional | ✅ |
| Modal | Presentacional | ✅ |
| Tooltip | Presentacional | ✅ |
| LoadingOverlay | Presentacional | ✅ |
| Footer | Layout | ✅ |

#### TrackBy en Listas

Todas las listas usan `track` en el nuevo `@for` de Angular 17+:

```html
@for (product of store.paginatedProducts(); track product.id) {
  <app-card [product]="product" />
}
```

#### Búsqueda con Debounce

```typescript
this.searchControl.valueChanges.pipe(
  debounceTime(300),           // ⏱️ Espera 300ms
  distinctUntilChanged(),      // 🔄 Solo si cambió
  takeUntilDestroyed(this.destroyRef)
).subscribe(term => {
  this.store.setSearchTerm(term);
});
```

### Build de Producción

```
Bundle Analysis (Production Build)
══════════════════════════════════════════════════════════
Initial Bundle:
  - main.js:           483.56 kB → 108.62 kB (gzip)
  - polyfills.js:       33.23 kB →  11.27 kB (gzip)
  - styles.css:          8.61 kB →   1.97 kB (gzip)
  
Lazy Loaded Chunks:
  - profile:            30.14 kB →   5.76 kB (gzip)
  - product-list:       19.59 kB →   4.28 kB (gzip)
  - product-form:       13.72 kB →   3.30 kB (gzip)
  - about:               6.75 kB →   1.90 kB (gzip)
  - login:               5.32 kB →   1.55 kB (gzip)

Total Transfer Size: ~132 kB (gzip) ✅
══════════════════════════════════════════════════════════
```

### Decisiones Técnicas Justificadas

#### ¿Por qué Vitest en lugar de Karma/Jasmine?

| Criterio | Vitest | Karma/Jasmine |
|:---------|:-------|:--------------|
| Velocidad | ⚡ Muy rápido (ESM nativo) | 🐢 Lento (bundle completo) |
| Configuración | Mínima (Angular 17+) | Compleja |
| HMR en tests | ✅ Sí | ❌ No |
| Compatibilidad | Angular 17+ nativo | Legacy |
| Sintaxis | Similar a Jest | Jasmine |

**Decisión:** Vitest es el runner de tests recomendado por Angular 17+ y proporciona mejor DX.

#### ¿Por qué Angular Signals en lugar de NgRx?

| Criterio | Signals | NgRx |
|:---------|:--------|:-----|
| Boilerplate | Mínimo | Extenso (actions, reducers, effects) |
| Curva de aprendizaje | Baja | Alta |
| Rendimiento | Fine-grained reactivity | Bueno |
| Tamaño del bundle | 0 KB (nativo) | ~15 KB |
| Caso de uso | Apps pequeñas/medianas | Enterprise |

**Decisión:** Signals es suficiente para el tamaño de esta aplicación y reduce complejidad.

#### ¿Por qué OnPush en componentes presentacionales?

- **Reduce ciclos de CD:** Solo re-renderiza cuando cambian `@Input()` o signals
- **Mejora rendimiento:** Menos trabajo para el framework
- **Fuerza inmutabilidad:** Mejor arquitectura de datos

### Compatibilidad Cross-Browser

| Característica | Chrome | Firefox | Safari | Edge |
|:---------------|:-------|:--------|:-------|:-----|
| Angular Signals | ✅ | ✅ | ✅ | ✅ |
| @for / @if | ✅ | ✅ | ✅ | ✅ |
| CSS Variables | ✅ | ✅ | ✅ | ✅ |
| FormControl | ✅ | ✅ | ✅ | ✅ |
| Lazy Loading | ✅ | ✅ | ✅ | ✅ |

### Changelog

#### v1.0.0 - Fase 7 (Testing y Optimización)

**Testing:**
- ✅ Añadidos 88 tests para servicios (ApiService, ProductService, ProductStore)
- ✅ Añadidos 80+ tests para componentes (Home, ContactForm, ProductList)
- ✅ Añadido test de integración para flujo CRUD completo
- ✅ Coverage total: 219 tests pasando

**Optimización:**
- ✅ ChangeDetectionStrategy.OnPush en 9 componentes presentacionales
- ✅ Build de producción optimizado (~132 KB transfer size)
- ✅ Lazy loading para todas las rutas secundarias

**Documentación:**
- ✅ README actualizado con arquitectura de testing
- ✅ Justificación de decisiones técnicas
- ✅ Changelog añadido

