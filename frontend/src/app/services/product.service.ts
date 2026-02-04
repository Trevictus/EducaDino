import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, of, throwError, delay, map, retry, catchError, tap } from 'rxjs';
import { ApiService, PaginatedResponse } from '../core/services/api.service';
import { environment } from '../../environments/environment';
import {
  Product,
  CreateProductDto,
  UpdateProductDto,
  ProductSearchParams
} from '../models/product.dto';

// Re-exportar tipos para uso externo
export type { Product, CreateProductDto, UpdateProductDto, ProductSearchParams };

/**
 * Respuesta de subida de imagen
 */
export interface ImageUploadResponse {
  success: boolean;
  imageUrl: string;
  fileName: string;
}

/**
 * ProductService - Servicio CRUD para gestión de productos.
 *
 * FASE 5 - HTTP Client (Requisitos cumplidos):
 * ─────────────────────────────────────────────
 * 5.2 - Métodos CRUD: getAll, getById, create, update, delete
 * 5.3 - Tipado estricto: Interfaces TypeScript para peticiones/respuestas
 * 5.4 - FormData: uploadImage para subida de archivos
 * 5.5 - Operadores RxJS: map, retry, catchError, tap
 * 5.6 - Interceptores: Configurados en app.config.ts
 *
 * MODO DESARROLLO:
 * Usa datos mock cuando la API no está disponible.
 * En producción, se conecta a la API REST real.
 */
@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly api = inject(ApiService);
  private readonly endpoint = '/products';

  // Estado reactivo con Signals para caché local
  private readonly productsCache = signal<Product[]>([]);
  readonly products = this.productsCache.asReadonly();
  readonly featuredProducts = computed(() =>
    this.productsCache().filter(p => p.featured)
  );

  /**
   * Datos de productos simulados (mock data para desarrollo)
   * Se usan cuando la API no está disponible
   */
  private readonly mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Kit Excavación T-Rex',
      description: 'Kit completo para excavación arqueológica con réplica de fósil de T-Rex. Incluye herramientas y guía educativa.',
      price: 29.99,
      category: 'Kits Educativos',
      image: 'img/t-rex.png',
      stock: 15,
      featured: true,
      createdAt: new Date('2024-01-15'),
      updatedAt: new Date('2024-01-15')
    },
    {
      id: 'prod-002',
      name: 'Figura Velociraptor Articulada',
      description: 'Figura articulada de Velociraptor a escala 1:6 con detalles realistas basados en descubrimientos recientes.',
      price: 24.99,
      category: 'Figuras',
      image: 'img/velocirraptor.png',
      stock: 25,
      featured: true,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 'prod-003',
      name: 'Puzzle 3D Triceratops',
      description: 'Puzzle 3D de madera ecológica con 150 piezas para armar tu propio Triceratops.',
      price: 19.99,
      category: 'Puzzles',
      image: 'img/triceratops.png',
      stock: 30,
      featured: false,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05')
    },
    {
      id: 'prod-004',
      name: 'Libro: Era de los Dinosaurios',
      description: 'Libro ilustrado con información científica sobre los dinosaurios y su era. Perfecto para niños de 8-12 años.',
      price: 15.99,
      category: 'Libros',
      image: 'img/quetzalcoatl.png',
      stock: 50,
      featured: true,
      createdAt: new Date('2024-04-20'),
      updatedAt: new Date('2024-04-20')
    },
    {
      id: 'prod-005',
      name: 'Peluche Argentinasaurio',
      description: 'Peluche suave del Argentinasaurio, el dinosaurio más grande descubierto en Argentina. 40cm de largo.',
      price: 22.99,
      category: 'Peluches',
      image: 'img/argentinasaurus.png',
      stock: 20,
      featured: false,
      createdAt: new Date('2024-05-12'),
      updatedAt: new Date('2024-05-12')
    }
  ];

  // ══════════════════════════════════════════════════════════════════
  // MÉTODOS CRUD (Requisito 5.2)
  // ══════════════════════════════════════════════════════════════════

  /**
   * GET - Obtiene todos los productos
   *
   * Usa operador `map` para transformar datos (fechas string → Date)
   * Usa `retry(2)` para resiliencia ante fallos de red
   */
  getProducts(): Observable<Product[]> {
    // En desarrollo, usar mock data
    if (this.useMockData()) {
      return of([...this.mockProducts]).pipe(
        delay(300),
        map(products => this.transformProducts(products)),
        tap(products => this.productsCache.set(products))
      );
    }

    // En producción, llamar a la API
    return this.api.get<Product[]>(this.endpoint).pipe(
      retry(2), // Reintentar 2 veces en caso de error
      map(products => this.transformProducts(products)),
      tap(products => this.productsCache.set(products)),
      catchError(error => this.handleError('getProducts', error))
    );
  }

  /**
   * GET - Obtiene productos destacados
   */
  getFeaturedProducts(): Observable<Product[]> {
    if (this.useMockData()) {
      const featured = this.mockProducts.filter(p => p.featured);
      return of(featured).pipe(
        delay(300),
        map(products => this.transformProducts(products))
      );
    }

    return this.api.get<Product[]>(`${this.endpoint}/featured`).pipe(
      retry(2),
      map(products => this.transformProducts(products)),
      catchError(error => this.handleError('getFeaturedProducts', error))
    );
  }

  /**
   * GET - Obtiene un producto por ID (tipado estricto)
   */
  getProductById(id: string): Observable<Product> {
    if (this.useMockData()) {
      const product = this.mockProducts.find(p => p.id === id);

      if (!product) {
        return throwError(() => new Error(`Producto con ID "${id}" no encontrado`)).pipe(delay(200));
      }

      return of({ ...product }).pipe(
        delay(300),
        map(p => this.transformProduct(p))
      );
    }

    return this.api.get<Product>(`${this.endpoint}/${id}`).pipe(
      retry(2),
      map(product => this.transformProduct(product)),
      catchError(error => this.handleError('getProductById', error))
    );
  }

  /**
   * GET - Búsqueda con HttpParams para paginación y filtros
   */
  search(params: ProductSearchParams): Observable<PaginatedResponse<Product>> {
    if (this.useMockData()) {
      return this.mockSearch(params);
    }

    // Construir HttpParams para la query
    const httpParams = this.buildSearchParams(params);

    return this.api.get<PaginatedResponse<Product>>(`${this.endpoint}/search`, {
      params: httpParams
    }).pipe(
      retry(2),
      map(response => ({
        ...response,
        data: this.transformProducts(response.data)
      })),
      catchError(error => this.handleError('search', error))
    );
  }

  /**
   * GET - Obtiene productos por categoría
   */
  getProductsByCategory(category: string): Observable<Product[]> {
    if (this.useMockData()) {
      const filtered = this.mockProducts.filter(
        p => p.category.toLowerCase() === category.toLowerCase()
      );
      return of(filtered).pipe(
        delay(300),
        map(products => this.transformProducts(products))
      );
    }

    return this.api.get<Product[]>(this.endpoint, {
      params: { category }
    }).pipe(
      retry(2),
      map(products => this.transformProducts(products)),
      catchError(error => this.handleError('getProductsByCategory', error))
    );
  }

  /**
   * POST - Crea un nuevo producto (JSON)
   */
  createProduct(product: CreateProductDto): Observable<Product> {
    if (this.useMockData()) {
      const newProduct: Product = {
        ...product,
        id: `prod-${String(this.mockProducts.length + 1).padStart(3, '0')}`,
        image: product.image || 'img/t-rex.png',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.mockProducts.push(newProduct);
      return of(newProduct).pipe(delay(500));
    }

    return this.api.post<Product>(this.endpoint, product).pipe(
      tap(newProduct => {
        // Actualizar caché local
        this.productsCache.update(products => [...products, newProduct]);
      }),
      catchError(error => this.handleError('createProduct', error))
    );
  }

  /**
   * PUT - Actualiza un producto existente
   */
  updateProduct(id: string, updates: UpdateProductDto): Observable<Product> {
    if (this.useMockData()) {
      const index = this.mockProducts.findIndex(p => p.id === id);

      if (index === -1) {
        return throwError(() => new Error(`Producto con ID "${id}" no encontrado`));
      }

      this.mockProducts[index] = {
        ...this.mockProducts[index],
        ...updates,
        updatedAt: new Date()
      };
      return of(this.mockProducts[index]).pipe(delay(500));
    }

    return this.api.put<Product>(`${this.endpoint}/${id}`, updates).pipe(
      tap(updatedProduct => {
        // Actualizar caché local
        this.productsCache.update(products =>
          products.map(p => p.id === id ? updatedProduct : p)
        );
      }),
      catchError(error => this.handleError('updateProduct', error))
    );
  }

  /**
   * DELETE - Elimina un producto
   */
  deleteProduct(id: string): Observable<boolean> {
    if (this.useMockData()) {
      const index = this.mockProducts.findIndex(p => p.id === id);

      if (index === -1) {
        return throwError(() => new Error(`Producto con ID "${id}" no encontrado`));
      }

      this.mockProducts.splice(index, 1);
      return of(true).pipe(delay(300));
    }

    return this.api.delete<void>(`${this.endpoint}/${id}`).pipe(
      map(() => true),
      tap(() => {
        // Actualizar caché local
        this.productsCache.update(products =>
          products.filter(p => p.id !== id)
        );
      }),
      catchError(error => this.handleError('deleteProduct', error))
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // SUBIDA DE ARCHIVOS (Requisito 5.4)
  // ══════════════════════════════════════════════════════════════════

  /**
   * POST - Sube una imagen usando FormData
   *
   * Demuestra el uso de FormData para subir archivos (Requisito 5.4)
   */
  uploadImage(productId: string, file: File): Observable<ImageUploadResponse> {
    if (this.useMockData()) {
      // Simular subida de archivo
      return of({
        success: true,
        imageUrl: `img/${file.name}`,
        fileName: file.name
      }).pipe(delay(1000));
    }

    return this.api.uploadFile<ImageUploadResponse>(
      `${this.endpoint}/${productId}/image`,
      file,
      'image'
    ).pipe(
      tap(response => {
        if (response.success) {
          // Actualizar la imagen en el caché local
          this.productsCache.update(products =>
            products.map(p =>
              p.id === productId ? { ...p, image: response.imageUrl } : p
            )
          );
        }
      }),
      catchError(error => this.handleError('uploadImage', error))
    );
  }

  // ══════════════════════════════════════════════════════════════════
  // MÉTODOS PRIVADOS DE UTILIDAD
  // ══════════════════════════════════════════════════════════════════

  /**
   * Determina si usar mock data (desarrollo sin API)
   */
  private useMockData(): boolean {
    // Usar mock si no hay API configurada o estamos en modo desarrollo
    return !environment.production || !environment.apiUrl;
  }

  /**
   * Transforma un producto (convierte strings de fecha a Date)
   */
  private transformProduct(product: Product): Product {
    return {
      ...product,
      createdAt: product.createdAt ? new Date(product.createdAt) : undefined,
      updatedAt: product.updatedAt ? new Date(product.updatedAt) : undefined
    };
  }

  /**
   * Transforma un array de productos
   */
  private transformProducts(products: Product[]): Product[] {
    return products.map(p => this.transformProduct(p));
  }

  /**
   * Construye HttpParams desde ProductSearchParams
   */
  private buildSearchParams(params: ProductSearchParams): Record<string, string | number | boolean> {
    const httpParams: Record<string, string | number | boolean> = {};

    if (params.page !== undefined) httpParams['page'] = params.page;
    if (params.pageSize !== undefined) httpParams['pageSize'] = params.pageSize;
    if (params.search) httpParams['search'] = params.search;
    if (params.category) httpParams['category'] = params.category;
    if (params.minPrice !== undefined) httpParams['minPrice'] = params.minPrice;
    if (params.maxPrice !== undefined) httpParams['maxPrice'] = params.maxPrice;
    if (params.featured !== undefined) httpParams['featured'] = params.featured;
    if (params.sortBy) httpParams['sortBy'] = params.sortBy;
    if (params.sortOrder) httpParams['sortOrder'] = params.sortOrder;

    return httpParams;
  }

  /**
   * Búsqueda mock con paginación y filtros
   */
  private mockSearch(params: ProductSearchParams): Observable<PaginatedResponse<Product>> {
    let filtered = [...this.mockProducts];

    // Aplicar filtros
    if (params.search) {
      const searchLower = params.search.toLowerCase();
      filtered = filtered.filter(p =>
        p.name.toLowerCase().includes(searchLower) ||
        p.description.toLowerCase().includes(searchLower)
      );
    }

    if (params.category) {
      filtered = filtered.filter(p =>
        p.category.toLowerCase() === params.category!.toLowerCase()
      );
    }

    if (params.minPrice !== undefined) {
      filtered = filtered.filter(p => p.price >= params.minPrice!);
    }

    if (params.maxPrice !== undefined) {
      filtered = filtered.filter(p => p.price <= params.maxPrice!);
    }

    if (params.featured !== undefined) {
      filtered = filtered.filter(p => p.featured === params.featured);
    }

    // Ordenar
    if (params.sortBy) {
      filtered.sort((a, b) => {
        const aVal = a[params.sortBy!];
        const bVal = b[params.sortBy!];
        const order = params.sortOrder === 'desc' ? -1 : 1;

        if (typeof aVal === 'string' && typeof bVal === 'string') {
          return aVal.localeCompare(bVal) * order;
        }
        return ((aVal as number) - (bVal as number)) * order;
      });
    }

    // Paginar
    const page = params.page || 1;
    const pageSize = params.pageSize || 10;
    const startIndex = (page - 1) * pageSize;
    const paginatedData = filtered.slice(startIndex, startIndex + pageSize);

    const response: PaginatedResponse<Product> = {
      data: paginatedData,
      meta: {
        currentPage: page,
        totalPages: Math.ceil(filtered.length / pageSize),
        pageSize: pageSize,
        totalItems: filtered.length,
        hasNextPage: page * pageSize < filtered.length,
        hasPreviousPage: page > 1
      }
    };

    return of(response).pipe(
      delay(300),
      map(res => ({
        ...res,
        data: this.transformProducts(res.data)
      }))
    );
  }

  /**
   * Manejo centralizado de errores
   */
  private handleError(operation: string, error: unknown): Observable<never> {
    console.error(`[ProductService.${operation}] Error:`, error);
    return throwError(() => error);
  }
}

