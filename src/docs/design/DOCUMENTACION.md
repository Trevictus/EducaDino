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
