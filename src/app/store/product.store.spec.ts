import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { ProductStore } from './product.store';
import { ProductService } from '../services/product.service';
import { Product, CreateProductDto, UpdateProductDto } from '../models';
import { of, throwError } from 'rxjs';
import { firstValueFrom } from 'rxjs';

/**
 * Tests para ProductStore
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Tests unitarios del Store con Signals
 * ✅ Mock del ProductService
 * ✅ Verificación de estado reactivo
 * ✅ Tests de operaciones CRUD
 * ✅ Tests de paginación y filtros
 * ✅ Tests de computed signals
 */
describe('ProductStore', () => {
  let store: ProductStore;
  let productServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };

  // Mock products para tests
  const mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Kit Excavación T-Rex',
      description: 'Kit completo para excavación arqueológica',
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
      name: 'Figura Velociraptor',
      description: 'Figura articulada de Velociraptor',
      price: 24.99,
      category: 'Figuras',
      image: 'img/velocirraptor.png',
      stock: 25,
      featured: false,
      createdAt: new Date('2024-02-10'),
      updatedAt: new Date('2024-02-10')
    },
    {
      id: 'prod-003',
      name: 'Puzzle 3D Triceratops',
      description: 'Puzzle 3D de madera ecológica',
      price: 19.99,
      category: 'Puzzles',
      image: 'img/triceratops.png',
      stock: 30,
      featured: true,
      createdAt: new Date('2024-03-05'),
      updatedAt: new Date('2024-03-05')
    }
  ];

  beforeEach(() => {
    // Crear mock del ProductService con vi.fn()
    productServiceMock = {
      getProducts: vi.fn(),
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      search: vi.fn()
    };

    // Configurar respuestas por defecto
    productServiceMock.getProducts.mockReturnValue(of(mockProducts));

    TestBed.configureTestingModule({
      providers: [
        ProductStore,
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    });

    store = TestBed.inject(ProductStore);
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CREACIÓN E INICIALIZACIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Initialization', () => {
    it('should be created', () => {
      expect(store).toBeTruthy();
    });

    it('should have initial empty state', () => {
      expect(store.products()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.selectedProduct()).toBeNull();
    });

    it('should have initial pagination state', () => {
      expect(store.currentPage()).toBe(1);
      expect(store.pageSize()).toBe(10);
      expect(store.totalItems()).toBe(0);
    });

    it('should have initial filter state', () => {
      expect(store.searchTerm()).toBe('');
      expect(store.selectedCategory()).toBe('');
      expect(store.sortBy()).toBe('name');
      expect(store.sortOrder()).toBe('asc');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE LOAD
  // ══════════════════════════════════════════════════════════════════

  describe('load()', () => {
    it('should load products successfully', async () => {
      store.load();

      // Esperar a que el observable complete
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.products()).toEqual(mockProducts);
      expect(store.productCount()).toBe(3);
    });

    it('should update totalItems after loading', async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.totalItems()).toBe(mockProducts.length);
    });

    it('should set error on failure', async () => {
      const errorMessage = 'Network error';
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => new Error(errorMessage))
      );

      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.error()).toBe(errorMessage);
      expect(store.loading()).toBe(false);
    });

    it('should clear previous error on new load', async () => {
      // Primero provocar un error
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => new Error('Error'))
      );
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
      expect(store.error()).toBeTruthy();

      // Luego cargar exitosamente
      productServiceMock.getProducts.mockReturnValue(of(mockProducts));
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.error()).toBeNull();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ADD (CREATE)
  // ══════════════════════════════════════════════════════════════════

  describe('add()', () => {
    const newProductDto: CreateProductDto = {
      name: 'Nuevo Dinosaurio',
      description: 'Descripción del nuevo producto',
      price: 19.99,
      category: 'Figuras',
      stock: 10,
      featured: false
    };

    const newProduct: Product = {
      ...newProductDto,
      id: 'prod-004',
      image: 'img/dino.png',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    beforeEach(async () => {
      // Cargar productos iniciales
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should add product to the list', async () => {
      productServiceMock.createProduct.mockReturnValue(of(newProduct));

      const initialCount = store.productCount();
      store.add(newProductDto);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.productCount()).toBe(initialCount + 1);
      expect(store.products().find(p => p.id === 'prod-004')).toBeTruthy();
    });

    it('should increment totalItems after adding', async () => {
      productServiceMock.createProduct.mockReturnValue(of(newProduct));

      const initialTotal = store.totalItems();
      store.add(newProductDto);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.totalItems()).toBe(initialTotal + 1);
    });

    it('should handle add error', async () => {
      productServiceMock.createProduct.mockReturnValue(
        throwError(() => new Error('Create failed'))
      );

      store.add(newProductDto);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.error()).toBe('Create failed');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE UPDATE
  // ══════════════════════════════════════════════════════════════════

  describe('update()', () => {
    const updates: UpdateProductDto = {
      name: 'Nombre Actualizado',
      price: 39.99
    };

    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should update product in the list', async () => {
      const updatedProduct: Product = {
        ...mockProducts[0],
        ...updates,
        updatedAt: new Date()
      };
      productServiceMock.updateProduct.mockReturnValue(of(updatedProduct));

      store.update('prod-001', updates);
      await new Promise(resolve => setTimeout(resolve, 10));

      const product = store.products().find(p => p.id === 'prod-001');
      expect(product?.name).toBe('Nombre Actualizado');
      expect(product?.price).toBe(39.99);
    });

    it('should update selected product if same', async () => {
      // Seleccionar producto primero
      store.selectById('prod-001');

      const updatedProduct: Product = {
        ...mockProducts[0],
        ...updates,
        updatedAt: new Date()
      };
      productServiceMock.updateProduct.mockReturnValue(of(updatedProduct));

      store.update('prod-001', updates);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.selectedProduct()?.name).toBe('Nombre Actualizado');
    });

    it('should not change product count after update', async () => {
      const updatedProduct: Product = { ...mockProducts[0], ...updates };
      productServiceMock.updateProduct.mockReturnValue(of(updatedProduct));

      const countBefore = store.productCount();
      store.update('prod-001', updates);
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.productCount()).toBe(countBefore);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE DELETE
  // ══════════════════════════════════════════════════════════════════

  describe('delete()', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should remove product from the list', async () => {
      productServiceMock.deleteProduct.mockReturnValue(of(true));

      store.delete('prod-001');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.products().find(p => p.id === 'prod-001')).toBeUndefined();
    });

    it('should decrement totalItems after deleting', async () => {
      productServiceMock.deleteProduct.mockReturnValue(of(true));

      const initialTotal = store.totalItems();
      store.delete('prod-001');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.totalItems()).toBe(initialTotal - 1);
    });

    it('should clear selected product if deleted', async () => {
      store.selectById('prod-001');
      expect(store.selectedProduct()?.id).toBe('prod-001');

      productServiceMock.deleteProduct.mockReturnValue(of(true));
      store.delete('prod-001');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.selectedProduct()).toBeNull();
    });

    it('should not clear selected product if different product deleted', async () => {
      store.selectById('prod-001');
      productServiceMock.deleteProduct.mockReturnValue(of(true));

      store.delete('prod-002');
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.selectedProduct()?.id).toBe('prod-001');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE SELECCIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Selection', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should select a product', () => {
      store.select(mockProducts[0]);
      expect(store.selectedProduct()).toEqual(mockProducts[0]);
    });

    it('should select product by ID', () => {
      store.selectById('prod-002');
      expect(store.selectedProduct()?.id).toBe('prod-002');
    });

    it('should return null for non-existent ID', () => {
      store.selectById('non-existent');
      expect(store.selectedProduct()).toBeNull();
    });

    it('should clear selection', () => {
      store.select(mockProducts[0]);
      store.clearSelection();
      expect(store.selectedProduct()).toBeNull();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE BÚSQUEDA Y FILTROS
  // ══════════════════════════════════════════════════════════════════

  describe('Search and Filters', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should set search term', () => {
      store.setSearchTerm('rex');
      expect(store.searchTerm()).toBe('rex');
    });

    it('should filter products by search term', () => {
      store.setSearchTerm('T-Rex');
      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].name).toContain('T-Rex');
    });

    it('should filter by description too', () => {
      store.setSearchTerm('articulada');
      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].id).toBe('prod-002');
    });

    it('should set category filter', () => {
      store.setCategory('Figuras');
      expect(store.selectedCategory()).toBe('Figuras');
    });

    it('should filter products by category', () => {
      store.setCategory('Figuras');
      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].category).toBe('Figuras');
    });

    it('should combine search and category filters', () => {
      store.setSearchTerm('Puzzle');
      store.setCategory('Puzzles');
      expect(store.filteredProducts().length).toBe(1);
    });

    it('should clear all filters', () => {
      store.setSearchTerm('test');
      store.setCategory('Test');
      store.setSort('price', 'desc');

      store.clearFilters();

      expect(store.searchTerm()).toBe('');
      expect(store.selectedCategory()).toBe('');
      expect(store.sortBy()).toBe('name');
      expect(store.sortOrder()).toBe('asc');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ORDENACIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Sorting', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should sort by name ascending (default)', () => {
      const filtered = store.filteredProducts();
      expect(filtered[0].name.localeCompare(filtered[1].name)).toBeLessThanOrEqual(0);
    });

    it('should sort by price ascending', () => {
      store.setSort('price', 'asc');
      const filtered = store.filteredProducts();
      expect(filtered[0].price).toBeLessThanOrEqual(filtered[1].price);
    });

    it('should sort by price descending', () => {
      store.setSort('price', 'desc');
      const filtered = store.filteredProducts();
      expect(filtered[0].price).toBeGreaterThanOrEqual(filtered[1].price);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE PAGINACIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Pagination', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should calculate total pages correctly', () => {
      store.setPageSize(2);
      // Con 3 productos y pageSize 2, debería haber 2 páginas
      expect(store.totalPages()).toBe(2);
    });

    it('should go to specific page', () => {
      store.setPageSize(1);
      store.goToPage(2);
      expect(store.currentPage()).toBe(2);
    });

    it('should not go to invalid page (less than 1)', () => {
      store.goToPage(0);
      expect(store.currentPage()).toBe(1);
    });

    it('should not go to invalid page (greater than total)', () => {
      store.setPageSize(10); // Solo 1 página con 3 productos
      store.goToPage(5);
      expect(store.currentPage()).toBe(1);
    });

    it('should go to previous page', () => {
      store.setPageSize(1);
      store.goToPage(2);
      store.previousPage();
      expect(store.currentPage()).toBe(1);
    });

    it('should go to next page', () => {
      store.setPageSize(1);
      store.nextPage();
      expect(store.currentPage()).toBe(2);
    });

    it('should compute hasPreviousPage correctly', () => {
      expect(store.hasPreviousPage()).toBe(false);
      store.setPageSize(1);
      store.goToPage(2);
      expect(store.hasPreviousPage()).toBe(true);
    });

    it('should compute hasNextPage correctly', () => {
      store.setPageSize(1);
      expect(store.hasNextPage()).toBe(true);
      store.goToPage(3);
      expect(store.hasNextPage()).toBe(false);
    });

    it('should return paginated products slice', () => {
      store.setPageSize(2);
      expect(store.paginatedProducts().length).toBe(2);

      store.goToPage(2);
      expect(store.paginatedProducts().length).toBe(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE COMPUTED SIGNALS
  // ══════════════════════════════════════════════════════════════════

  describe('Computed Signals', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
    });

    it('should compute featuredProducts correctly', () => {
      const featured = store.featuredProducts();
      expect(featured.length).toBe(2);
      featured.forEach(p => expect(p.featured).toBe(true));
    });

    it('should compute categories correctly', () => {
      const categories = store.categories();
      expect(categories).toContain('Kits Educativos');
      expect(categories).toContain('Figuras');
      expect(categories).toContain('Puzzles');
      expect(categories.length).toBe(3);
    });

    it('should compute isEmpty correctly', () => {
      expect(store.isEmpty()).toBe(false);

      store.reset();
      expect(store.isEmpty()).toBe(true);
    });

    it('should compute hasError correctly', async () => {
      expect(store.hasError()).toBe(false);

      productServiceMock.getProducts.mockReturnValue(
        throwError(() => new Error('Error'))
      );
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.hasError()).toBe(true);
    });

    it('should compute viewState correctly', () => {
      const viewState = store.viewState();

      expect(viewState.loading).toBe(false);
      expect(viewState.error).toBeNull();
      expect(viewState.products.length).toBeGreaterThan(0);
      expect(viewState.isEmpty).toBe(false);
      expect(viewState.hasError).toBe(false);
      expect(viewState.pagination.currentPage).toBe(1);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE RESET
  // ══════════════════════════════════════════════════════════════════

  describe('reset()', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));
      store.setSearchTerm('test');
      store.setCategory('Figuras');
      store.goToPage(2);
    });

    it('should reset all state to initial values', () => {
      store.reset();

      expect(store.products()).toEqual([]);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();
      expect(store.selectedProduct()).toBeNull();
      expect(store.searchTerm()).toBe('');
      expect(store.selectedCategory()).toBe('');
      expect(store.currentPage()).toBe(1);
      expect(store.totalItems()).toBe(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE MANEJO DE ERRORES
  // ══════════════════════════════════════════════════════════════════

  describe('Error Handling', () => {
    it('should extract error message from Error object', async () => {
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => new Error('Custom error message'))
      );

      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.error()).toBe('Custom error message');
    });

    it('should extract friendlyMessage from error object', async () => {
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => ({ friendlyMessage: 'User friendly message' }))
      );

      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.error()).toBe('User friendly message');
    });

    it('should clear error with clearError()', async () => {
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => new Error('Error'))
      );
      store.load();
      await new Promise(resolve => setTimeout(resolve, 10));

      expect(store.error()).toBeTruthy();

      store.clearError();
      expect(store.error()).toBeNull();
    });
  });
});
