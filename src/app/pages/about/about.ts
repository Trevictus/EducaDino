import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

/**
 * AboutComponent - Página "Acerca de" de EducaDino.
 */
@Component({
  selector: 'app-about',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './about.html',
  styleUrl: './about.scss'
})
export class About {
  readonly features = [
    {
      icon: '🎓',
      title: 'Educación Interactiva',
      description: 'Contenido diseñado para hacer el aprendizaje sobre dinosaurios divertido y accesible.'
    },
    {
      icon: '🔬',
      title: 'Base Científica',
      description: 'Información basada en los últimos descubrimientos paleontológicos.'
    },
    {
      icon: '🎮',
      title: 'Experiencias Inmersivas',
      description: 'Productos y actividades que transportan a la era de los dinosaurios.'
    },
    {
      icon: '👨‍👩‍👧‍👦',
      title: 'Para Toda la Familia',
      description: 'Contenido adaptado para diferentes edades y niveles de conocimiento.'
    }
  ];
}
