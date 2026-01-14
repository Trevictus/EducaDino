# EducaDino

Proyecto final sobre AppWeb educativa  
Desplegado en: https://trevictus.github.io/EducaDino/

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

