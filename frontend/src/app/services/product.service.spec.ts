import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { ProductService, Product, CreateProductDto, UpdateProductDto } from './product.service';
import { ApiService } from '../core/services/api.service';
import { firstValueFrom } from 'rxjs';

/**
 * Tests para ProductService
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Tests unitarios con mocks HTTP
 * ✅ Verificación de operaciones CRUD
 * ✅ Tests de transformación de datos
 * ✅ Tests de manejo de errores
 * ✅ Tests de caché con Signals
 */
describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        ProductService,
        ApiService,
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CREACIÓN
  // ══════════════════════════════════════════════════════════════════

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should have empty products signal initially', () => {
    expect(service.products()).toEqual([]);
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE getProducts()
  // ══════════════════════════════════════════════════════════════════

  describe('getProducts()', () => {
    it('should return mock products in development mode', async () => {
      const result = await firstValueFrom(service.getProducts());

      expect(result.length).toBeGreaterThan(0);
      expect(result[0].name).toBeDefined();
    });

    it('should transform date strings to Date objects', async () => {
      const result = await firstValueFrom(service.getProducts());

      // Verificar que las fechas son objetos Date
      expect(result[0].createdAt).toBeInstanceOf(Date);
    });

    it('should update products cache signal after loading', async () => {
      await firstValueFrom(service.getProducts());

      expect(service.products().length).toBeGreaterThan(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE getProductById()
  // ══════════════════════════════════════════════════════════════════

  describe('getProductById()', () => {
    it('should return a product by ID (mock mode)', async () => {
      const result = await firstValueFrom(service.getProductById('prod-001'));

      expect(result).toBeTruthy();
      expect(result.id).toBe('prod-001');
      expect(result.name).toBe('Kit Excavación T-Rex');
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        firstValueFrom(service.getProductById('non-existent'))
      ).rejects.toThrow();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE getFeaturedProducts()
  // ══════════════════════════════════════════════════════════════════

  describe('getFeaturedProducts()', () => {
    it('should return only featured products', async () => {
      const result = await firstValueFrom(service.getFeaturedProducts());

      expect(result.length).toBeGreaterThan(0);
      result.forEach(product => {
        expect(product.featured).toBe(true);
      });
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE getProductsByCategory()
  // ══════════════════════════════════════════════════════════════════

  describe('getProductsByCategory()', () => {
    it('should filter products by category', async () => {
      const result = await firstValueFrom(service.getProductsByCategory('Kits Educativos'));

      expect(result.length).toBeGreaterThan(0);
      result.forEach(product => {
        expect(product.category.toLowerCase()).toBe('kits educativos');
      });
    });

    it('should return empty array for non-existent category', async () => {
      const result = await firstValueFrom(service.getProductsByCategory('NonExistent'));

      expect(result.length).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE createProduct()
  // ══════════════════════════════════════════════════════════════════

  describe('createProduct()', () => {
    it('should create a new product', async () => {
      const newProduct: CreateProductDto = {
        name: 'Nuevo Dinosaurio',
        description: 'Descripción del nuevo producto',
        price: 19.99,
        category: 'Figuras',
        stock: 10,
        featured: false
      };

      const result = await firstValueFrom(service.createProduct(newProduct));

      expect(result).toBeTruthy();
      expect(result.id).toBeDefined();
      expect(result.name).toBe('Nuevo Dinosaurio');
      expect(result.createdAt).toBeDefined();
    });

    it('should assign generated ID to new product', async () => {
      const newProduct: CreateProductDto = {
        name: 'Test Product',
        description: 'Test',
        price: 10,
        category: 'Test',
        stock: 5
      };

      const result = await firstValueFrom(service.createProduct(newProduct));

      expect(result.id).toMatch(/^prod-\d{3}$/);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE updateProduct()
  // ══════════════════════════════════════════════════════════════════

  describe('updateProduct()', () => {
    it('should update an existing product', async () => {
      const updates: UpdateProductDto = {
        name: 'Nombre Actualizado',
        price: 39.99
      };

      const result = await firstValueFrom(service.updateProduct('prod-001', updates));

      expect(result).toBeTruthy();
      expect(result.name).toBe('Nombre Actualizado');
      expect(result.price).toBe(39.99);
    });

    it('should update updatedAt timestamp', async () => {
      const updates: UpdateProductDto = { price: 49.99 };
      const beforeUpdate = new Date();

      const result = await firstValueFrom(service.updateProduct('prod-001', updates));

      expect(result.updatedAt).toBeDefined();
      expect(result.updatedAt!.getTime()).toBeGreaterThanOrEqual(beforeUpdate.getTime());
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        firstValueFrom(service.updateProduct('non-existent', { price: 10 }))
      ).rejects.toThrow();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE deleteProduct()
  // ══════════════════════════════════════════════════════════════════

  describe('deleteProduct()', () => {
    it('should delete an existing product', async () => {
      const result = await firstValueFrom(service.deleteProduct('prod-001'));

      expect(result).toBe(true);
    });

    it('should throw error for non-existent product', async () => {
      await expect(
        firstValueFrom(service.deleteProduct('non-existent'))
      ).rejects.toThrow();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE uploadImage()
  // ══════════════════════════════════════════════════════════════════

  describe('uploadImage()', () => {
    it('should simulate image upload', async () => {
      const mockFile = new File(['test'], 'dino.png', { type: 'image/png' });

      const result = await firstValueFrom(service.uploadImage('prod-001', mockFile));

      expect(result).toBeTruthy();
      expect(result.success).toBe(true);
      expect(result.imageUrl).toContain('dino.png');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE COMPUTED SIGNALS
  // ══════════════════════════════════════════════════════════════════

  describe('Computed Signals', () => {
    it('should compute featuredProducts correctly', async () => {
      // Cargar productos primero
      await firstValueFrom(service.getProducts());

      const featured = service.featuredProducts();
      expect(featured.length).toBeGreaterThan(0);
      featured.forEach(p => expect(p.featured).toBe(true));
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE search()
  // ══════════════════════════════════════════════════════════════════

  describe('search()', () => {
    it('should return paginated results', async () => {
      const result = await firstValueFrom(service.search({ page: 1, pageSize: 2 }));

      expect(result).toBeTruthy();
      expect(result.data).toBeDefined();
      expect(result.meta).toBeDefined();
      expect(result.meta.currentPage).toBe(1);
    });

    it('should filter by search term', async () => {
      const result = await firstValueFrom(service.search({ search: 'T-Rex' }));

      expect(result.data.length).toBeGreaterThan(0);
      expect(result.data[0].name.toLowerCase()).toContain('t-rex');
    });

    it('should filter by category', async () => {
      const result = await firstValueFrom(service.search({ category: 'Figuras' }));

      result.data.forEach((product: Product) => {
        expect(product.category).toBe('Figuras');
      });
    });

    it('should filter by price range', async () => {
      const result = await firstValueFrom(service.search({ minPrice: 20, maxPrice: 30 }));

      result.data.forEach((product: Product) => {
        expect(product.price).toBeGreaterThanOrEqual(20);
        expect(product.price).toBeLessThanOrEqual(30);
      });
    });
  });
});
