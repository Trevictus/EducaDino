import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Card } from '../../components/card/card';

interface Curiosity {
  id: number;
  category: string;
  title: string;
  description: string;
  image: string;
}

@Component({
  selector: 'app-curiosities',
  standalone: true,
  imports: [CommonModule, Card],
  templateUrl: './curiosities.html',
  styleUrl: './curiosities.scss'
})
export class Curiosities implements OnInit {
  // Todas las curiosidades disponibles
  allCuriosities: Curiosity[] = [
    {
      id: 1,
      category: 'Comportamiento',
      title: 'No eran para pelear',
      description: 'El triceratops usaba su cornamenta especialmente para el cortejo.',
      image: 'img/triceratops.png'
    },
    {
      id: 2,
      category: 'Hábitat',
      title: 'Fósiles helados',
      description: 'Se han encontrado fósiles donde hoy hay hielo en el planeta Tierra.',
      image: 'img/world-map.png'
    },
    {
      id: 3,
      category: 'Biología',
      title: 'Los más pequeños',
      description: 'El microraptor media solo 77cm y tenía plumas y estaba entre los dinosaurios no aviares más abundantes en su ecosistema.',
      image: 'img/microrraptor.png'
    },
    {
      id: 4,
      category: 'Alimentación',
      title: 'El gran devorador',
      description: 'El T-Rex podía comer hasta 230 kg de carne de un solo bocado.',
      image: 'img/t-rex.png'
    },
    {
      id: 5,
      category: 'Velocidad',
      title: 'Corredores natos',
      description: 'Los velociraptores podían alcanzar velocidades de hasta 60 km/h.',
      image: 'img/velocirraptor-corriendo.png'
    },
    {
      id: 6,
      category: 'Tamaño',
      title: 'Gigantes gentiles',
      description: 'El Argentinosaurus es uno de los animales terrestres más grandes conocidos.',
      image: 'img/argentinasaurus.png'
    },
    {
      id: 7,
      category: 'Vuelo',
      title: 'Reyes del cielo',
      description: 'El Quetzalcoatlus tenía una envergadura similar a la de una avioneta.',
      image: 'img/quetzalcoatl2.png'
    },
    {
      id: 8,
      category: 'Inteligencia',
      title: 'Cazadores estratégicos',
      description: 'El Velociraptor probablemente cazaba en grupo usando estrategias coordinadas.',
      image: 'img/dino-throw.png'
    },
    {
      id: 9,
      category: 'Evolución',
      title: 'Antepasados voladores',
      description: 'Muchos científicos creen que las aves actuales descienden de dinosaurios.',
      image: 'img/dino-ride.png'
    }
  ];

  // Curiosidades mostradas actualmente (3 en la fila)
  displayedCuriosities: Curiosity[] = [];

  ngOnInit() {
    // Inicializar con 3 curiosidades aleatorias
    this.initializeCards();
  }

  initializeCards() {
    this.displayedCuriosities = [];
    for (let i = 0; i < 3; i++) {
      const randomCuriosity = this.getRandomCuriosityWithoutDuplicates([]);
      this.displayedCuriosities.push(randomCuriosity);
    }
  }

  getRandomCuriosityWithoutDuplicates(excludeIds: number[]): Curiosity {
    const availableCuriosities = this.allCuriosities.filter(c => !excludeIds.includes(c.id));

    if (availableCuriosities.length === 0) {
      // Si se agotan las curiosidades, devolver una aleatoria
      return this.getRandomCuriosity();
    }

    const randomIndex = Math.floor(Math.random() * availableCuriosities.length);
    return availableCuriosities[randomIndex];
  }

  getRandomCuriosity(): Curiosity {
    const randomIndex = Math.floor(Math.random() * this.allCuriosities.length);
    return this.allCuriosities[randomIndex];
  }

  onNextCuriosity(index: number) {
    // Obtener los IDs de las otras 2 tarjetas que no van a cambiar
    const otherIds = this.displayedCuriosities
      .map((curiosity, i) => i !== index ? curiosity.id : null)
      .filter((id): id is number => id !== null);

    // Obtener una curiosidad que no coincida con las otras 2
    const randomCuriosity = this.getRandomCuriosityWithoutDuplicates(otherIds);
    this.displayedCuriosities[index] = randomCuriosity;
  }
}

