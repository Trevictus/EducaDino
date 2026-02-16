# Documentación de accesibilidad - EducaDino

## Descripción general

EducaDino es una plataforma educativa interactiva enfocada en enseñar a los usuarios (principalmente niños) sobre dinosaurios a través de curiosidades, minijuegos y contenido multimedia. Este documento detalla el análisis exhaustivo de la accesibilidad del proyecto, las mejoras implementadas y el nivel de conformidad alcanzado con las directrices WCAG 2.1.

---

## 1. Fundamentos de accesibilidad

### ¿Por qué es necesaria la accesibilidad web?

La accesibilidad web es fundamental para garantizar que todas las personas, independientemente de sus capacidades, puedan acceder y usar una página web de manera equitativa. Afecta a usuarios con discapacidades visuales, auditivas, motoras y cognitivas. Además, beneficia a todos los usuarios (mejor navegación, contenido más claro), es obligatoria legalmente en Europa/España según la Directiva (UE) 2016/2102, y es simplemente lo correcto desde una perspectiva ética.

### Los 4 principios de WCAG 2.1

#### 1. **Perceptible:** La información debe poder percibirse por todos
- Los usuarios deben poder ver, escuchar o entender el contenido sin depender de un único sentido.
- Ejemplo en EducaDino: Las imágenes de dinosaurios en las tarjetas incluyen texto alternativo (`alt`) descriptivo, y el video tiene una transcripción completa en texto para usuarios sordos.

#### 2. **Operable:** La funcionalidad debe ser accesible sin ratón
- Todos los elementos interactivos deben funcionar con teclado y no debe haber "trampas" que bloqueen el uso.
- Ejemplo en EducaDino: Los botones "Siguiente curiosidad" y el icono de "me gusta" son accesibles por teclado con Tab y Enter.

#### 3. **Comprensible:** El contenido debe ser claro e inteligible
- El lenguaje debe ser simple, la estructura clara, y las instrucciones obvias.
- Ejemplo en EducaDino: El título "Curiosidades" es claro, las descripciones de dinosaurios usan un lenguaje accesible, y el flujo de navegación es lógico.

#### 4. **Robusto:** Compatible con tecnologías de asistencia
-  El código debe ser válido HTML/CSS para que lectores de pantalla, ampliadores y otras herramientas funcionen correctamente.
- Ejemplo en EducaDino: Usamos HTML5 semántico (`<article>`, `<h1>`, `<h2>`) y etiquetas ARIA cuando es necesario.

### Niveles de conformidad WCAG 2.1
**A**
- Es el nivel mínimo de cumplimiento.
- Cubre los requisitos esenciales para que una web sea usable por personas con discapacidad.
- Si no se cumple este nivel, algunas personas directamente no podrán usar la web.

**AA**
- Es el nivel recomendado para la mayoría de sitios web, especialmente institucionales o públicos.
- Mejora significativamente la experiencia para usuarios con distintas discapacidades.
- Es el nivel exigido por la legislación en muchos países.

**AAA**
- Es el nivel más alto y exigente.
- No siempre es posible cumplirlo en todos los tipos de contenido.
- Se orienta a ofrecer la mejor experiencia posible para todos los usuarios.

El proyecto **EducaDino** persigue alcanzar **nivel AA**, que es el estándar recomendado por la mayoría de normativas europeas.

---

## 2. Componentes multimedia implementados

### Componente 1: Tarjetas de curiosidades (app-card)

**Galería de tarjetas interactivas**

Componente reutilizable que muestra información sobre dinosaurios en formato de tarjeta. Cada tarjeta contiene: una imagen del dinosaurio, categoría, título, descripción, botón "Siguiente curiosidad" e icono de "me gusta". Las tarjetas permiten navegar por diferentes curiosidades de manera interactiva.

**Características de accesibilidad implementadas:**

- Cada imagen usa el atributo `alt` con el nombre del dinosaurio como texto alternativo.
- Todos los botones (Siguiente, Me gusta) son accesibles presionando Tab y activables con Enter.
- Usa `<article>` para cada tarjeta, `<h3>` para títulos, y `<button>` para elementos interactivos.
- Los elementos focusables tienen estilos CSS que muestran claramente cuál tiene el focus.

### Componente 2: Video documental

**Video incrustado de YouTube**

Video educativo sobre dinosaurios incrustado desde YouTube con la transcripción completa disponible en texto plano debajo del reproductor. Permite a usuarios sordos y con discapacidades auditivas acceder al contenido.

**Características de accesibilidad implementadas:**

- Atributo `title` en iframe: El iframe tiene un título descriptivo ("El Mundo de los Dinosaurios")
- Texto alternativo del video disponible, con timestamps para sincronización
- El video de YouTube tiene subtítulos disponibles (activables en la plataforma)
- Enlace a YouTube para usuarios que prefieran ver en otra plataforma

---

## 3. Auditoría automatizada inicial

### Resultados de auditoría

| Herramienta | Puntuación/Errores    | Captura |
|-------------|-----------------------|--------|
| **Lighthouse** | 92/100                | ![Lighthouse inicial](../capturas/lighthouse-antes-home.png) |
| **WAVE** | 35 errores, 6 alertas | ![WAVE inicial](../capturas/wave-antes-home.png) |
| **TAW** | 5 problemas           | |

### 3 problemas más graves detectados

**Contraste insuficiente en algunos elementos de texto** Lighthouse y WAVE
   - Afecta a usuarios con baja visión
   - Afecta especialmente en modo claro
   - Solución: Aumentar ratio de contraste a 4.5:1

**Falta de etiqueta `lang` en algunos componentes secundarios** WAVE y TAW
   - Afecta a lectores de pantalla
   - Puede causar mala pronunciación de palabras
   - Solución: Asegurar `lang="es"` en elementos raíz

**Icono "me gusta" sin etiqueta accesible** WAVE y TAW
   - Solo es un `<span>` clickeable sin texto
   - Los lectores de pantalla no saben qué es
   - Solución: Agregar atributos ARIA (`aria-label`, `aria-pressed`)

---

## 4. Análisis y corrección de errores

### Tabla resumen de errores encontrados y corregidos

| # | Error | Criterio WCAG | Herramienta | Estado |
|---|-------|---------------|-------------|--------|
| 1 | Icono "me gusta" sin etiqueta accesible | 4.1.2 | WAVE | Corregido |
| 2 | Imagen sin atributo `alt` en algunas tarjetas | 1.1.1 | WAVE | Corregido |
| 3 | Contraste insuficiente en texto secundario | 1.4.3 | Lighthouse | Corregido |
| 4 | Iframe de video sin atributo `title` | 1.1.1 | TAW | Corregido |
| 5 | Botón "Siguiente" sin `:focus` visible | 2.4.7 | Lighthouse | Corregido |

---

#### Error #1: Icono "me gusta" sin etiqueta accesible

**Problema:** 
El icono de corazón era un `<span>` clickeable sin descripción. Los lectores de pantalla no sabían qué era ni para qué servía.

**Impacto:** 
Usuarios ciegos o con baja visión no podían entender la función del elemento interactivo.

**Criterio WCAG:** 
4.1.2 - Nombre, función y valor

**Código ANTES:**
```html
<span
  class="dino-card__icon material-icons"
  [class.is-liked]="isLiked"
  (click)="toggleLike()">
  favorite
</span>
```

**Código DESPUÉS:**
```html
<button
  class="dino-card__icon material-icons"
  [attr.aria-label]="isLiked ? 'Quitar de favoritos' : 'Añadir a favoritos'"
  [attr.aria-pressed]="isLiked"
  (click)="toggleLike()">
  favorite
</button>
```

---

#### Error #2: Imagen sin atributo `alt` en algunas tarjetas

**Problema:** 
Algunos dinosaurios de relleno tenían imágenes sin texto alternativo.

**Impacto:** 
Usuarios ciegos reciben un anuncio de "imagen" sin saber qué contiene.

**Criterio WCAG:** 
1.1.1 - Contenido no textual

**Código ANTES:**
```html
<img
  [src]="image"
  class="dino-card__media"
  loading="lazy">
```

**Código DESPUÉS:**
```html
<img
  [src]="image"
  [alt]="title"
  class="dino-card__media"
  loading="lazy">
```

---

#### Error #3: Contraste insuficiente en texto secundario

**Problema:** 
El texto de categoría (ej: "Comportamiento") tenía color gris (#999) sobre fondo claro, resultando en ratio de contraste de 3.5:1 (insuficiente para WCAG AA).

**Impacto:** 
Usuarios con baja visión o daltonismo no pueden leer el texto claramente.

**Criterio WCAG:** 
1.4.3 - Contraste mínimo

**Código ANTES (SCSS):**
```scss
.dino-card__category {
  color: #999;
  font-size: 0.85rem;
  font-weight: 600;
}
```

**Código DESPUÉS (SCSS):**
```scss
.dino-card__category {
  color: #555;
  font-size: 0.85rem;
  font-weight: 600;
}
```

---

#### Error #4: Iframe de video sin atributo `title`

**Problema:** 
El iframe de YouTube no tenía un atributo `title` descriptivo.

**Impacto:** 
Los lectores de pantalla no podían identificar el contenido del iframe.

**Criterio WCAG:** 
1.1.1 - Contenido no textual

**Código ANTES:**
```html
<iframe
  class="curiosities__video"
  src="https://www.youtube.com/embed/pNL1K3WriRU"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

**Código DESPUÉS:**
```html
<iframe
  class="curiosities__video"
  src="https://www.youtube.com/embed/pNL1K3WriRU"
  title="El Mundo de los Dinosaurios - Documental educativo"
  frameborder="0"
  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
  allowfullscreen>
</iframe>
```

---

#### Error #5: Botón "Siguiente" sin `:focus` visible

**Problema:** 
El botón "Siguiente curiosidad" no mostraba claramente cuándo tenía el focus del teclado.

**Impacto:** 
Usuarios que navegan solo con teclado no saben dónde está el cursor.

**Criterio WCAG:** 
2.4.7 - Focus visible

**Código ANTES (SCSS):**
```scss
.dino-card__btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  // Sin estilos de :focus
}
```

**Código DESPUÉS (SCSS):**
```scss
.dino-card__btn {
  background: linear-gradient(135deg, #ff6b6b, #ee5a6f);
  color: white;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  transition: all 0.2s ease;
  
  &:focus-visible {
    outline: 3px solid #2c3e50;
    outline-offset: 2px;
    transform: scale(1.05);
  }
  
  &:focus {
    outline: 3px solid #2c3e50;
    outline-offset: 2px;
  }
}
```

---

## 5. Análisis de estructura semántica

### Landmarks HTML5 utilizados

- [x] `<header>` - Cabecera con logo y navegación (en layout)
- [x] `<nav>` - Menú de navegación principal (en layout)
- [x] `<main>` - Contenido principal de cada página
- [x] `<section>` - Agrupación de contenido (ej: curiosities)
- [x] `<article>` - Tarjetas individuales de curiosidades
- [x] `<footer>` - Pie de página con info

### Jerarquía de encabezados

```
H1: Curiosidades
  H2: Documental: El mundo de los dinosaurios
    H3: Transcripción completa

[En las demás páginas]
H1: Home
H1: Minijuegos
H1: Perfil
H1: Contacto
```

No hay saltos de nivel, la estructura es lógica y jerárquica.

### Análisis de imágenes

| Aspecto | Número | Estado |
|---------|--------|--------|
| **Total de imágenes** | 33+ | - |
| **Con texto alternativo** | 33+ | ✅ |
| **Decorativas (alt="")** | 0 | - |
| **Usando `<picture>` responsive** | 6 | ✅ |
| **Con `loading="lazy"`** | 27+ | ✅ |
| **Sin alt (requería corrección)** | 0 | Todas corregidas |

---

## 6. Verificación manual

### 6.1 Test de navegación por teclado

Se realizó prueba completa de navegación usando solo teclado (Tab, Shift+Tab, Enter, Esc):

- [x] Puedo llegar a todos los enlaces y botones con Tab
- [x] El orden de navegación es lógico (de arriba a abajo, izquierda a derecha)
- [x] Veo claramente qué elemento tiene el focus (outline visible)
- [x] Puedo usar los botones de la tarjeta solo con teclado
- [x] No hay trampas de teclado
- [x] Los modals se pueden cerrar con Esc

**Problemas encontrados:** Ninguno

**Soluciones aplicadas:** Se agregaron estilos `:focus-visible` mejorados en botones y enlaces.

---

### 6.2 Test con lector de pantalla (NVDA)

Se realizó verificación usando NVDA (Non Visual Desktop Access) en Windows.

| Aspecto evaluado | Resultado | Observación |
|------------------|-----------|-------------|
| ¿Se entiende la estructura sin ver la pantalla? | ✅ | NVDA anuncia correctamente "Sección Curiosidades", encabezados, y estructura |
| ¿Los landmarks se anuncian correctamente? | ✅ | Se anuncian "navegación", "región principal", "contentinfo" |
| ¿Las imágenes tienen descripciones adecuadas? | ✅ | NVDA lee "Imagen: Triceratops", "Imagen: Velociraptor", etc. |
| ¿Los enlaces tienen textos descriptivos? | ✅ | El enlace "YouTube" es claro, no hay "Haz clic aquí" |
| ¿El componente multimedia es accesible? | ✅ | El iframe se anuncia correctamente, la transcripción es legible |

**Principales problemas detectados:** Ninguno

**Mejoras aplicadas:**
- Agregué `aria-label` al botón de "me gusta"
- Mejoré el `title` del iframe
- Aseguré que todos los `alt` fueran descriptivos

---

### 6.3 Verificación cross-browser

Se verificó el proyecto en 3 navegadores diferentes:

| Navegador | Versión | Layout correcto | Multimedia funciona | Observaciones |
|-----------|---------|-----------------|---------------------|---------------|
| Chrome | 131+ | ✅ | ✅ | Sin problemas. |
| Firefox | 133+ | ✅ | ✅ | Sin problemas. |
| Edge | 131+ | ✅ | ✅ | Sin problemas. |

**Edge**
![cross-browse-edge.png](../capturas/cross-browse-edge.png)
**Chrome**
![cross-browse-chrome.png](../capturas/cross-browse-chrome.png)
**Firefox**
![cross-browse-firefox.png](../capturas/cross-browse-firefox.png)
---

## 7. Resultados finales después de correcciones

### Mejora de auditoría - Resumen general

| Herramienta | Antes                          | Después              | Mejora                  |
|-------------|--------------------------------|----------------------|-------------------------|
| **Lighthouse** | 92/100                         | 96/100               | +4 puntos               |
| **WAVE** | 35 contrast errores, 6 alertas | 0 errores, 1 alertas | -35 errores, -5 alertas |
| **TAW** | 5 problemas                    | 1 problema menor     | -4 problemas            |

---

### Capturas comparativas

#### Lighthouse - Antes y después

| Página | ANTES | DESPUÉS |
|--------|-------|---------|
| **Home** | ![Lighthouse Home Antes](../capturas/lighthouse-antes-home.png) | ![Lighthouse Home Después](../capturas/Lighthouse-despues-home.png) |
| **Curiosidades** | ![Lighthouse Curiosidades Antes](../capturas/lighthouse-antes-curiosidades.png) | ![Lighthouse Curiosidades Después](../capturas/Lighthouse-despues-curiosidades.png) |
| **Minijuegos** | ![Lighthouse Minijuegos Antes](../capturas/lighthouse-antes-minijuegos.png) | ![Lighthouse Minijuegos Después](../capturas/Lighthouse-despues-minijuegos.png) |
| **Contacto** | ![Lighthouse Contacto Antes](../capturas/lighthouse-antes-contacto.png) | ![Lighthouse Contacto Después](../capturas/Lighthouse-despues-contacto.png) |
| **Órdenes** | ![Lighthouse Órdenes Antes](../capturas/lighthouse-antes-ordenes.png) | ![Lighthouse Órdenes Después](../capturas/Lighthouse-despues-ordenes.png) |

#### WAVE - Antes y después

| Página | ANTES | DESPUÉS |
|--------|-------|---------|
| **Home** | ![WAVE Home Antes](../capturas/wave-antes-home.png) | ![WAVE Home Después](../capturas/wave-despues-home.png) |
| **Curiosidades** | ![WAVE Curiosidades Antes](../capturas/wave-antes-curiosidades.png) | ![WAVE Curiosidades Después](../capturas/wave-despues-curiosidades.png) |
| **Minijuegos** | ![WAVE Minijuegos Antes](../capturas/wave-antes-minijuegos.png) | ![WAVE Minijuegos Después](../capturas/wave-despues-minijuegos.png) |
| **Contacto** | ![WAVE Contacto Antes](../capturas/wave-antes-contacto.png) | ![WAVE Contacto Después](../capturas/wave-despues-contacto.png) |
| **Órdenes** | ![WAVE Órdenes Antes](../capturas/wave-antes-ordenes.png) | ![WAVE Órdenes Después](../capturas/wave-despues-ordenes.png) |

---

### Los 3 problemas más graves detectados en la auditoría inicial

| # | Problema | Herramienta(s) | Impacto | Solución aplicada |
|---|----------|----------------|---------|-------------------|
| 1 | **Contraste insuficiente** en texto secundario (ratio 3.5:1) | Lighthouse, WAVE | Usuarios con baja visión no pueden leer el contenido | Cambio de color #999 → #555 (ratio 5.2:1) |
| 2 | **Icono "me gusta" sin etiqueta accesible** - Solo `<span>` clickeable | WAVE, TAW | Lectores de pantalla no identifican la función del elemento | Cambio a `<button>` con `aria-label` y `aria-pressed` |
| 3 | **Iframe de video sin atributo `title`** | TAW, Lighthouse | Los lectores de pantalla no pueden identificar el contenido multimedia | Agregado `title="El Mundo de los Dinosaurios - Documental educativo"` |

**Análisis:** Las correcciones implementadas resultaron en mejoras significativas. Los 3 errores críticos se eliminaron completamente.

### Checklist de conformidad WCAG 2.1 nivel AA

**PERCEPTIBLE**
- [X] 1.1.1 - Contenido no textual (alt en imágenes)
- [X] 1.3.1 - Información y relaciones (HTML semántico)
- [X] 1.4.3 - Contraste mínimo (4.5:1 en texto)
- [X] 1.4.4 - Redimensionar texto (sin pérdida)

**OPERABLE**
- [X] 2.1.1 - Teclado (toda la funcionalidad)
- [X] 2.1.2 - Sin trampas de teclado
- [X] 2.4.3 - Orden del foco (lógico y predecible)
- [X] 2.4.7 - Foco visible (se ve claramente)

**COMPRENSIBLE**
- [X] 3.1.1 - Idioma de la página (`lang="es"`)
- [X] 3.2.3 - Navegación consistente
- [X] 3.3.2 - Etiquetas en formularios

**ROBUSTO**
- [X] 4.1.2 - Nombre, función, valor (ARIA)

### Nivel de conformidad alcanzado

**WCAG 2.1 Nivel AA** ✅

El proyecto cumple completamente con los criterios de Nivel AA. Se implementaron todas las correcciones necesarias para eliminar los errores críticos, se mejoró el contraste, se agregaron atributos ARIA apropiados, y se verificó la accesibilidad en múltiples navegadores y con tecnologías de asistencia. El único "problema" reportado por TAW después de correcciones es una alerta menor sobre validación de HTML que no afecta la accesibilidad práctica.

---

## 8. Conclusiones y reflexión

### ¿Es accesible mi proyecto?

**Sí, EducaDino es accesible tras las mejoras implementadas.** El proyecto alcanzó el nivel WCAG 2.1 AA, siendo usable por personas con discapacidades. Las tarjetas permiten navegación por teclado con descripciones de imágenes apropiadas, y el video incluye transcripción completa para usuarios sordos.

Lo que más me sorprendió fue que al usar NVDA*, funcionase perfectamente y el lector anunciaba todo claramente, incluso los cambios de estado del botón "me gusta". La mayor dificultad fueron los atributos `title` en iframes, estados de focus visibles, y `aria-label` en botones sin texto.

La accesibilidad no es un extra, sino parte integral del diseño. Usar Tab y Enter en lugar del ratón, o escuchar cómo un lector de pantalla describe tu página, realmente abre los ojos y hace que esta rama de la programación sea más enrevesada y esencial de lo que pensaba.

### Principales mejoras aplicadas

**Botón "me gusta" accesible** - Añadido `aria-label` y `aria-pressed` para que los lectores de pantalla identifiquen su función y estado.

**Mejora de contraste** - Color de texto secundario de #999 a #555 (ratio 3.5:1 → 5.2:1) para cumplir WCAG AA.

**Focus visible en elementos interactivos** - Estilos `:focus-visible` con outline de 3px para navegación por teclado.

**Atributo `title` en iframe de video** - Los lectores de pantalla ahora identifican el contenido multimedia correctamente.

**Binding dinámico `[alt]="title"` en imágenes** - Todas las imágenes tienen descripciones automáticas basadas en el contenido.

### Mejoras futuras

**Captions sincronizados** - Agregar subtítulos en el video descargado localmente para usuarios que no puedan ver YouTube.

**Modo oscuro optimizado** - Verificar contraste también en modo oscuro (probablemente haya algunos elementos que bajen de 4.5:1).

**Componentes interactivos más complejos** - Carruseles, menús desplegables o sliders, necesitarían ARIA adicional `aria-live` o `role="tablist"` entre otros.

**Pruebas con tecnologías más específicas** - JAWS, ZoomText, o Dragon NaturallySpeaking para usuarios con discapacidades más severas.

### Aprendizaje clave

Implementar WCAG 2.1 AA no significa que sea perfecta, pero sí garantiza que la mayoría de personas con discapacidades puedan usar tu sitio. Lo importante es que desde el inicio uses HTML semántico, pienses en usuarios de teclado, y hagas pruebas reales con tecnologías de asistencia. Los automáticos son útiles y te ganas un sector de mercado más grande.
