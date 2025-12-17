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

