import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Dinosaur {
  id: string;
  name: string;
  description: string;
  image: string;
}

interface DinosaurType {
  id: string;
  name: string;
  description: string;
  image: string;
  expanded: boolean;
  dinosaurs: Dinosaur[];
}

interface Suborder {
  id: string;
  name: string;
  description: string;
  image: string;
  expanded: boolean;
  types: DinosaurType[];
}

interface Order {
  id: string;
  name: string;
  description: string;
  image: string;
  expanded: boolean;
  suborders: Suborder[];
}

interface SelectedItem {
  title: string;
  description: string;
  image: string;
  breadcrumb?: string;
}

/**
 * Ordenes - Página de clasificación taxonómica de dinosaurios
 *
 * Esta página muestra la clasificación taxonómica de los dinosaurios
 * dividida en órdenes (Saurischia, Ornithischia), subórdenes, familias y especies.
 *
 * Nota: "Órdenes" hace referencia a la taxonomía biológica de los dinosaurios,
 * NO a pedidos comerciales (orders en inglés).
 */
@Component({
  selector: 'app-ordenes',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './ordenes.html',
  styleUrl: './ordenes.scss'
})
export class Ordenes {
  isLiked: boolean = false;

  // Contenido seleccionado actualmente
  selectedItem: SelectedItem = {
    title: 'Clasificación',
    description: 'Los dinosaurios se dividen en dos grandes grupos: saurisquios y ornitisquios. Los saurisquios tenían caderas como los lagartos e incluían carnívoros como el T. rex y herbívoros gigantes como el Brachiosaurus. Algunos de ellos se convirtieron en aves. Los ornitisquios tenían caderas parecidas a las aves y todos comían plantas, como el Triceratops o el Stegosaurus. Dentro de estos grupos hay muchas familias distintas, según su forma, tamaño y cómo vivían.',
    image: ''
  };

  // Estructura de datos de órdenes taxonómicos
  orders: Order[] = [
    {
      id: 'saurischia',
      name: 'Saurischia',
      description: 'Los saurisquios son uno de los dos grandes órdenes de dinosaurios. Se caracterizan por tener una estructura de cadera similar a la de los lagartos modernos, con el hueso púbico apuntando hacia adelante. Este grupo incluye a los terópodos (carnívoros bípedos como el T. rex) y a los sauropodomorfos (herbívoros de cuello largo como el Brachiosaurus). Curiosamente, las aves modernas descienden de este grupo.',
      image: '',
      expanded: false,
      suborders: [
        {
          id: 'theropoda',
          name: 'Theropoda',
          description: 'Los terópodos son dinosaurios bípedos, en su mayoría carnívoros. Incluyen desde pequeños cazadores emplumados hasta los grandes depredadores como el Tyrannosaurus rex. Las aves modernas descienden directamente de este grupo de dinosaurios.',
          image: '',
          expanded: false,
          types: [
            {
              id: 'tyrannosauridae',
              name: 'Tyrannosauridae',
              description: 'Familia de grandes terópodos carnívoros que incluye al famoso Tyrannosaurus rex. Se caracterizaban por sus enormes cabezas, mandíbulas poderosas y brazos relativamente pequeños.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'tyrannosaurus-rex',
                  name: 'Tyrannosaurus rex',
                  description: 'El "rey de los lagartos tiranos" es quizás el dinosaurio más famoso. Medía hasta 12 metros de largo y tenía la mordida más poderosa de cualquier animal terrestre conocido.',
                  image: ''
                },
                {
                  id: 'albertosaurus',
                  name: 'Albertosaurus',
                  description: 'Pariente cercano del T. rex pero más pequeño y ligero. Vivió en Canadá hace 70 millones de años y era un depredador ápice de su ecosistema.',
                  image: ''
                },
                {
                  id: 'tarbosaurus',
                  name: 'Tarbosaurus',
                  description: 'El equivalente asiático del T. rex. Vivió en Mongolia y era casi tan grande como su primo americano, con brazos igualmente pequeños.',
                  image: ''
                }
              ]
            },
            {
              id: 'dromaeosauridae',
              name: 'Dromaeosauridae',
              description: 'Conocidos como "raptores", eran depredadores ágiles y probablemente emplumados. Incluyen al Velociraptor y al Deinonychus. Tenían garras retráctiles en forma de hoz en sus patas traseras.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'velociraptor',
                  name: 'Velociraptor',
                  description: 'Pequeño pero letal depredador de Mongolia. Del tamaño de un pavo, estaba cubierto de plumas y cazaba en manada usando su inteligencia y garras en forma de hoz.',
                  image: ''
                },
                {
                  id: 'deinonychus',
                  name: 'Deinonychus',
                  description: 'Su nombre significa "garra terrible". Más grande que el Velociraptor, revolucionó nuestra comprensión de los dinosaurios como animales activos y de sangre caliente.',
                  image: ''
                },
                {
                  id: 'utahraptor',
                  name: 'Utahraptor',
                  description: 'El raptor más grande conocido, podía alcanzar 7 metros de largo. Su garra en forma de hoz medía más de 20 cm y era un superdepredador del Cretácico temprano.',
                  image: ''
                }
              ]
            },
            {
              id: 'allosauridae',
              name: 'Allosauridae',
              description: 'Grandes terópodos carnívoros del Jurásico. El Allosaurus era uno de los principales depredadores de su época, con dientes aserrados y garras poderosas para cazar grandes herbívoros.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'allosaurus',
                  name: 'Allosaurus',
                  description: 'El depredador más común del Jurásico tardío en Norteamérica. Cazaba grandes saurópodos y estegosaurios usando sus potentes mandíbulas y garras.',
                  image: ''
                },
                {
                  id: 'saurophaganax',
                  name: 'Saurophaganax',
                  description: 'Posiblemente el terópodo más grande del Jurásico, superando al Allosaurus en tamaño. Su nombre significa "señor de los comedores de lagartos".',
                  image: ''
                },
                {
                  id: 'acrocanthosaurus',
                  name: 'Acrocanthosaurus',
                  description: 'Gran carnívoro del Cretácico temprano con espinas altas en su espalda. Podía alcanzar 12 metros y era el depredador dominante de su época.',
                  image: ''
                }
              ]
            }
          ]
        },
        {
          id: 'sauropodomorpha',
          name: 'Sauropodomorpha',
          description: 'Los sauropodomorfos incluyen a los dinosaurios más grandes que han existido. Se caracterizan por sus cuellos extremadamente largos, cuerpos masivos y alimentación herbívora. Evolucionaron desde formas bípedas pequeñas hasta gigantes cuadrúpedos.',
          image: '',
          expanded: false,
          types: [
            {
              id: 'diplodocidae',
              name: 'Diplodocidae',
              description: 'Saurópodos de cuello y cola muy largos pero relativamente delgados. El Diplodocus y el Apatosaurus son miembros famosos de esta familia.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'diplodocus',
                  name: 'Diplodocus',
                  description: 'Uno de los dinosaurios más largos conocidos, alcanzando 27 metros. Su larga cola en forma de látigo podría haber producido un sonido supersónico.',
                  image: ''
                },
                {
                  id: 'apatosaurus',
                  name: 'Apatosaurus',
                  description: 'Antes conocido como Brontosaurus, era más robusto que el Diplodocus. Pesaba hasta 23 toneladas y se alimentaba de helechos y coníferas.',
                  image: ''
                },
                {
                  id: 'supersaurus',
                  name: 'Supersaurus',
                  description: 'Uno de los animales más largos que han existido, posiblemente superando los 33 metros. A pesar de su tamaño, era relativamente ligero.',
                  image: ''
                }
              ]
            },
            {
              id: 'brachiosauridae',
              name: 'Brachiosauridae',
              description: 'Saurópodos con las patas delanteras más largas que las traseras, lo que les daba una postura inclinada hacia arriba. El Brachiosaurus podía alcanzar las copas de los árboles más altos.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'brachiosaurus',
                  name: 'Brachiosaurus',
                  description: 'Uno de los dinosaurios más altos, podía alcanzar 13 metros de altura. Sus fosas nasales en lo alto de la cabeza le permitían respirar mientras comía.',
                  image: ''
                },
                {
                  id: 'giraffatitan',
                  name: 'Giraffatitan',
                  description: 'Pariente africano del Brachiosaurus, antes considerado la misma especie. Podía pesar hasta 40 toneladas y tenía un cuello extremadamente largo.',
                  image: ''
                },
                {
                  id: 'sauroposeidon',
                  name: 'Sauroposeidon',
                  description: 'Posiblemente el dinosaurio más alto conocido, con estimaciones de hasta 18 metros de altura. Solo se conoce por vértebras cervicales gigantes.',
                  image: ''
                }
              ]
            },
            {
              id: 'titanosauria',
              name: 'Titanosauria',
              description: 'El grupo de saurópodos más diverso y exitoso. Incluye al Argentinosaurus, uno de los animales terrestres más grandes conocidos. Algunos tenían armadura ósea.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'argentinosaurus',
                  name: 'Argentinosaurus',
                  description: 'Posiblemente el animal terrestre más pesado que ha existido, con estimaciones de hasta 100 toneladas. Vivió en Argentina hace 95 millones de años.',
                  image: ''
                },
                {
                  id: 'patagotitan',
                  name: 'Patagotitan',
                  description: 'Descubierto en 2014, rivaliza con el Argentinosaurus como el animal terrestre más grande. Podía medir hasta 37 metros de largo.',
                  image: ''
                },
                {
                  id: 'saltasaurus',
                  name: 'Saltasaurus',
                  description: 'Titanosaurio relativamente pequeño pero único por tener armadura ósea en su espalda. Fue el primer saurópodo descubierto con esta característica.',
                  image: ''
                }
              ]
            }
          ]
        }
      ]
    },
    {
      id: 'ornithischia',
      name: 'Ornithischia',
      description: 'Los ornitisquios son el segundo gran orden de dinosaurios. A pesar de que su nombre significa "cadera de ave", no están relacionados con las aves modernas. Todos eran herbívoros y desarrollaron diversas adaptaciones como cuernos, crestas, armaduras y picos para alimentarse de plantas.',
      image: '',
      expanded: false,
      suborders: [
        {
          id: 'thyreophora',
          name: 'Thyreophora',
          description: 'Dinosaurios acorazados que incluyen a los estegosaurios y anquilosaurios. Desarrollaron placas, espinas y mazas óseas como defensa contra los depredadores.',
          image: '',
          expanded: false,
          types: [
            {
              id: 'stegosauridae',
              name: 'Stegosauridae',
              description: 'Famosos por sus distintivas placas dorsales y las púas en la cola llamadas "thagomizer". El Stegosaurus es el miembro más conocido de esta familia.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'stegosaurus',
                  name: 'Stegosaurus',
                  description: 'El más famoso dinosaurio acorazado, con 17 placas óseas en su espalda y 4 púas en la cola. Tenía un cerebro del tamaño de una nuez.',
                  image: ''
                },
                {
                  id: 'kentrosaurus',
                  name: 'Kentrosaurus',
                  description: 'Estegosaurio africano con espinas en lugar de placas. Tenía púas a lo largo de su espalda y cola, haciéndolo muy difícil de atacar.',
                  image: ''
                },
                {
                  id: 'huayangosaurus',
                  name: 'Huayangosaurus',
                  description: 'Uno de los estegosaurios más primitivos, de China. Era más pequeño que el Stegosaurus y tenía dientes en la parte frontal de su mandíbula.',
                  image: ''
                }
              ]
            },
            {
              id: 'ankylosauridae',
              name: 'Ankylosauridae',
              description: 'Dinosaurios fuertemente acorazados con una maza ósea al final de la cola. Su armadura los convertía en fortalezas vivientes contra los depredadores.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'ankylosaurus',
                  name: 'Ankylosaurus',
                  description: 'El tanque viviente definitivo. Cubierto de placas óseas y con una maza en la cola capaz de romper huesos, era prácticamente invulnerable.',
                  image: ''
                },
                {
                  id: 'euoplocephalus',
                  name: 'Euoplocephalus',
                  description: 'Uno de los anquilosaurios mejor conocidos. Incluso tenía párpados blindados para proteger sus ojos de los depredadores.',
                  image: ''
                },
                {
                  id: 'pinacosaurus',
                  name: 'Pinacosaurus',
                  description: 'Anquilosaurio asiático que vivía en manadas. Se han encontrado grupos de juveniles fosilizados juntos, sugiriendo comportamiento social.',
                  image: ''
                }
              ]
            },
            {
              id: 'nodosauridae',
              name: 'Nodosauridae',
              description: 'Similares a los anquilosaurios pero sin la maza en la cola. Tenían espinas laterales prominentes y armadura pesada. El Nodosaurus es un ejemplo típico.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'nodosaurus',
                  name: 'Nodosaurus',
                  description: 'El dinosaurio que da nombre a la familia. Tenía filas de nódulos óseos por todo su cuerpo que le servían como armadura defensiva.',
                  image: ''
                },
                {
                  id: 'borealopelta',
                  name: 'Borealopelta',
                  description: 'El dinosaurio mejor preservado jamás encontrado, como una momia. Su armadura y coloración se conservaron, revelando un patrón de camuflaje.',
                  image: ''
                },
                {
                  id: 'sauropelta',
                  name: 'Sauropelta',
                  description: 'Nodosaurio con largas espinas en sus hombros. Era uno de los dinosaurios acorazados más comunes de Norteamérica durante el Cretácico.',
                  image: ''
                }
              ]
            }
          ]
        },
        {
          id: 'cerapoda',
          name: 'Cerapoda',
          description: 'Grupo diverso que incluye a los ceratopsios (dinosaurios con cuernos) y ornitópodos (como los hadrosaurios). Desarrollaron complejas baterías dentales para procesar plantas duras.',
          image: '',
          expanded: false,
          types: [
            {
              id: 'ceratopsidae',
              name: 'Ceratopsidae',
              description: 'Dinosaurios con cuernos y grandes golas óseas. El Triceratops es el más famoso. Usaban sus cuernos para defensa y probablemente para exhibiciones de cortejo.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'triceratops',
                  name: 'Triceratops',
                  description: 'El dinosaurio con cuernos más famoso, con tres cuernos y una enorme gola. Vivió junto al T. rex y probablemente luchaban frecuentemente.',
                  image: ''
                },
                {
                  id: 'styracosaurus',
                  name: 'Styracosaurus',
                  description: 'Ceratopsio con un cuerno nasal largo y múltiples espinas en su gola. Su elaborado cráneo probablemente servía para atraer parejas.',
                  image: ''
                },
                {
                  id: 'centrosaurus',
                  name: 'Centrosaurus',
                  description: 'Se han encontrado enormes cementerios de estos dinosaurios, sugiriendo que vivían en grandes manadas que migraban juntas.',
                  image: ''
                }
              ]
            },
            {
              id: 'hadrosauridae',
              name: 'Hadrosauridae',
              description: 'Conocidos como "dinosaurios pico de pato" por su hocico ancho y plano. Algunos tenían crestas huecas que podrían haber usado para comunicarse.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'parasaurolophus',
                  name: 'Parasaurolophus',
                  description: 'Famoso por su larga cresta tubular que podía producir sonidos graves como un trombón. Vivía en grandes manadas.',
                  image: ''
                },
                {
                  id: 'edmontosaurus',
                  name: 'Edmontosaurus',
                  description: 'Uno de los hadrosaurios más grandes, podía alcanzar 13 metros. Algunos fósiles muestran marcas de mordidas de T. rex.',
                  image: ''
                },
                {
                  id: 'corythosaurus',
                  name: 'Corythosaurus',
                  description: 'Hadrosaurio con una cresta en forma de casco. La cresta hueca amplificaba sus llamadas, permitiendo comunicación a larga distancia.',
                  image: ''
                }
              ]
            },
            {
              id: 'pachycephalosauridae',
              name: 'Pachycephalosauridae',
              description: 'Dinosaurios con cráneos extremadamente gruesos. Se cree que usaban sus cabezas para combates rituales, similar a las cabras montesas actuales.',
              image: '',
              expanded: false,
              dinosaurs: [
                {
                  id: 'pachycephalosaurus',
                  name: 'Pachycephalosaurus',
                  description: 'El "lagarto de cabeza gruesa" tenía un cráneo de hasta 25 cm de grosor. Probablemente lo usaba para embestir a rivales por territorio o parejas.',
                  image: ''
                },
                {
                  id: 'stygimoloch',
                  name: 'Stygimoloch',
                  description: 'Paquicefalosaurio con cuernos puntiagudos alrededor de su cúpula craneal. Algunos científicos creen que era un Pachycephalosaurus joven.',
                  image: ''
                },
                {
                  id: 'dracorex',
                  name: 'Dracorex',
                  description: 'Su nombre significa "rey dragón" por su aspecto. Tenía una cabeza plana con espinas, muy diferente a otros paquicefalosaurios.',
                  image: ''
                }
              ]
            }
          ]
        }
      ]
    }
  ];

  toggleLike(): void {
    this.isLiked = !this.isLiked;
  }

  toggleOrder(order: Order): void {
    order.expanded = !order.expanded;
  }

  toggleSuborder(event: Event, suborder: Suborder): void {
    event.stopPropagation();
    suborder.expanded = !suborder.expanded;
  }

  toggleType(event: Event, type: DinosaurType): void {
    event.stopPropagation();
    type.expanded = !type.expanded;
  }

  selectOrder(event: Event, order: Order): void {
    event.stopPropagation();
    this.selectedItem = {
      title: order.name,
      description: order.description,
      image: order.image
    };
  }

  selectSuborder(event: Event, suborder: Suborder): void {
    event.stopPropagation();
    this.selectedItem = {
      title: suborder.name,
      description: suborder.description,
      image: suborder.image
    };
  }

  selectType(event: Event, type: DinosaurType): void {
    event.stopPropagation();
    this.selectedItem = {
      title: type.name,
      description: type.description,
      image: type.image
    };
  }

  selectDinosaur(event: Event, dinosaur: Dinosaur): void {
    event.stopPropagation();
    this.selectedItem = {
      title: dinosaur.name,
      description: dinosaur.description,
      image: dinosaur.image
    };
  }
}

