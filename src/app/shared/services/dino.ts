import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, Observable, delay, of } from 'rxjs';

/**
 * Interfaz para los datos de un dinosaurio
 */
export interface Dinosaur {
  id: string;
  name: string;
  category: string;
  description: string;
  image: string;
  period?: string;
  diet?: 'herbivore' | 'carnivore' | 'omnivore';
  liked?: boolean;
}

/**
 * Interfaz para curiosidades
 */
export interface DinoCuriosity {
  id: string;
  title: string;
  description: string;
  image: string;
  category: 'curiosidad' | 'dato' | 'historia';
}

/**
 * TAREA 2: DinoService - Separación de Responsabilidades
 *
 * Servicio que centraliza los datos y lógica de negocio de dinosaurios.
 * Los componentes quedan "tontos" (dumb components) y solo consumen este servicio.
 */
@Injectable({
  providedIn: 'root'
})
export class DinoService {
  /**
   * Datos de dinosaurios (simulando una API)
   */
  private readonly dinosaursData: Dinosaur[] = [
    {
      id: 'trex',
      name: 'Tyrannosaurus Rex',
      category: 'Curiosidad',
      description: 'El T-Rex podía ejercer una fuerza de mordida de hasta 6 toneladas, suficiente para triturar huesos.',
      image: 'img/t-rex.png',
      period: 'Cretácico',
      diet: 'carnivore',
      liked: false
    },
    {
      id: 'velociraptor',
      name: 'Velociraptor',
      category: 'Dato',
      description: 'Contrario a lo mostrado en películas, el Velociraptor real era del tamaño de un pavo.',
      image: 'img/velocirraptor.png',
      period: 'Cretácico',
      diet: 'carnivore',
      liked: false
    },
    {
      id: 'triceratops',
      name: 'Triceratops',
      category: 'Historia',
      description: 'El Triceratops usaba sus tres cuernos tanto para defensa como para exhibición durante el cortejo.',
      image: 'img/triceratops.png',
      period: 'Cretácico',
      diet: 'herbivore',
      liked: false
    },
    {
      id: 'quetzalcoatl',
      name: 'Quetzalcoatlus',
      category: 'Curiosidad',
      description: 'Con una envergadura de hasta 11 metros, era el animal volador más grande que haya existido.',
      image: 'img/quetzalcoatl.png',
      period: 'Cretácico',
      diet: 'carnivore',
      liked: false
    }
  ];

  /**
   * BehaviorSubject para los dinosaurios (permite modificar likes)
   */
  private readonly dinosaursSubject = new BehaviorSubject<Dinosaur[]>(this.dinosaursData);

  /**
   * Observable público de dinosaurios
   */
  readonly dinosaurs$: Observable<Dinosaur[]> = this.dinosaursSubject.asObservable();

  /**
   * Signal para reactividad en templates
   */
  readonly dinosaurs = signal<Dinosaur[]>(this.dinosaursData);

  /**
   * Signal computado: dinosaurios favoritos
   */
  readonly favorites = computed(() => this.dinosaurs().filter(d => d.liked));

  /**
   * Signal computado: contador de favoritos
   */
  readonly favoritesCount = computed(() => this.favorites().length);

  constructor() {
    // Sincronizar BehaviorSubject con Signal
    this.dinosaurs$.subscribe(dinos => this.dinosaurs.set(dinos));
  }

  /**
   * Obtiene todos los dinosaurios
   * Simula una llamada a API con delay
   */
  getDinosaurs(): Observable<Dinosaur[]> {
    return of(this.dinosaursSubject.getValue()).pipe(delay(500));
  }

  /**
   * Obtiene un dinosaurio por ID
   */
  getDinosaurById(id: string): Observable<Dinosaur | undefined> {
    const dino = this.dinosaursSubject.getValue().find(d => d.id === id);
    return of(dino).pipe(delay(300));
  }

  /**
   * Toggle del estado "liked" de un dinosaurio
   */
  toggleLike(id: string): void {
    const currentDinos = this.dinosaursSubject.getValue();
    const updatedDinos = currentDinos.map(d =>
      d.id === id ? { ...d, liked: !d.liked } : d
    );
    this.dinosaursSubject.next(updatedDinos);
  }

  /**
   * Filtra dinosaurios por categoría
   */
  filterByCategory(category: string): Dinosaur[] {
    return this.dinosaurs().filter(d =>
      d.category.toLowerCase() === category.toLowerCase()
    );
  }

  /**
   * Filtra dinosaurios por dieta
   */
  filterByDiet(diet: Dinosaur['diet']): Dinosaur[] {
    return this.dinosaurs().filter(d => d.diet === diet);
  }

  /**
   * Obtiene curiosidades aleatorias
   */
  getRandomCuriosity(): DinoCuriosity {
    const curiosities: DinoCuriosity[] = [
      {
        id: '1',
        title: 'Brazos del T-Rex',
        description: 'Los brazos del T-Rex, aunque pequeños, podían levantar hasta 200 kg cada uno.',
        image: 'img/t-rex.png',
        category: 'curiosidad'
      },
      {
        id: '2',
        title: 'Velocidad del Velociraptor',
        description: 'El Velociraptor podía correr hasta 64 km/h en ráfagas cortas.',
        image: 'img/velocirraptor.png',
        category: 'dato'
      }
    ];

    return curiosities[Math.floor(Math.random() * curiosities.length)];
  }
}
