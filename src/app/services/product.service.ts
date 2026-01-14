import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

/**
 * Interfaz para los datos de un producto
 */
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
  stock: number;
  featured?: boolean;
}

/**
 * ProductService - Servicio que gestiona los datos de productos.
 *
 * Simula operaciones CRUD con datos en memoria.
 * En producción, esto se conectaría a una API REST.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  /**
   * Datos de productos simulados (mock data)
   */
  private readonly products: Product[] = [
    {
      id: 'prod-001',
      name: 'Kit Excavación T-Rex',
      description: 'Kit completo para excavación arqueológica con réplica de fósil de T-Rex. Incluye herramientas y guía educativa.',
      price: 29.99,
      category: 'Kits Educativos',
      image: 'img/t-rex.png',
      stock: 15,
      featured: true
    },
    {
      id: 'prod-002',
      name: 'Figura Velociraptor Articulada',
      description: 'Figura articulada de Velociraptor a escala 1:6 con detalles realistas basados en descubrimientos recientes.',
      price: 24.99,
      category: 'Figuras',
      image: 'img/velocirraptor.png',
      stock: 25,
      featured: true
    },
    {
      id: 'prod-003',
      name: 'Puzzle 3D Triceratops',
      description: 'Puzzle 3D de madera ecológica con 150 piezas para armar tu propio Triceratops.',
      price: 19.99,
      category: 'Puzzles',
      image: 'img/triceratops.png',
      stock: 30,
      featured: false
    },
    {
      id: 'prod-004',
      name: 'Libro: Era de los Dinosaurios',
      description: 'Libro ilustrado con información científica sobre los dinosaurios y su era. Perfecto para niños de 8-12 años.',
      price: 15.99,
      category: 'Libros',
      image: 'img/quetzalcoatl.png',
      stock: 50,
      featured: true
    },
    {
      id: 'prod-005',
      name: 'Peluche Argentinasaurio',
      description: 'Peluche suave del Argentinasaurio, el dinosaurio más grande descubierto en Argentina. 40cm de largo.',
      price: 22.99,
      category: 'Peluches',
      image: 'img/argentinasaurus.png',
      stock: 20,
      featured: false
    }
  ];

  /**
   * Obtiene todos los productos
   */
  getProducts(): Observable<Product[]> {
    return of([...this.products]).pipe(delay(300));
  }

  /**
   * Obtiene productos destacados
   */
  getFeaturedProducts(): Observable<Product[]> {
    const featured = this.products.filter(p => p.featured);
    return of(featured).pipe(delay(300));
  }

  /**
   * Obtiene un producto por su ID
   * @throws Error si el producto no existe
   */
  getProductById(id: string): Observable<Product> {
    const product = this.products.find(p => p.id === id);

    if (!product) {
      return throwError(() => new Error(`Producto con ID "${id}" no encontrado`)).pipe(delay(200));
    }

    return of({ ...product }).pipe(delay(300));
  }

  /**
   * Obtiene productos por categoría
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    const filtered = this.products.filter(
      p => p.category.toLowerCase() === category.toLowerCase()
    );
    return of(filtered).pipe(delay(300));
  }

  /**
   * Crea un nuevo producto
   */
  createProduct(product: Omit<Product, 'id'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: `prod-${String(this.products.length + 1).padStart(3, '0')}`
    };
    this.products.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  /**
   * Actualiza un producto existente
   */
  updateProduct(id: string, updates: Partial<Product>): Observable<Product> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Producto con ID "${id}" no encontrado`));
    }

    this.products[index] = { ...this.products[index], ...updates };
    return of(this.products[index]).pipe(delay(500));
  }

  /**
   * Elimina un producto
   */
  deleteProduct(id: string): Observable<boolean> {
    const index = this.products.findIndex(p => p.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Producto con ID "${id}" no encontrado`));
    }

    this.products.splice(index, 1);
    return of(true).pipe(delay(300));
  }
}

