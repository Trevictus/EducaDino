import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home {
  // Referencia al contenedor para el scroll
  @ViewChild('cardsContainer') cardsContainer!: ElementRef;

  // RUTAS ACTUALIZADAS A /img/
  trends = [
    {
      category: 'Comportamiento',
      title: 'No eran para pelear',
      desc: 'El triceratops usaba su cornamenta especialmente para el cortejo.',
      img: '/img/triceratops.png'
    },
    {
      category: 'Alimentación',
      title: 'El gran devorador',
      desc: 'El T-Rex podía comer hasta 230 kg de carne de un solo bocado.',
      img: '/img/t-rex.png'
    },
    {
      category: 'Velocidad',
      title: 'Corredores natos',
      desc: 'Los velociraptores podían alcanzar velocidades de hasta 60 km/h.',
      img: '/img/velocirraptor.png'
    },
    {
      category: 'Tamaño',
      title: 'Gigantes gentiles',
      desc: 'El Argentinosaurus es uno de los animales terrestres más grandes conocidos.',
      img: '/img/argentinasaurus.png'
    },
    {
      category: 'Vuelo',
      title: 'Reyes del cielo',
      desc: 'El Quetzalcoatlus tenía una envergadura similar a la de una avioneta.',
      img: '/img/quetzalcoatl2.png'
    }
  ];

  // Lógica de los botones del carrusel
  scrollLeft() {
    this.cardsContainer.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
  }

  scrollRight() {
    this.cardsContainer.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }
}
