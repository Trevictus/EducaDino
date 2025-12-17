# EducaDino
Proyecto final sobre AppWeb educativa



# Frontend

_variables.scss -> variable de borde sobre botón perfil, es una estrella.

_mixings.scss -> revisar los mixings

## FASE 1: MANIPULACIÓN DEL DOM Y EVENTOS
### Arquitectura de eventos
La arquitectura de eventos en esta aplicación Angular sigue el patrón unidireccional de datos, utilizando bindings de eventos nativos del DOM como (click), (keydown) y (pointerdown) directamente en las plantillas de componentes standalone. Los eventos se capturan con la sintaxis (eventName)="handler($event)", donde $event proporciona acceso al objeto nativo del evento. Esta aproximación aprovecha Zone.js para detección de cambios automática.
Para flujos complejos, se centralizan eventos en servicios inyectables que usan EventEmitter o RxJS Subjects.

### Diagrama de flujo de eventos principales
Usuario → DOM Event (click/keydown)
      → Template Binding (event)
      → Component Handler ($event)
      → Service/State Update (signals/RxJS)
      → View Re-render (OnPush/Zone.js)

### Tabla de compatibilidad navegadores
| Evento | Chrome | Firefox | Safari | Edge |
| :--- | :--- | :--- | :--- | :--- |
| click | Full | Full | Full | Full |
| keydown/keyup | Full | Full | Full | Full |
| pointerdown | Full | Full | Full | Full |
| focus/blur | Full | Full | Full | Full |
| transitionend | Full | Full | Full | Full |

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
- Solo reciben datos via `@Input()` y emiten eventos via `@Output()`
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

| Servicio | Propósito | Patrón |
| :--- | :--- | :--- |
| `CommunicationService` | Comunicación entre componentes hermanos | BehaviorSubject + Observable |
| `ToastService` | Notificaciones globales (success, error, warning, info) | BehaviorSubject + Signal + Auto-dismiss |
| `LoadingService` | Estados de carga global con contador de peticiones | BehaviorSubject + Signal + Request Counter |
| `DinoService` | Datos centralizados de dinosaurios | BehaviorSubject + Signal + Computed |
| `ThemeService` | Modo oscuro/claro con persistencia | Signal + localStorage + matchMedia |

### Uso de Signals vs Observables

**Signals (Angular 17+):**
- Para estado local en templates: `isLoading = signal(false)`
- Para computed values: `favorites = computed(() => this.dinos().filter(d => d.liked))`
- Mejor rendimiento en templates sin `async` pipe

**Observables (RxJS):**
- Para streams de datos asíncronos
- Para operadores complejos (debounce, switchMap, etc.)
- Integración con HTTP Client
