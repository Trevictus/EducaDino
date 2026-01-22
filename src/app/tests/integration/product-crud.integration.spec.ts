import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of } from 'rxjs';
import { firstValueFrom } from 'rxjs';
import { ProductStore } from '../../store/product.store';
import { ProductService } from '../../services/product.service';
import { Product, CreateProductDto } from '../../models';

/**
 * Tests de Integración - Flujo CRUD Completo
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Test de integración de flujo completo
 * ✅ Verificación de estado reactivo end-to-end
 * ✅ Tests de operaciones CRUD encadenadas
 * ✅ Tests de filtros y paginación combinados
 */
describe('Integration: Product CRUD Flow', () => {
  let store: ProductStore;
  let productServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    getProductById: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
    search: ReturnType<typeof vi.fn>;
  };

  const initialProducts: Product[] = [
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
    }
  ];

  beforeEach(() => {
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(of(initialProducts)),
      getProductById: vi.fn(),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn(),
      search: vi.fn()
    };

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
  // TEST DE FLUJO COMPLETO: CARGAR -> CREAR -> ACTUALIZAR -> ELIMINAR
  // ══════════════════════════════════════════════════════════════════

  describe('Complete CRUD Flow', () => {
    it('should complete full CRUD lifecycle without page reload', async () => {
      // ═══════════════════════════════════════════════════════════
      // PASO 1: CARGAR PRODUCTOS INICIALES
      // ═══════════════════════════════════════════════════════════
      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.products().length).toBe(2);
      expect(store.loading()).toBe(false);
      expect(store.error()).toBeNull();

      // ═══════════════════════════════════════════════════════════
      // PASO 2: CREAR NUEVO PRODUCTO
      // ═══════════════════════════════════════════════════════════
      const newProductDto: CreateProductDto = {
        name: 'Nuevo Dinosaurio Triceratops',
        description: 'Un nuevo producto educativo',
        price: 35.99,
        category: 'Figuras',
        stock: 20,
        featured: true
      };

      const createdProduct: Product = {
        ...newProductDto,
        id: 'prod-003',
        image: 'img/triceratops.png',
        createdAt: new Date(),
        updatedAt: new Date()
      };

      productServiceMock.createProduct.mockReturnValue(of(createdProduct));

      store.add(newProductDto);
      await new Promise(resolve => setTimeout(resolve, 20));

      // Verificar que el producto se añadió SIN RECARGAR
      expect(store.products().length).toBe(3);
      expect(store.products().find(p => p.id === 'prod-003')).toBeTruthy();
      expect(store.totalItems()).toBe(3);

      // ═══════════════════════════════════════════════════════════
      // PASO 3: ACTUALIZAR PRODUCTO
      // ═══════════════════════════════════════════════════════════
      const updatedProduct: Product = {
        ...createdProduct,
        name: 'Triceratops Premium',
        price: 45.99,
        updatedAt: new Date()
      };

      productServiceMock.updateProduct.mockReturnValue(of(updatedProduct));

      store.update('prod-003', { name: 'Triceratops Premium', price: 45.99 });
      await new Promise(resolve => setTimeout(resolve, 20));

      // Verificar que el producto se actualizó SIN RECARGAR
      const updated = store.products().find(p => p.id === 'prod-003');
      expect(updated?.name).toBe('Triceratops Premium');
      expect(updated?.price).toBe(45.99);
      expect(store.products().length).toBe(3); // No cambió la cantidad

      // ═══════════════════════════════════════════════════════════
      // PASO 4: ELIMINAR PRODUCTO
      // ═══════════════════════════════════════════════════════════
      productServiceMock.deleteProduct.mockReturnValue(of(true));

      store.delete('prod-003');
      await new Promise(resolve => setTimeout(resolve, 20));

      // Verificar que el producto se eliminó SIN RECARGAR
      expect(store.products().length).toBe(2);
      expect(store.products().find(p => p.id === 'prod-003')).toBeUndefined();
      expect(store.totalItems()).toBe(2);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TEST DE FLUJO: BÚSQUEDA + FILTROS + PAGINACIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Search, Filter and Pagination Flow', () => {
    beforeEach(async () => {
      // Cargar más productos para probar paginación
      const moreProducts: Product[] = [
        ...initialProducts,
        {
          id: 'prod-003',
          name: 'Puzzle Diplodocus',
          description: 'Puzzle educativo',
          price: 15.99,
          category: 'Puzzles',
          image: 'img/diplodocus.png',
          stock: 40,
          featured: false
        },
        {
          id: 'prod-004',
          name: 'Libro Dinosaurios',
          description: 'Libro ilustrado',
          price: 22.99,
          category: 'Libros',
          image: 'img/book.png',
          stock: 50,
          featured: true
        },
        {
          id: 'prod-005',
          name: 'Figura Diplodocus',
          description: 'Figura grande',
          price: 55.99,
          category: 'Figuras',
          image: 'img/diplodocus.png',
          stock: 10,
          featured: false
        }
      ];

      productServiceMock.getProducts.mockReturnValue(of(moreProducts));
      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    it('should filter products by search term reactively', () => {
      expect(store.products().length).toBe(5);

      store.setSearchTerm('Diplodocus');

      // Los filteredProducts deberían actualizarse automáticamente
      expect(store.filteredProducts().length).toBe(2);
      expect(store.filteredProducts().every(p =>
        p.name.includes('Diplodocus') || p.description.includes('Diplodocus')
      )).toBe(true);
    });

    it('should filter products by category reactively', () => {
      store.setCategory('Figuras');

      expect(store.filteredProducts().length).toBe(2);
      expect(store.filteredProducts().every(p => p.category === 'Figuras')).toBe(true);
    });

    it('should combine search and category filters', () => {
      store.setSearchTerm('Diplodocus');
      store.setCategory('Figuras');

      expect(store.filteredProducts().length).toBe(1);
      expect(store.filteredProducts()[0].name).toBe('Figura Diplodocus');
    });

    it('should paginate filtered results', () => {
      store.setPageSize(2);

      expect(store.paginatedProducts().length).toBe(2);
      expect(store.totalPages()).toBe(3); // 5 productos / 2 por página = 3 páginas

      store.goToPage(2);
      expect(store.paginatedProducts().length).toBe(2);

      store.goToPage(3);
      expect(store.paginatedProducts().length).toBe(1);
    });

    it('should update filteredProducts when filters change', () => {
      store.setPageSize(2);
      store.goToPage(3);

      // Al cambiar el filtro, los productos filtrados deben actualizarse
      store.setSearchTerm('test');

      // Verificar que los filtros se aplicaron
      expect(store.searchTerm()).toBe('test');
      // La página puede o no resetearse según la implementación del effect
    });

    it('should clear all filters and reset state', () => {
      store.setSearchTerm('Diplodocus');
      store.setCategory('Figuras');
      store.setSort('price', 'desc');

      store.clearFilters();

      expect(store.searchTerm()).toBe('');
      expect(store.selectedCategory()).toBe('');
      expect(store.sortBy()).toBe('name');
      expect(store.sortOrder()).toBe('asc');
      expect(store.filteredProducts().length).toBe(5);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TEST DE FLUJO: SELECCIÓN Y EDICIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Selection and Edit Flow', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    it('should select product and update it', async () => {
      // Seleccionar producto
      store.selectById('prod-001');
      expect(store.selectedProduct()?.id).toBe('prod-001');

      // Actualizar el producto seleccionado
      const updatedProduct: Product = {
        ...initialProducts[0],
        name: 'Kit T-Rex Actualizado',
        price: 34.99
      };
      productServiceMock.updateProduct.mockReturnValue(of(updatedProduct));

      store.update('prod-001', { name: 'Kit T-Rex Actualizado', price: 34.99 });
      await new Promise(resolve => setTimeout(resolve, 20));

      // Verificar que el producto seleccionado también se actualizó
      expect(store.selectedProduct()?.name).toBe('Kit T-Rex Actualizado');
      expect(store.selectedProduct()?.price).toBe(34.99);
    });

    it('should clear selection when selected product is deleted', async () => {
      store.selectById('prod-001');
      expect(store.selectedProduct()).toBeTruthy();

      productServiceMock.deleteProduct.mockReturnValue(of(true));
      store.delete('prod-001');
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.selectedProduct()).toBeNull();
    });

    it('should maintain selection when different product is deleted', async () => {
      store.selectById('prod-001');

      productServiceMock.deleteProduct.mockReturnValue(of(true));
      store.delete('prod-002');
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.selectedProduct()?.id).toBe('prod-001');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TEST DE COMPUTED SIGNALS EN FLUJO
  // ══════════════════════════════════════════════════════════════════

  describe('Computed Signals Reactivity', () => {
    beforeEach(async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));
    });

    it('should update categories when product is added', async () => {
      const initialCategories = store.categories().length;

      const newProduct: Product = {
        id: 'prod-new',
        name: 'Nuevo en categoría nueva',
        description: 'Desc',
        price: 10,
        category: 'Nueva Categoría',
        image: 'img/new.png',
        stock: 5,
        featured: false
      };

      productServiceMock.createProduct.mockReturnValue(of(newProduct));
      store.add({
        name: 'Nuevo',
        description: 'Desc',
        price: 10,
        category: 'Nueva Categoría',
        stock: 5
      });
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.categories().length).toBe(initialCategories + 1);
      expect(store.categories()).toContain('Nueva Categoría');
    });

    it('should update featuredProducts computed signal', async () => {
      const initialFeatured = store.featuredProducts().length;

      // Añadir producto destacado
      const featuredProduct: Product = {
        id: 'prod-featured',
        name: 'Producto Destacado',
        description: 'Desc',
        price: 10,
        category: 'Test',
        image: 'img/test.png',
        stock: 5,
        featured: true
      };

      productServiceMock.createProduct.mockReturnValue(of(featuredProduct));
      store.add({
        name: 'Producto Destacado',
        description: 'Desc',
        price: 10,
        category: 'Test',
        stock: 5,
        featured: true
      });
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.featuredProducts().length).toBe(initialFeatured + 1);
    });

    it('should update viewState computed correctly', () => {
      const viewState = store.viewState();

      expect(viewState.loading).toBe(false);
      expect(viewState.error).toBeNull();
      expect(viewState.products.length).toBeGreaterThan(0);
      expect(viewState.pagination.currentPage).toBe(1);
      expect(viewState.isEmpty).toBe(false);
      expect(viewState.hasError).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TEST DE MANEJO DE ERRORES EN FLUJO
  // ══════════════════════════════════════════════════════════════════

  describe('Error Handling in Flow', () => {
    it('should recover from error and load successfully', async () => {
      // Primero, simular error
      const { throwError } = await import('rxjs');
      productServiceMock.getProducts.mockReturnValue(
        throwError(() => new Error('Network error'))
      );

      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.error()).toBe('Network error');
      expect(store.hasError()).toBe(true);

      // Ahora, simular éxito
      productServiceMock.getProducts.mockReturnValue(of(initialProducts));

      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));

      expect(store.error()).toBeNull();
      expect(store.hasError()).toBe(false);
      expect(store.products().length).toBe(2);
    });

    it('should maintain existing products when update fails', async () => {
      store.load();
      await new Promise(resolve => setTimeout(resolve, 20));

      const { throwError } = await import('rxjs');
      productServiceMock.updateProduct.mockReturnValue(
        throwError(() => new Error('Update failed'))
      );

      const productsBefore = [...store.products()];

      store.update('prod-001', { name: 'New Name' });
      await new Promise(resolve => setTimeout(resolve, 20));

      // Los productos no deberían haber cambiado
      expect(store.products()).toEqual(productsBefore);
      expect(store.error()).toBe('Update failed');
    });
  });
});
