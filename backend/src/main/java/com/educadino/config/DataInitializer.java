package com.educadino.config;

import com.educadino.entity.*;
import com.educadino.repository.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.math.BigDecimal;
import java.util.List;

/**
 * Inicializador de Datos
 *
 * Carga datos iniciales en la base de datos cuando está vacía.
 * Incluye un usuario admin y datos de ejemplo para desarrollo.
 */
@Configuration
@RequiredArgsConstructor
@Slf4j
public class DataInitializer {

    private final PasswordEncoder passwordEncoder;

    @Bean
    CommandLineRunner initData(
            UserRepository userRepository,
            DinosaurRepository dinosaurRepository,
            ProductRepository productRepository
    ) {
        return args -> {
            // ═══════════════════════════════════════════════════════════════
            // CREAR USUARIOS INICIALES
            // ═══════════════════════════════════════════════════════════════
            if (userRepository.count() == 0) {
                log.info("🦕 Creando usuarios iniciales...");

                // Usuario ADMIN
                User admin = User.builder()
                        .username("admin")
                        .email("admin@educadino.com")
                        .password(passwordEncoder.encode("admin"))
                        .role(Role.ADMIN)
                        .level(10)
                        .learningTime(100)
                        .completedMinigames(5)
                        .totalScore(5000)
                        .build();

                // Usuario de prueba
                User user = User.builder()
                        .username("dino_fan")
                        .email("usuario@educadino.com")
                        .password(passwordEncoder.encode("1234"))
                        .role(Role.USER)
                        .ageRange("8-10")
                        .level(3)
                        .learningTime(45)
                        .completedMinigames(2)
                        .totalScore(1500)
                        .build();

                userRepository.saveAll(List.of(admin, user));
                log.info("✅ Usuarios creados: admin/admin, dino_fan/1234");
            }

            // ═══════════════════════════════════════════════════════════════
            // CREAR DINOSAURIOS DE EJEMPLO
            // ═══════════════════════════════════════════════════════════════
            if (dinosaurRepository.count() == 0) {
                log.info("🦖 Creando dinosaurios de ejemplo...");

                List<Dinosaur> dinosaurs = List.of(
                    Dinosaur.builder()
                        .name("Tyrannosaurus Rex")
                        .description("El T-Rex fue uno de los dinosaurios carnívoros más grandes que jamás existieron. Tenía una mordida extremadamente poderosa y pequeños brazos.")
                        .diet("Carnívoro")
                        .period("Cretácico Superior")
                        .taxonomy("Theropoda")
                        .family("Tyrannosauridae")
                        .imageUrl("img/T-rex.png")
                        .size("Grande")
                        .location("América del Norte")
                        .curiosities("Su mordida era la más fuerte de todos los animales terrestres. Podía ejercer una fuerza de 6 toneladas.")
                        .build(),

                    Dinosaur.builder()
                        .name("Velociraptor")
                        .description("Dinosaurio carnívoro pequeño pero muy inteligente y ágil. Cazaba en manada y tenía garras afiladas.")
                        .diet("Carnívoro")
                        .period("Cretácico Superior")
                        .taxonomy("Theropoda")
                        .family("Dromaeosauridae")
                        .imageUrl("img/velocirraptor.png")
                        .size("Pequeño")
                        .location("Asia (Mongolia)")
                        .curiosities("Tenía plumas y era del tamaño de un pavo. Las películas lo muestran mucho más grande de lo que era.")
                        .build(),

                    Dinosaur.builder()
                        .name("Triceratops")
                        .description("Herbívoro con tres cuernos distintivos y una gran cresta ósea. Usaba sus cuernos para defenderse de depredadores.")
                        .diet("Herbívoro")
                        .period("Cretácico Superior")
                        .taxonomy("Ornithischia")
                        .family("Ceratopsidae")
                        .imageUrl("img/triceratops.png")
                        .size("Grande")
                        .location("América del Norte")
                        .curiosities("Su nombre significa 'cara de tres cuernos'. La cresta podría haber servido para regular su temperatura.")
                        .build(),

                    Dinosaur.builder()
                        .name("Brachiosaurus")
                        .description("Uno de los dinosaurios más altos. Sus patas delanteras eran más largas que las traseras, lo que le daba una postura única.")
                        .diet("Herbívoro")
                        .period("Jurásico Superior")
                        .taxonomy("Sauropoda")
                        .family("Brachiosauridae")
                        .imageUrl("img/Brachiosaurus.png")
                        .size("Gigante")
                        .location("América del Norte, África")
                        .curiosities("Podía alcanzar 13 metros de altura. Su corazón pesaba aproximadamente 200 kg.")
                        .build(),

                    Dinosaur.builder()
                        .name("Pteranodon")
                        .description("Reptil volador con una envergadura de hasta 7 metros. Técnicamente no es un dinosaurio, sino un pterosaurio.")
                        .diet("Carnívoro (peces)")
                        .period("Cretácico Superior")
                        .taxonomy("Pterosauria")
                        .family("Pteranodontidae")
                        .imageUrl("img/quetzalcoatl.png")
                        .size("Grande")
                        .location("América del Norte")
                        .curiosities("No tenía dientes. Usaba su pico para atrapar peces como las aves marinas actuales.")
                        .build(),

                    Dinosaur.builder()
                        .name("Diplodocus")
                        .description("Saurópodo de cuello y cola extremadamente largos. Uno de los dinosaurios más largos que existieron.")
                        .diet("Herbívoro")
                        .period("Jurásico Superior")
                        .taxonomy("Sauropoda")
                        .family("Diplodocidae")
                        .imageUrl("img/Diplodocus.png")
                        .size("Gigante")
                        .location("América del Norte")
                        .curiosities("Podía usar su cola como un látigo para defenderse. Medía hasta 27 metros de largo.")
                        .build(),

                    Dinosaur.builder()
                        .name("Allosaurus")
                        .description("Depredador del Jurásico, anterior al T-Rex. Era el mayor carnívoro de su época.")
                        .diet("Carnívoro")
                        .period("Jurásico Superior")
                        .taxonomy("Theropoda")
                        .family("Allosauridae")
                        .imageUrl("img/Allosaurio.png")
                        .size("Grande")
                        .location("América del Norte, Europa")
                        .curiosities("Tenía crestas óseas sobre los ojos. Probablemente cazaba en grupo para derribar presas grandes.")
                        .build(),

                    Dinosaur.builder()
                        .name("Argentinasaurus")
                        .description("Posiblemente el animal terrestre más grande que jamás existió. Era un titanosaurio gigante.")
                        .diet("Herbívoro")
                        .period("Cretácico Superior")
                        .taxonomy("Sauropoda")
                        .family("Titanosauridae")
                        .imageUrl("img/Argentinasaurus.png")
                        .size("Gigante")
                        .location("Argentina")
                        .curiosities("Podía pesar hasta 100 toneladas. Sus vértebras medían más de 1 metro de alto.")
                        .build()
                );

                dinosaurRepository.saveAll(dinosaurs);
                log.info("✅ {} dinosaurios creados", dinosaurs.size());
            }

            // ═══════════════════════════════════════════════════════════════
            // CREAR PRODUCTOS DE EJEMPLO
            // ═══════════════════════════════════════════════════════════════
            if (productRepository.count() == 0) {
                log.info("🛒 Creando productos de ejemplo...");

                List<Product> products = List.of(
                    Product.builder()
                        .name("Kit Excavación T-Rex")
                        .description("Kit completo para excavación arqueológica con réplica de fósil de T-Rex. Incluye herramientas y guía educativa.")
                        .price(new BigDecimal("29.99"))
                        .category("Kits Educativos")
                        .image("img/T-rex.png")
                        .stock(15)
                        .featured(true)
                        .build(),

                    Product.builder()
                        .name("Figura Velociraptor Articulada")
                        .description("Figura articulada de Velociraptor a escala 1:6 con detalles realistas basados en descubrimientos recientes.")
                        .price(new BigDecimal("24.99"))
                        .category("Figuras")
                        .image("img/velocirraptor.png")
                        .stock(25)
                        .featured(true)
                        .build(),

                    Product.builder()
                        .name("Puzzle 3D Triceratops")
                        .description("Puzzle 3D de madera ecológica con 150 piezas para armar tu propio Triceratops.")
                        .price(new BigDecimal("19.99"))
                        .category("Puzzles")
                        .image("img/triceratops.png")
                        .stock(30)
                        .featured(false)
                        .build(),

                    Product.builder()
                        .name("Libro: Era de los Dinosaurios")
                        .description("Libro ilustrado con información científica sobre los dinosaurios y su era. Perfecto para niños de 8-12 años.")
                        .price(new BigDecimal("15.99"))
                        .category("Libros")
                        .image("img/quetzalcoatl.png")
                        .stock(50)
                        .featured(true)
                        .build(),

                    Product.builder()
                        .name("Peluche Brachiosaurus")
                        .description("Peluche suave de Brachiosaurus de 40cm. Material hipoalergénico y seguro para todas las edades.")
                        .price(new BigDecimal("22.99"))
                        .category("Peluches")
                        .image("img/Brachiosaurus.png")
                        .stock(20)
                        .featured(false)
                        .build(),

                    Product.builder()
                        .name("Maqueta Diplodocus")
                        .description("Maqueta para construir de Diplodocus a escala. Incluye pinturas y pinceles.")
                        .price(new BigDecimal("34.99"))
                        .category("Maquetas")
                        .image("img/Diplodocus.png")
                        .stock(12)
                        .featured(false)
                        .build()
                );

                productRepository.saveAll(products);
                log.info("✅ {} productos creados", products.size());
            }

            log.info("""

                ════════════════════════════════════════════════════════════
                   🦕 DATOS INICIALES CARGADOS CORRECTAMENTE 🦖

                   Usuarios disponibles:
                   ├─ admin / admin (ADMIN)
                   └─ dino_fan / 1234 (USER)

                   API disponible en: http://localhost:8080/api
                   Swagger UI: http://localhost:8080/api/swagger-ui.html
                ════════════════════════════════════════════════════════════
                """);
        };
    }
}
