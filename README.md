# EducaDino

Proyecto final sobre AppWeb educativa
Desplegado en: https://trevictus.github.io/EducaDino/

---

# Guía de Configuración y Ejecución del Proyecto

Sigue los siguientes pasos para descargar, instalar y ejecutar el proyecto en tu entorno local.

## 1. Descargar el repositorio
Clona el repositorio desde GitHub utilizando la terminal o descárgalo como archivo ZIP.

```bash
git clone <URL_DEL_REPOSITORIO>
```

## 2. Abrir con WebStorm
Abre el proyecto con WebStorm.

## 3. Instalar dependencias
Abre la terminal desde el **directorio raíz** del proyecto y ejecuta:

```bash
npm install
```

## 4. Iniciar el proyecto
Con la terminal abierta en el directorio raíz, ejecuta el siguiente comando para levantarlo en el puerto 4200:

```bash
npm start
```

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
