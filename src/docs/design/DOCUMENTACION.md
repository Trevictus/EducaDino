# EducaDino

Proyecto final sobre AppWeb educativa
Desplegado en: https://trevictus.github.io/EducaDino/

---

# Sección 1: Arquitectura CSS y Comunicación Visual

Esta sección documenta las decisiones de diseño, la estructura del código y las metodologías implementadas en el proyecto para asegurar escalabilidad, mantenimiento y coherencia visual.

---

## 1.1 Principios de Comunicación Visual

A continuación, se detalla cómo se aplican los 5 principios básicos del diseño en la interfaz, con ejemplos directos del prototipo en Figma.

### 1. Jerarquía
**Estrategia:**
En la página de inicio utilizamos una variable `--font-size-5xl: 48px;` en un texto bajo un mapa, para indicar claramente que el primer paso es interactuar con este para ver información educativa acerca de los dinosaurios. Este texto utiliza `<h1>` para destacar su importancia, mientras que los subtítulos y descripciones emplean tamaños de fuente más pequeños como `text-2xl` y `text-xl`, respectivamente. Además, el peso de la fuente se ajusta para enfatizar títulos (Bold) frente a párrafos (Regular), guiando así la atención del usuario de manera efectiva.


**Captura en Figma:**
![Jerarquia1.png](../images/Jerarquia1.png)
*Descripción: En esta captura se observa cómo el Título H1 domina sobre la composicion incluso denotandose que está cortado y no termina la frase.*

![Jerarquia2.png](../images/Jerarquia2.png)
*Descripción: Una vez que se lee el texto da a entender que el mapa es interactivo.*

### 2. Contraste
**Estrategia:**  
El color destaca los elementos de la interfaz, por lo que es importante que los colores sean contrastantes. Estos se usan para botones que llaman la atención del usuario indicando que puede clicar en ellos.  

En este proyecto se utilizan para los botones, los colores `primary-color: #3A737D;` de fondo y `--text-color-light: #FDF2EE;` de texto resaltante. Estos botones resaltan sobre un fondo `--background-color: #D6E18D;` para que el usuario esté dispuesto a pulsar en ellos ya que se ven con facilidad.  

En cuanto a los botones de "cancelar", "no", "aceptar" y "si" utilizan el color `--support-color: #EF7B51;` y el color `--secondary-color: #65C1BE;` con color de texto `--text-color: #3A4243;` llamando la atención de una acción importante con texto oscuro sobre fondo claro. El usuario sabe que debe pulsar el botón.

**Captura en Figma:**  
![Contraste1.png](../images/Contraste1.png)
*Descripción: El botón de "Minijuegos" junto a los demás utilizan el contraste de colores para resaltar sobre el fondo*  

**Captura en Figma:**  
![Contraste2.png](../images/Contraste2.png)
*Los botones de "Cancelar" y "No" utilizan otro tipo de contraste para resaltar que son botones importantes, al igual que los botones de "Aceptar" y "Si".*

### 3. Alineación
**Estrategia:**  
Se emplea una alineación central para los títulos de sección "Curiosidades" y "Formulario de contacto" para equilibrar la página. El contenido se estructura mediante un sistema de Grid, donde las tarjetas se alinean horizontalmente compartiendo el mismo eje superior, creando orden y estabilidad.

**Captura en Figma:**
![Alineacion1](../images/Alineacion1.png)
*Descripción: Las tarjetas están perfectamente alineadas y centradas en una guía de disposición.*

**Captura en Figma:**
![Alineacion2](../images/Alineación2.png)
*Descripción: Los elementos del formulario están perfectamente alineados a la izquierda siguiendo la guía de columnas.*

### 4. Proximidad
**Estrategia:**  
Los elementos relacionados se agrupan para formar unidades lógicas. En la tarjeta de curiosidad, el texto explicativo se mantiene cerca de su título correspondiente. El botón de "siguiente curiosidad" y el icono de "corazón" están agrupados en la zona inferior de la tarjeta, separados del texto informativo, indicando que son herramientas de interacción y no de lectura.  

**Captura en Figma:**  
![Proximidad1](../images/Proximidad1.png)  
*Descripción: El botón y el icono forman un bloque funcional separado del bloque de texto mediante espaciado.*

### 5. Repetición
**Estrategia:**
Para mantener la coherencia cognitiva, se repiten patrones visuales clave: el mismo radio de borde redondeado de 25px en tarjetas y botones, la misma paleta de colores y la misma tipografía `Fredoka One` para títulos. Esto permite al usuario aprender rápidamente cómo funciona la interfaz: "si tiene forma redondeada y es verde oscuro, es un botón".

**Captura en Figma:**  
![Repeticion1](../images/Repeticion1.png)
*Descripción: La repetición de la estructura de las tarjetas crea un estilo visual consistente.*

**Captura en Figma:**  
![Repeticion2](../images/Repeticion2.png)
*Descripción: La repetición de los radios de borde, paleta de colores y tipografía, también se dan en los formularios, aparte de en muchos otros elementos.*
---

## 1.2 Metodología CSS

Se utiliza la metodología **BEM (Block, Element, Modifier)** para mantener un código CSS modular, reutilizable y fácil de entender.

**BEM**, evita conflictos de especificidad. Hace que el HTML y el CSS sean auto-explicativos. Facilita el mantenimiento en equipos.


**Ejemplo de código con tarjeta de curiosidad:**
```scss
// 05-components/_card.scss

.dino-card {
  display: flex;
  flex-direction: column;

  background-color: var(--background-color);
  border-radius: var(--radius-xl);
  padding: var(--spacing-4);
  box-shadow: var(--shadow-md);

  /* Efecto al pasar el ratón */
  transition: transform var(--transition-fast);

  &:hover {
    transform: translateY(-5px);
    box-shadow: var(--shadow-lg);
  }

  /* Encabezado */
  &__category {
    font-family: var(--font-secondary); /* Fredoka One */
    font-size: var(--font-size-3xl);
    color: var(--primary-color-active);
    text-align: center;
    margin-bottom: var(--spacing-2);
  }

  /* Contenedor de la imagen */
  &__media {
    width: 100%;
    height: 200px;
    object-fit: cover;
    border-radius: var(--radius-lg);
    background-color: #fff;
    margin-bottom: var(--spacing-3);
  }

  /* Título específico */
  &__title {
    font-family: var(--font-secondary);
    font-size: var(--font-size-2xl);
    color: var(--primary-color-active);
    line-height: 1.1;
    margin-bottom: var(--spacing-2);
  }

  /* Texto descriptivo */
  &__description {
    font-family: var(--font-primary);
    font-size: var(--font-size-lg);
    color: var(--primary-color);
    margin-bottom: var(--spacing-4);
    flex-grow: 1; /* Esto hace que el texto ocupe el espacio disponible */
  }

  /* Botón y Corazón */
  &__footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: auto;
  }

  /* Corazón */
  &__icon {
    color: var(--primary-color);
    font-size: 1.5rem;
    cursor: pointer;
    transition: color var(--transition-fast), transform var(--transition-fast);

    &.is-liked {
      color: var(--support-color); // Tu naranja (#EF7B51)
    }
  }
}
```
---
## 1.3 Organización de archivos

El proyecto utiliza la arquitectura **IInverted Triangle CSS** o **ITCSS**, organizando los estilos de menor a mayor especificidad. Esta estructura se refleja en el árbol de carpetas del proyecto:

**Estructura de Carpetas:**

```text
src/
└── styles/
    ├── 00-settings/
    │   └── _variables.scss      # Variables globales
    ├── 01-tools/
    │   └── _mixins.scss         # Mixins
    ├── 02-generic/
    │   └── _reset.scss          # Box-sizing
    ├── 03-elements/
    │   └── _base.scss           # Estilos de etiquetas HTML base
    ├── 04-objects/
    │   └── _layout.scss         # Contenedores y Grid
    ├── 05-components/           # Componentes con BEM
    │   ├── _buttons.scss        # Botones
    │   ├── _card.scss           # Tarjetas de dinosaurios
    │   └── _header.scss         # Barra de navegación
    └── 06-utilities/
        └── main.scss
```

1.  **Settings (`00-settings`):** Contiene variables de configuración, tokens de diseño de colores y fuentes, que no generan CSS por sí mismas.
2.  **Tools (`01-tools`):** Contiene mixins y funciones Sass que se reutilizarán en el proyecto.
3.  **Generic (`02-generic`):** Resetea los estilos del navegador (`_reset.scss`) para asegurar consistencia entre diferentes navegadores.
4.  **Elements (`03-elements`):** Define la apariencia base de las etiquetas HTML sin clases, como el estilo por defecto de `body` o `h1`.
5.  **Objects (`04-objects`):** Define patrones de estructura y esqueleto, como el sistema de grid y contenedores.
6.  **Components (`05-components`):** Aquí se construyen los widgets específicos de la interfaz con estética propia (`_card.scss`, `_header.scss`, `_buttons.scss`).
7.  **Utilities (`06-utilities`):** Clase con más especificidad.

---

## 1.4 Sistema de Design Tokens

A la identidad visual se le da forma mediante `00-settings/_variables.scss`. El diseño responde a la temática "Jurásica/Infantil":

* **Paleta de Color:**
  * `--primary-color` (#3A737D): Tono verde azulado oscuro para elementos principales y serios.
  * `--background-color` (#D6E18D): Tono amarillo verdoso claro para el fondo, suave para la vista.
  * `--support-color` (#EF7B51): Naranja arcilla para destacar alertas o elementos "favoritos", aportando calidez y contraste.
* **Tipografía:**
  * **Títulos (`--font-secondary`):** `'Fredoka One'`, fuente display redondeada y gruesa de carácter amigable.
  * **Cuerpo (`--font-primary`):** `'Baloo 2'`, fuente sans-serif legible y suave.
* **Bordes:**
  * Uso de radios grandes (`--radius-xl`) para evocar seguridad y suavidad, dirigido al público infantil.
* **Brakpoints:**  
  * Se ha adoptado una escala de breakpoints moderna y estandarizada similar a la de Tailwind CSS para asegurar la compatibilidad con los dispositivos actuales.
  * Esta escala cubre de manera fluida las transiciones de móvil (1 columna) a tablet (2 columnas) y escritorio (3/4 columnas), garantizando que el diseño sea Mobile-First y escale progresivamente.

---

## 1.5 Mixins y funciones

El archivo `01-tools/_mixins.scss` contiene herramientas Sass diseñadas para aplicar el principio DRY, estandarizando elementos y la lógica responsiva.

### 1. Mixin: `button-secondary`
Genera los estilos visuales y de comportamiento para los botones de la interfaz. Define bordes redondeados asimétricos, la tipografía, el espaciado y los hover y active.

* **Propósito:** Crear botones consistentes que utilizan las variables de color primario y fuentes secundarias, incluyendo animaciones de elevación al pasar el cursor.

    ```scss
    .btn-intro {
      @include button-secondary;
    }
    ```

### 2. Mixin: `input-field`
Estandariza todos los campos de entrada de datos del sitio.

* **Propósito:** Asegura que todos los formularios tengan el mismo ancho completo, fondo gris claro, bordes redondeados (`--radius-form-field`) y tipografía base. El estado `:focus` añade un anillo de color suave para mejorar la accesibilidad y el estado del placeholder.

    ```scss
    input[type="text"],
    input[type="email"],
    textarea {
      @include input-field;
    }
    ```

### 3. Mixin: `respond-to-max`
Gestiona la creación de Media Queries siguiendo **Desktop-First**. Utiliza breakpoints predefinidos para aplicar estilos únicamente en pantallas más pequeñas que el valor indicado (`max-width`).

* **Mapas definidos:** `sm` (640px), `md` (768px), `lg` (1024px), `xl` (1280px), `2xl` (1536px).
* **Propósito:** Facilita la escritura de CSS partiendo de la versión de escritorio como base predeterminada y adaptándola regresivamente hacia dispositivos móviles. Incluye validación para evitar el uso de breakpoints inexistentes.

    ```scss
    .dino-card {
      width: 33.33%; // Estilo base para Escritorio (3 columnas)

      /* Se aplica en pantallas más pequeñas que 'md' (768px) */
      @include respond-to-max('md') {
        width: 100%; // Estilo para Móvil/Tablet (1 columna)
      }
    }
    ```

---

## 1.6 Sistema de Layout y Presentación

Para organizar la información de manera ordenada, el proyecto implementa un sistema de contenedores, grids y capas que estructuran el contenido de forma jerárquica.

### Contenedores

Los contenedores son estructuras que envuelven el contenido, centrándolo y limitando su ancho máximo para asegurar legibilidad en pantallas grandes:

```scss
// 04-objects/_layout.scss

.l-container {
  width: 100%;
  max-width: var(--breakpoint-xl);   /* Limita el ancho máximo */
  margin-right: auto;                /* Centra horizontalmente */
  margin-left: auto;
  padding-right: var(--spacing-4);   /* Espacio interno lateral */
  padding-left: var(--spacing-4);

  /* En pantallas grandes, más espaciado */
  @media (min-width: 1280px) {
    padding-right: var(--spacing-8);
    padding-left: var(--spacing-8);
  }
}
```

### Sistema Grid

Se utiliza CSS Grid para disponer los elementos en filas y columnas de forma automática. La configuración `auto-fit` permite que las tarjetas se reorganicen según el ancho disponible:

```scss
.l-grid {
  display: grid;
  gap: var(--spacing-4);
}

/* Grid adaptativa para tarjetas */
.l-grid--auto-fit {
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

Este sistema crea automáticamente:
- **1 columna** en móviles (< 640px)
- **2 columnas** en tablets (640px - 1024px)
- **3 o más columnas** en escritorio (> 1024px)

### Sistema Flexbox

Para disposiciones lineales y alineación de elementos, se utilizan clases utilitarias de Flexbox:

```scss
.l-flex {
  display: flex;
  flex-wrap: wrap;
  gap: var(--spacing-4);
}

.l-flex--center {
  justify-content: center;
  align-items: center;
}

.l-flex--between {
  justify-content: space-between;
  align-items: center;
}
```

### Capas y z-index

Los elementos flotantes como modales, toasts y el header utilizan un sistema de capas mediante `z-index` para asegurar la correcta superposición:

| Elemento | z-index | Descripción |
|----------|---------|-------------|
| Contenido base | 1 | Tarjetas, secciones |
| Header sticky | 100 | Navegación fija |
| Modal overlay | 1000 | Fondo oscuro del modal |
| Modal content | 1001 | Contenido del modal |
| Toast | 9999 | Notificaciones siempre visibles |

---

## 1.7 Estilos Base y Redefinición de Elementos HTML

Una de las ventajas de usar hojas de estilos externas es la capacidad de modificar y redefinir la apariencia por defecto de las etiquetas HTML. Esto se realiza en la capa `03-elements/_base.scss`.

### Reset de Navegador

Primero, se eliminan los estilos predeterminados del navegador para partir de una base consistente:

```scss
// 02-generic/_reset.scss

/* Modelo de caja universal */
*,
*::before,
*::after {
  box-sizing: border-box;
}

/* Eliminar márgenes predeterminados */
body, h1, h2, h3, h4, h5, h6, p, figure, blockquote {
  margin: 0;
}

/* Imágenes responsive por defecto */
img, picture, video, canvas, svg {
  display: block;
  max-width: 100%;
}

/* Heredar fuentes en formularios */
input, button, textarea, select {
  font: inherit;
}
```

### Redefinición de Etiquetas

Después del reset, se aplican los nuevos estilos que redefinen la apariencia de cada etiqueta HTML, estableciendo la identidad visual del proyecto:

```scss
// 03-elements/_base.scss

/* Cuerpo del documento */
body {
  background-color: var(--background-color);
  color: var(--text-color);
  font-family: var(--font-primary);       /* Baloo 2 */
  font-size: var(--font-size-xl);         /* 16px */
  line-height: var(--line-height-normal); /* 1.5 */
}

/* Encabezados con tipografía secundaria */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-secondary);     /* Fredoka One */
  color: var(--text-color);
  margin-bottom: var(--spacing-3);
  line-height: var(--line-height-tight);
}

/* Escala tipográfica redefinida */
h1 { font-size: var(--font-size-5xl); }   /* 48px */
h2 { font-size: var(--font-size-4xl); }   /* 36px */
h3 { font-size: var(--font-size-3xl); }   /* 24px */
h4 { font-size: var(--font-size-2xl); }   /* 20px */

/* Párrafos con ancho máximo para legibilidad */
p {
  margin-bottom: var(--spacing-2);
  max-width: 65ch;   /* Límite de caracteres por línea */
}

/* Negritas destacadas */
b, strong {
  font-weight: var(--font-weight-bold);
  color: var(--primary-color-active);
}

/* Citas con estilo distintivo */
blockquote {
  font-family: var(--font-secondary);
  border-left: var(--border-thick) solid var(--support-color);
  background-color: var(--background-color-hover);
  padding: var(--spacing-3);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
}
```

Esta redefinición garantiza que cualquier etiqueta HTML usada en el proyecto adopte automáticamente la estética de EducaDino sin necesidad de añadir clases adicionales.

---

## 1.8 Propiedades CSS Clave

A continuación se detallan las propiedades CSS más utilizadas en el proyecto, agrupadas por categoría funcional.

### Propiedades de Modelo de Caja

| Propiedad | Uso en el proyecto | Ejemplo |
|-----------|-------------------|---------|
| `padding` | Espaciado interno en botones, tarjetas y contenedores | `padding: var(--spacing-2) var(--spacing-4)` |
| `margin` | Separación entre elementos y centrado horizontal | `margin: 0 auto` |
| `border-radius` | Bordes redondeados para suavidad visual | `border-radius: var(--radius-xl)` |
| `box-shadow` | Profundidad y elevación de elementos | `box-shadow: var(--shadow-md)` |
| `border` | Contorno de inputs y botones | `border: var(--border-thin) solid transparent` |

### Propiedades de Posicionamiento

| Propiedad | Uso en el proyecto | Ejemplo |
|-----------|-------------------|---------|
| `display: flex` | Alineación de elementos en header, footer y botones | `display: flex; gap: var(--spacing-2)` |
| `display: grid` | Distribución de tarjetas en cuadrículas | `grid-template-columns: repeat(auto-fit, minmax(280px, 1fr))` |
| `position: fixed` | Elementos flotantes como toast y header sticky | `position: fixed; top: 0; z-index: 100` |
| `position: absolute` | Puntos interactivos sobre el mapa | `position: absolute; top: 20%; left: 30%` |

### Propiedades de Tipografía

| Propiedad | Uso en el proyecto | Ejemplo |
|-----------|-------------------|---------|
| `font-family` | Distinción entre títulos y cuerpo de texto | `font-family: var(--font-secondary)` |
| `font-size` | Escala tipográfica consistente | `font-size: var(--font-size-3xl)` |
| `font-weight` | Énfasis en elementos importantes | `font-weight: var(--font-weight-bold)` |
| `line-height` | Legibilidad en bloques de texto | `line-height: var(--line-height-normal)` |
| `text-align` | Alineación de títulos y contenido | `text-align: center` |

### Propiedades de Color y Fondo

| Propiedad | Uso en el proyecto | Ejemplo |
|-----------|-------------------|---------|
| `background-color` | Fondos de secciones y componentes | `background-color: var(--primary-color)` |
| `color` | Color de texto según contexto | `color: var(--text-color-light)` |
| `border-color` | Bordes en estados de focus y error | `border-color: var(--support-color)` |
| `opacity` | Estados deshabilitados | `opacity: 0.5` |

### Propiedades de Transición y Animación

| Propiedad | Uso en el proyecto | Ejemplo |
|-----------|-------------------|---------|
| `transition` | Suavizado en hover y cambios de estado | `transition: all var(--transition-fast) ease` |
| `transform` | Elevación de botones y tarjetas al hover | `transform: translateY(-2px)` |
| `animation` | Entrada de toasts y modales | `animation: toastSlideIn 0.3s ease-out` |

---

## 1.9 ViewEncapsulation en Angular

**Emulated:** `ViewEncapsulation.Emulated`.

He elegido la configuración estándar de Angular porque ofrece el mejor equilibrio entre orden y flexibilidad:

* **Protección de Estilos aislados:** Garantiza que el diseño específico de un componente, como el color de una tarjeta, se quede dentro de ese componente y no rompa accidentalmente el diseño de otras partes de la web.
* **Conexión Global:** A pesar de tener su propia "cápsula", los componentes pueden seguir utilizando los estilos generales definidos en la arquitectura principal, algo que otras opciones de aislamiento más estrictas impedirían.
* **Facilidad de uso:** Nos permite aplicar clases de ayuda generales como las de centrar texto o márgenes en cualquier lugar de la aplicación sin configuraciones extra.

---

## 2. HTML Semántico y Estructura

### 2.1 Elementos semánticos utilizados
En el proyecto se han sustituido los `div` por etiquetas de HTML5 para mejorar el SEO.

* **`<header>`**: Contenedor de la cabecera.
  * *Uso:* En `app-header`, contiene el logo, la navegación y el perfil.
* **`<nav>`**: Navegación principal.
  * *Uso:* Dentro del header para los enlaces.
* **`<main>`**: Contenido principal único de cada vista.
  * *Uso:* En `app-main` envuelve el `router-outlet`.
* **`<section>`**: Agrupación temática de contenido.
  * *Uso:* Para dividir la Home (`.home-page__map-section`, `.home-page__trends-section`).
* **`<article>`**: Contenido independiente.
  * *Uso:* En el componente `app-card`, ya que cada curiosidad es un ítem con sentido propio.
* **`<aside>`**: Contenido relacionado con el principal.
  * *Uso:* En la página de Contacto para las ilustraciones de los dinosaurios laterales que decoran.
* **`<footer>`**: Pie de página.
  * *Uso:* En `app-footer`, contiene información legal y enlaces secundarios.

**Ejemplo de código de Contacto:**
```html
<section class="contact-page">
  <aside class="contact-page__side-img">...</aside>
  
  <div class="contact-page__form-container">
    <h1>Formulario de contacto</h1>
    <app-contact-form></app-contact-form>
  </div>
  
  <aside class="contact-page__side-img">...</aside>
</section>
```

---

### 2.2 Jerarquía de headings
Se sigue una estructura de encabezados para facilitar la lectura por buscadores.

**Reglas:**
1.  **`<h1>`**: Solo uno por página (vista). Representa el título principal.
2.  **`<h2>`**: Títulos de secciones principales dentro de la página.
3.  **`<h3>`**: Subtítulos de componentes como las tarjetas.
4.  No se saltan niveles.

**Diagrama de jerarquía actual:**

```text
Sitio Web
├── Header
│
├── Página: Home
│   ├── h1: "¡Mira nuestro mapa interactivo!"
│   │
│   └── Section: Tendencias
│       ├── h2: "Tendencias"
│       └── Article: Card
│           └── h3: "No eran para pelear"
│
├── Página: Contacto
│   └── h1: "Formulario de contacto"
│
└── Footer
    └── Títulos de columnas maquetados con estructura plana
```

---

### 2.3 Estructura de Formularios
Los formularios se reutilizan, cumpliendo con los estándares.


* **Agrupación:** Uso de `<fieldset>` para agrupar campos relacionados lógicamente y `<legend>` para titular dicho grupo.
* **Accesibilidad:** Asociación entre `label` e `input` mediante los atributos `for` en el label e `id` en el input.
* **Componentes:** Uso de `app-form-input` para encapsular la lógica.

**Ejemplo del componente `form-input`:**

```html
<label [for]="inputId" class="form-group__label">
  {{ label }}
</label>

<input 
  [id]="inputId"
  [type]="type"
  [name]="name"
  [required]="required"
  class="form-group__input"
>

@if (errorText) {
  <p class="form-group__error">{{ errorText }}</p>
}
```

---

# Sección 3: Sistema de Componentes UI

## 3.1 Catálogo de Componentes

### 1. Header (`app-header`)
**Propósito:** Barra de navegación principal con logo, enlaces y acceso al perfil de usuario.

**Opciones (@Input):** Ninguna configurable externamente.

```html
<app-header></app-header>
```

---

### 2. Footer (`app-footer`)
**Propósito:** Pie de página con información legal, enlaces secundarios y redes sociales.

**Opciones (@Input):** Ninguna configurable externamente.

```html
<app-footer></app-footer>
```

---

### 3. Card (`app-card`)
**Propósito:** Tarjeta reutilizable para mostrar curiosidades de dinosaurios con imagen, título, descripción y botón de favorito.

**Opciones (@Input):**
| Input | Tipo | Descripción |
|-------|------|-------------|
| `category` | `string` | Categoría de la curiosidad |
| `imageSrc` | `string` | Ruta de la imagen |
| `imageAlt` | `string` | Texto alternativo de la imagen |
| `title` | `string` | Título de la curiosidad |
| `description` | `string` | Texto descriptivo |

```html
<app-card
  category="Alimentación"
  imageSrc="assets/images/trex.png"
  imageAlt="Tyrannosaurus Rex"
  title="No eran para pelear"
  description="Los cuernos del Triceratops servían para atraer pareja.">
</app-card>
```

---

### 4. Button (`app-button`)
**Propósito:** Botón reutilizable con diferentes variantes visuales.

**Opciones (@Input):**
| Input | Tipo | Valores | Descripción |
|-------|------|---------|-------------|
| `variant` | `string` | `'primary'`, `'secondary'`, `'support'` | Estilo visual del botón |
| `type` | `string` | `'button'`, `'submit'` | Tipo HTML del botón |
| `disabled` | `boolean` | `true`, `false` | Estado deshabilitado |

```html
<app-button variant="primary" type="submit">Enviar</app-button>
<app-button variant="support" (click)="cancelar()">Cancelar</app-button>
```

---

### 5. Form Input (`app-form-input`)
**Propósito:** Campo de formulario encapsulado con label, validación y mensajes de error.

**Opciones (@Input):**
| Input | Tipo | Descripción |
|-------|------|-------------|
| `inputId` | `string` | ID único para asociar label e input |
| `label` | `string` | Texto del label |
| `type` | `string` | Tipo de input (`text`, `email`, etc.) |
| `name` | `string` | Nombre del campo |
| `required` | `boolean` | Campo obligatorio |
| `errorText` | `string` | Mensaje de error a mostrar |

```html
<app-form-input
  inputId="email"
  label="Correo electrónico"
  type="email"
  name="email"
  [required]="true"
  errorText="El correo no es válido">
</app-form-input>
```

---

### 6. Contact Form (`app-contact-form`)
**Propósito:** Formulario de contacto completo con campos de nombre, email, asunto y mensaje.

**Opciones (@Input):** Ninguna configurable externamente.

```html
<app-contact-form></app-contact-form>
```

---

### 7. Toast (`app-toast`)
**Propósito:** Notificación emergente para mostrar mensajes de éxito, error o información al usuario.

**Opciones (@Input):**
| Input | Tipo | Valores | Descripción |
|-------|------|---------|-------------|
| `message` | `string` | — | Texto del mensaje |
| `type` | `string` | `'success'`, `'error'`, `'info'` | Estilo visual de la notificación |
| `visible` | `boolean` | `true`, `false` | Controla la visibilidad |

```html
<app-toast
  message="¡Mensaje enviado correctamente!"
  type="success"
  [visible]="showToast">
</app-toast>
```

---

### 8. Modal (`app-modal`)
**Propósito:** Ventana modal para confirmaciones o mostrar contenido superpuesto.

**Opciones (@Input):**
| Input | Tipo | Descripción |
|-------|------|-------------|
| `isOpen` | `boolean` | Controla si el modal está abierto |
| `title` | `string` | Título del modal |

**Opciones (@Output):**
| Output | Descripción |
|--------|-------------|
| `close` | Evento emitido al cerrar el modal |

```html
<app-modal [isOpen]="modalAbierto" title="Confirmar acción" (close)="cerrarModal()">
  <p>¿Estás seguro de que deseas continuar?</p>
  <app-button variant="secondary" (click)="confirmar()">Sí</app-button>
  <app-button variant="support" (click)="cerrarModal()">No</app-button>
</app-modal>
```

---

## 3.2 Nomenclatura BEM en el Proyecto

### Bloque y Elemento (`bloque__elemento`)

El bloque representa un componente independiente, y el elemento es una parte interna que solo tiene sentido dentro del bloque.

**Ejemplo de `_card.scss`:**

```scss
.dino-card {                    /* Bloque */
  display: flex;
  flex-direction: column;

  &__category {                 /* Elemento: categoría */
    font-family: var(--font-secondary);
    font-size: var(--font-size-3xl);
  }

  &__media {                    /* Elemento: imagen */
    width: 100%;
    height: 200px;
  }

  &__title {                    /* Elemento: título */
    font-size: var(--font-size-2xl);
  }

  &__footer {                   /* Elemento: pie de tarjeta */
    display: flex;
    justify-content: space-between;
  }
}
```

---

### Modificador (`bloque--modificador`)

Los modificadores alteran la apariencia o comportamiento de un bloque o elemento.

**Ejemplo de `_buttons.scss`:**

```scss
.btn {                          /* Bloque */
  padding: var(--spacing-2) var(--spacing-4);
  border-radius: var(--radius-lg);

  &--primary {                  /* Modificador: estilo primario */
    background-color: var(--primary-color);
    color: var(--text-color-light);
  }

  &--secondary {                /* Modificador: estilo secundario */
    background-color: var(--secondary-color);
    color: var(--text-color);
  }

  &--support {                  /* Modificador: estilo de soporte */
    background-color: var(--support-color);
    color: var(--text-color);
  }
}
```

---

### Estado (`.is-*` / `.has-*`)

Las clases de estado indican condiciones dinámicas que cambian según la interacción del usuario.

**Ejemplo de `_card.scss`:**

```scss
.dino-card__icon {
  color: var(--primary-color);
  cursor: pointer;
  transition: color var(--transition-fast);

  &.is-liked {                  /* Estado: marcado como favorito */
    color: var(--support-color);
  }
}
```

**Ejemplo de `_form-input.scss`:**

```scss
.form-group__input {
  border: 2px solid transparent;

  &:focus {
    border-color: var(--primary-color);
  }

  &.has-error {                 /* Estado: campo con error */
    border-color: var(--support-color);
  }
}
```

---

# Sección 4: Estrategia Responsive

La estrategia responsive del proyecto EducaDino se enfoca **Desktop-First** invertido hacia **Mobile-First**, utilizando una escala de breakpoints estandarizada similar a Tailwind CSS. Esta estrategia garantiza que la aplicación ofrezca una experiencia de usuario óptima en dispositivos de todos los tamaños: desde smartphones hasta monitores de alta resolución.

---

## 4.1 Breakpoints Definidos

Los breakpoints del proyecto están organizados en 5 puntos de ruptura principales, definidos en `00-settings/_variables.scss`:

| Nombre | Ancho (px) | Dispositivo | Casos de uso |
|--------|-----------|-----------|------------|
| `sm` | 640px | Móviles grandes | Finales de rangos móvil (iPhone 12, etc.) |
| `md` | 768px | Tablets | iPad y tablets pequeñas |
| `lg` | 1024px | Laptops | Computadoras portátiles estándar |
| `xl` | 1280px | Pantallas grandes | Monitores de escritorio |
| `2xl` | 1536px | Monitores anchos | Pantallas ultra-wide |

```scss
// 00-settings/_variables.scss

/*Breakpoint genérico basado en la escala moderna del estilo tailwind*/
:root {
  --breakpoint-sm: 640px;   /*Móviles grandes*/
  --breakpoint-md: 768px;   /*Tablets*/
  --breakpoint-lg: 1024px;  /*Laptops*/
  --breakpoint-xl: 1280px;  /*Pantallas grandes*/
  --breakpoint-2xl: 1536px; /*Monitores anchos*/
}
```

**Justificación de la elección:**

La escala de breakpoints se basa en el estándar moderno de Tailwind CSS, que ha demostrado ser efectivo para cubrir la mayoría de dispositivos actuales. Estos puntos de ruptura reflejan los tamaños reales de pantalla más comunes, permitiendo:

- **Transiciones suaves:** Cada breakpoint marca un cambio significativo en el contexto de uso del dispositivo (pequeño a medio, medio a grande, etc.).
- **Compatibilidad:** Cubre desde dispositivos móviles antiguos (iPhone 5S: 640px) hasta monitores 4K (1536px+).
- **Escalabilidad:** La escala es suficientemente granular para ajustar detalles sin ser excesivamente compleja.

---

## 4.2 Enfoque Desktop-First a Mobile-First

Aunque el proyecto implementa media queries con `max-width` (Desktop-First), la filosofía general es **Mobile-First**: los estilos base están optimizados para funcionar correctamente en dispositivos móviles, y luego se añaden mejoras progresivas para pantallas mayores.

### Estrategia de Media Queries: `max-width`

El proyecto utiliza la metodología **Desktop-First invertida**, donde se definen estilos base para la experiencia de escritorio y luego se adaptan con media queries `(max-width)` para dispositivos más pequeños. Esto se logra mediante el **mixin `respond-to-max`**:

```scss
// 01-tools/_mixins.scss

@mixin respond-to-max($breakpoint) {
  $breakpoints: (
    'sm': 640px,
    'md': 768px,
    'lg': 1024px,
    'xl': 1280px,
    '2xl': 1536px
  );

  @if map-has-key($breakpoints, $breakpoint) {
    @media (max-width: map-get($breakpoints, $breakpoint)) {
      @content;
    }
  } @else {
    @warn "El breakpoint '#{$breakpoint}' no es válido. Usa: sm, md, lg, xl, 2xl.";
  }
}
```

### Ejemplo Práctico: Tarjeta de Dinosaurio

El componente `.dino-card` demuestra esta estrategia:

```scss
// 05-components/_card.scss

.dino-card__category {
  font-family: var(--font-secondary);
  font-size: var(--font-size-3xl);  /* Estilo base: 24px */
  color: var(--primary-color-active);
  text-align: center;
  margin: 0;

  /* Reducción progresiva del tamaño en pantallas más pequeñas */
  @media (max-width: 1024px) {
    font-size: var(--font-size-2xl);  /* 20px */
  }

  @media (max-width: 768px) {
    font-size: var(--font-size-2xl);  /* 20px */
  }
}

.dino-card__description {
  font-family: var(--font-primary);
  font-size: var(--font-size-lg);    /* Estilo base: 14px */
  color: var(--primary-color-active);
  margin: 0;
  
  /* En tablets y móviles, se reduce aún más */
  @media (max-width: 1024px) {
    font-size: var(--font-size-sm);   /* 12px */
  }

  @media (max-width: 768px) {
    font-size: var(--font-size-sm);   /* 12px */
  }
}
```

**Ventajas de este enfoque:**

1. **Accesibilidad móvil prioritaria:** Los estilos base garantizan que el contenido sea legible y funcional en dispositivos móviles.
2. **Escalabilidad:** Mejoras visuales se añaden de forma incremental para pantallas mayores sin romper la experiencia base.
3. **Rendimiento:** Los navegadores móviles no procesan estilos innecesarios para desktop, reduciendo el overhead.

---

## 4.3 Sistema de Grid Adaptativo

El proyecto utiliza CSS Grid con la propiedad `auto-fit` para crear diseños que se adaptan automáticamente al ancho disponible:

```scss
// 04-objects/_layout.scss

.l-grid--auto-fit {
  display: grid;
  gap: var(--spacing-4);
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
}
```

**Comportamiento automático:**

| Rango de Pantalla | Resultado |
|-------------------|-----------|
| < 280px (ancho muy pequeño) | 1 columna |
| 280px - 560px | 1 columna (móvil) |
| 560px - 840px | 2 columnas (tablet pequeña) |
| 840px - 1120px | 3 columnas (tablet grande/laptop pequeña) |
| > 1120px | 4 columnas (desktop) |

Esta solución permite que las tarjetas se reorganicen de forma **completamente fluida** sin necesidad de media queries adicionales, proporcionando una experiencia óptima en cualquier resolución.

---

## 4.4 Contenedores Fluidos

Los contenedores del proyecto se comportan de forma fluida en diferentes tamaños de pantalla:

```scss
// 04-objects/_layout.scss

.l-container {
  width: 100%;
  max-width: var(--breakpoint-xl);     /* Máximo: 1280px */
  margin-right: auto;
  margin-left: auto;
  padding-right: var(--spacing-4);     /* Estilo base: 32px */
  padding-left: var(--spacing-4);

  /* En escritorio, más espaciado lateral */
  @media (min-width: 1280px) {
    padding-right: var(--spacing-8);   /* 64px */
    padding-left: var(--spacing-8);
  }
}
```

**Comportamiento:**

- **Móviles:** El contenedor usa 100% del ancho disponible con padding de 32px.
- **Desktop:** El contenedor se limita a 1280px de ancho máximo, centrándose con márgenes automáticos y padding de 64px para dejar espacios laterales más generosos.

---

## 4.5 Container Queries

Actualmente, el proyecto **no utiliza Container Queries** (`@container`). Sin embargo, esta es una estrategia futura recomendada para:

- **Componentes independientes:** Permitir que componentes como modales o tarjetas se adapten según el tamaño de su contenedor padre, no solo el viewport.
- **Reutilización mejorada:** Un mismo componente podría tener estilos diferentes según dónde se coloque (sidebar vs. contenedor principal).

**Caso de uso futuro:**

```scss
/* Ejemplo hipotético para un componente card que se adapta a su contenedor */
.card-container {
  container-type: inline-size;
}

@container (max-width: 300px) {
  .card {
    grid-template-columns: 1fr;  /* Apilado en contenedores pequeños */
  }
}

@container (min-width: 300px) {
  .card {
    grid-template-columns: 1fr 1fr;  /* 2 columnas en contenedores medianos */
  }
}
```

---

## 4.6 Vistas Responsive: Móvil, Tablet y Desktop

El proyecto responde a tres contextos principales de uso:

### Vista Móvil (< 768px)

**Características:**
- Una columna principal con contenido apilado verticalmente.
- Tamaños de fuente reducidos para máxima legibilidad sin zoom.
- Buttons y elementos táctiles con suficiente espacio (mínimo 44px de altura).
- Navegación simplificada o colapsable.

**Ejemplo de ruptura:**
- Tarjetas de curiosidades: 1 columna
- Formularios: Campos apilados verticalmente
- Headers: Menú hamburguesa

*[Vista Mobile](../images/vista-mobile.png)*

### Vista Tablet (768px - 1024px)

**Características:**
- Dos columnas para tarjetas y contenido.
- Espacio lateral para asides decorativos.
- Navegación en línea con botones más grandes.
- Buen balance entre contenido y espacio en blanco.

**Ejemplo de ruptura:**
- Tarjetas de curiosidades: 2 columnas
- Formularios: Campos en cuadrículas de 2 columnas (cuando procede)
- Layouts tipo "sidebar + contenido principal"

*[Vista Tablet](../images/vista-tablet.png)*

### Vista Desktop (> 1024px)

**Características:**
- Tres o más columnas para máximo aprovechamiento del espacio.
- Tamaños de fuente más grandes para confortabilidad de lectura.
- Spacing generoso para evitar aglomeración.
- Navegación completa con todos los opciones visibles.

**Ejemplo de ruptura:**
- Tarjetas de curiosidades: 3 columnas (grid auto-fit)
- Formularios: Campos en cuadrículas de 2-3 columnas
- Layouts complejos con múltiples sidebars

*[Vista Desktop](../images/vista-desktop.png)*

---

## 4.7 Puntos de Ruptura por Componente

Algunos componentes tienen necesidades específicas de responsive y usan media queries puntuales:

### Página de Contacto
```scss
// app/pages/contact/contact.scss

@media (max-width: 768px) {
  .contact-page {
    flex-direction: column;  /* De lado a lado a apilado */
  }
  
  .contact-page__side-img {
    display: none;  /* Ocultar imágenes decorativas en móvil */
  }
}
```

### Página de Curiosidades
```scss
// app/pages/curiosities/curiosities.scss

@media (max-width: var(--breakpoint-lg)) {
  .curiosities-page__grid {
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  }
}

@media (max-width: var(--breakpoint-md)) {
  .curiosities-page__grid {
    grid-template-columns: 1fr;  /* Una columna en tablet pequeña */
  }
}
```

---

## 4.8 Testing Responsive

Para validar que el diseño responde correctamente:

1. **Herramientas del navegador:** Usar DevTools de Chrome/Firefox con modo responsive para probar todos los breakpoints.
2. **Dispositivos reales:** Probar en smartphones, tablets y monitores externos.
3. **Viewports críticos:** Verificar especialmente en 320px (móvil pequeño), 768px (tablet) y 1280px (desktop).

**Recomendación:** Verificar que:
- No haya scrolling horizontal en ningún breakpoint.
- El texto sea legible sin necesidad de zoom.
- Los botones sean tocables (mínimo 44px en dispositivos táctiles).
- Las imágenes se adapten sin deformarse (usar `object-fit: cover`).

---

# Guía de Configuración y Ejecución del Proyecto

Estos son los pasos para descargar, instalar y ejecutar el proyecto en local.

## 1. Descargar el repositorio
Clona el repositorio con:

```bash
git clone https://github.com/Trevictus/EducaDino.git
```

## 2. Abrir con WebStorm
Abre el proyecto con WebStorm.

## 3. Instalar dependencias
Abre la terminal desde el **directorio raíz** del proyecto y ejecuta:

```bash
npm install
```

## 4. Iniciar el proyecto
Con la terminal abierta en el directorio raíz, ejecuta este comando para levantarlo en el puerto 4200:

```bash
npm start
```
