import { Component, ViewChild, ElementRef, HostListener, OnInit } from '@angular/core';
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
export class Home implements OnInit {
  // Referencia al contenedor para el scroll
  @ViewChild('cardsContainer') cardsContainer!: ElementRef;

  // Variable para detectar si estamos en vista móvil
  isMobile: boolean = false;
  currentCardIndex: number = 0;

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
      position: { top: '72%', left: '87%' }
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



  // Detectar cambios de tamaño de ventana
  @HostListener('window:resize')
  onResize() {
    this.isMobile = window.innerWidth <= 768;
  }

  // Inicializar
  ngOnInit() {
    this.isMobile = window.innerWidth <= 768;
  }

  // Lógica de los botones del carrusel
  scrollLeft() {
    if (this.isMobile) {
      // En móvil, centrar la card anterior
      this.currentCardIndex = Math.max(0, this.currentCardIndex - 1);
      this.scrollToCard(this.currentCardIndex);
    } else {
      // En desktop, scroll horizontal tradicional
      this.cardsContainer.nativeElement.scrollBy({ left: -320, behavior: 'smooth' });
    }
  }

  scrollRight() {
    if (this.isMobile) {
      // En móvil, centrar la siguiente card
      this.currentCardIndex = Math.min(this.trends.length - 1, this.currentCardIndex + 1);
      this.scrollToCard(this.currentCardIndex);
    } else {
      // En desktop, scroll horizontal tradicional
      this.cardsContainer.nativeElement.scrollBy({ left: 320, behavior: 'smooth' });
    }
  }

  // Centrar una card específica en móvil
  private scrollToCard(index: number) {
    const container = this.cardsContainer.nativeElement;
    const cards = container.querySelectorAll('.card-wrapper');
    if (cards[index]) {
      cards[index].scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
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
