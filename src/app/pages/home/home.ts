import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';

interface MapDiscovery {
  region: string;
  dinosaur: string;
  discovery: string;
  position: { top: string; left: string };
}

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

  // Información sobre hallazgos de dinosaurios por región
  discoveries: MapDiscovery[] = [
    {
      region: 'Norteamérica',
      dinosaur: 'Tiranosaurio Rex',
      discovery: 'El T-Rex fue descubierto en Montana, USA. El mayor depredador terrestre con mandíbulas de 180 kg de fuerza.',
      position: { top: '35%', left: '15%' }
    },
    {
      region: 'Sudamérica',
      dinosaur: 'Argentinosaurus',
      discovery: 'El Argentinosaurus hallado en Argentina es el animal terrestre más grande jamás conocido, pesando hasta 100 toneladas.',
      position: { top: '73%', left: '25%' }
    },
    {
      region: 'Europa',
      dinosaur: 'Iguanodonte',
      discovery: 'Descubierto en Inglaterra, fue uno de los primeros dinosaurios identificados científicamente en Europa.',
      position: { top: '25%', left: '43%' }
    },
    {
      region: 'Australia',
      dinosaur: 'Quetzalcoatlus',
      discovery: 'El Quetzalcoatlus fue hallado en Australia. La mayor criatura voladora con envergadura de hasta 11 metros.',
      position: { top: '72%', left: '92%' }
    }
  ];

  // Control de tooltip visible
  activeTooltip: MapDiscovery | null = null;

  // RUTAS ACTUALIZADAS A /img/
  trends = [
    {
      category: 'Comportamiento',
      title: 'No eran para pelear',
      desc: 'El triceratops usaba su cornamenta especialmente para el cortejo.',
      img: 'img/triceratops.png'
    },
    {
      category: 'Alimentación',
      title: 'El gran devorador',
      desc: 'El T-Rex podía comer hasta 230 kg de carne de un solo bocado.',
      img: 'img/t-rex.png'
    },
    {
      category: 'Velocidad',
      title: 'Corredores natos',
      desc: 'Los velociraptores podían alcanzar velocidades de hasta 60 km/h.',
      img: 'img/velocirraptor.png'
    },
    {
      category: 'Tamaño',
      title: 'Gigantes gentiles',
      desc: 'El Argentinosaurus es uno de los animales terrestres más grandes conocidos.',
      img: 'img/argentinasaurus.png'
    },
    {
      category: 'Vuelo',
      title: 'Reyes del cielo',
      desc: 'El Quetzalcoatlus tenía una envergadura similar a la de una avioneta.',
      img: 'img/quetzalcoatl2.png'
    }
  ];



  // Lógica de los botones del carrusel
  scrollLeft() {
    this.cardsContainer.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
  }

  scrollRight() {
    this.cardsContainer.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
  }

  // Mostrar tooltip al hacer hover
  showTooltip(discovery: MapDiscovery) {
    this.activeTooltip = discovery;
  }

  // Ocultar tooltip
  hideTooltip() {
    this.activeTooltip = null;
  }
}
