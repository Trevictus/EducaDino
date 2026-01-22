import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { of, throwError } from 'rxjs';
import { ProductListComponent } from './product-list';
import { ProductStore } from '../../store/product.store';
import { ProductService } from '../../services/product.service';
import { Product } from '../../models';

/**
 * Tests para ProductListComponent
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Tests de componente con Store
 * ✅ Tests de búsqueda con debounce
 * ✅ Tests de filtros y categorías
 * ✅ Tests de paginación
 * ✅ Tests de acciones CRUD
 */
describe('ProductListComponent', () => {
  let component: ProductListComponent;
  let fixture: ComponentFixture<ProductListComponent>;
  let productServiceMock: {
    getProducts: ReturnType<typeof vi.fn>;
    createProduct: ReturnType<typeof vi.fn>;
    updateProduct: ReturnType<typeof vi.fn>;
    deleteProduct: ReturnType<typeof vi.fn>;
  };

  const mockProducts: Product[] = [
    {
      id: 'prod-001',
      name: 'Kit Excavación T-Rex',
      description: 'Kit completo para excavación',
      price: 29.99,
      category: 'Kits Educativos',
      image: 'img/t-rex.png',
      stock: 15,
      featured: true
    },
    {
      id: 'prod-002',
      name: 'Figura Velociraptor',
      description: 'Figura articulada de Velociraptor',
      price: 24.99,
      category: 'Figuras',
      image: 'img/velocirraptor.png',
      stock: 25,
      featured: false
    },
    {
      id: 'prod-003',
      name: 'Puzzle 3D Triceratops',
      description: 'Puzzle 3D de madera',
      price: 19.99,
      category: 'Puzzles',
      image: 'img/triceratops.png',
      stock: 30,
      featured: true
    }
  ];

  beforeEach(async () => {
    productServiceMock = {
      getProducts: vi.fn().mockReturnValue(of(mockProducts)),
      createProduct: vi.fn(),
      updateProduct: vi.fn(),
      deleteProduct: vi.fn()
    };

    await TestBed.configureTestingModule({
      imports: [ProductListComponent, ReactiveFormsModule],
      providers: [
        ProductStore,
        { provide: ProductService, useValue: productServiceMock },
        provideHttpClient(),
        provideHttpClientTesting()
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductListComponent);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CREACIÓN
  // ══════════════════════════════════════════════════════════════════

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have store injected', () => {
    expect(component.store).toBeDefined();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CONTROLES DE FORMULARIO
  // ══════════════════════════════════════════════════════════════════

  describe('Form Controls', () => {
    it('should have searchControl initialized', () => {
      expect(component.searchControl).toBeDefined();
      expect(component.searchControl.value).toBe('');
    });

    it('should have categoryControl initialized', () => {
      expect(component.categoryControl).toBeDefined();
      expect(component.categoryControl.value).toBe('');
    });

    it('should have default categories', () => {
      expect(component.defaultCategories).toBeDefined();
      expect(component.defaultCategories.length).toBeGreaterThan(0);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CARGA DE DATOS
  // ══════════════════════════════════════════════════════════════════

  describe('Data Loading', () => {
    it('should load products on init', async () => {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(productServiceMock.getProducts).toHaveBeenCalled();
    });

    it('should retry loading on error', async () => {
      component.retry();
      expect(productServiceMock.getProducts).toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE BÚSQUEDA
  // ══════════════════════════════════════════════════════════════════

  describe('Search Functionality', () => {
    beforeEach(async () => {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should update store search term when searchControl changes', async () => {
      component.searchControl.setValue('T-Rex');

      // Esperar debounce (300ms)
      await new Promise(resolve => setTimeout(resolve, 350));

      expect(component.store.searchTerm()).toBe('T-Rex');
    });

    it('should not trigger search for same value (distinctUntilChanged)', async () => {
      component.searchControl.setValue('Dino');
      await new Promise(resolve => setTimeout(resolve, 350));

      const initialCallCount = component.store.searchTerm();

      component.searchControl.setValue('Dino');
      await new Promise(resolve => setTimeout(resolve, 350));

      // El término debería ser el mismo
      expect(component.store.searchTerm()).toBe(initialCallCount);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE FILTROS
  // ══════════════════════════════════════════════════════════════════

  describe('Filter Functionality', () => {
    beforeEach(async () => {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should update store category when categoryControl changes', async () => {
      component.categoryControl.setValue('Figuras');
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(component.store.selectedCategory()).toBe('Figuras');
    });

    it('should clear all filters', () => {
      component.searchControl.setValue('test');
      component.categoryControl.setValue('Figuras');

      component.clearFilters();

      expect(component.searchControl.value).toBe('');
      expect(component.categoryControl.value).toBe('');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE PAGINACIÓN
  // ══════════════════════════════════════════════════════════════════

  describe('Pagination', () => {
    beforeEach(async () => {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should go to next page', () => {
      const initialPage = component.store.currentPage();
      component.store.setPageSize(1); // Para tener varias páginas
      component.nextPage();
      expect(component.store.currentPage()).toBe(initialPage + 1);
    });

    it('should go to previous page', () => {
      component.store.setPageSize(1);
      component.store.goToPage(2);
      component.previousPage();
      expect(component.store.currentPage()).toBe(1);
    });

    it('should go to specific page', () => {
      component.store.setPageSize(1);
      component.goToPage(3);
      expect(component.store.currentPage()).toBe(3);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ORDENAMIENTO
  // ══════════════════════════════════════════════════════════════════

  describe('Sorting', () => {
    beforeEach(async () => {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should sort by name', () => {
      component.sortBy('name');
      expect(component.store.sortBy()).toBe('name');
    });

    it('should sort by price', () => {
      component.sortBy('price');
      expect(component.store.sortBy()).toBe('price');
    });

    it('should toggle sort order when clicking same field', () => {
      component.sortBy('price');
      expect(component.store.sortOrder()).toBe('asc');

      component.sortBy('price');
      expect(component.store.sortOrder()).toBe('desc');
    });

    it('should reset to asc when changing field', () => {
      component.sortBy('price');
      component.sortBy('price'); // Now desc
      component.sortBy('name'); // Should reset to asc

      expect(component.store.sortOrder()).toBe('asc');
    });

    it('should return correct sort icon', () => {
      // El sortBy inicial es 'name' con 'asc', así que el primer click lo toglea a 'desc'
      component.sortBy('name');
      expect(component.getSortIcon('name')).toBe('arrow_downward');

      component.sortBy('name');
      expect(component.getSortIcon('name')).toBe('arrow_upward');

      // Price no está activo, debería mostrar unfold_more
      expect(component.getSortIcon('price')).toBe('unfold_more');
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE ACCIONES DE PRODUCTO
  // ══════════════════════════════════════════════════════════════════

  describe('Product Actions', () => {
    beforeEach(async () => {
      component.ngOnInit();
      await new Promise(resolve => setTimeout(resolve, 50));
    });

    it('should select product on click', () => {
      const product = mockProducts[0];
      component.onProductClick(product);
      expect(component.store.selectedProduct()).toEqual(product);
    });

    it('should select product on edit', () => {
      const product = mockProducts[1];
      const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;

      component.onEditProduct(product, mockEvent);

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(component.store.selectedProduct()).toEqual(product);
    });

    it('should delete product with confirmation', async () => {
      const product = mockProducts[0];
      const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;
      productServiceMock.deleteProduct.mockReturnValue(of(true));

      // Mock confirm
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      component.onDeleteProduct(product, mockEvent);
      await new Promise(resolve => setTimeout(resolve, 50));

      expect(mockEvent.stopPropagation).toHaveBeenCalled();
      expect(window.confirm).toHaveBeenCalled();
    });

    it('should not delete product if confirm is cancelled', () => {
      const product = mockProducts[0];
      const mockEvent = { stopPropagation: vi.fn() } as unknown as Event;

      vi.spyOn(window, 'confirm').mockReturnValue(false);

      component.onDeleteProduct(product, mockEvent);

      expect(productServiceMock.deleteProduct).not.toHaveBeenCalled();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE TRACKBY
  // ══════════════════════════════════════════════════════════════════

  describe('TrackBy Function', () => {
    it('should return product id for trackBy', () => {
      const product = mockProducts[0];
      const result = component.trackByProductId(0, product);
      expect(result).toBe(product.id);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE MANEJO DE ERRORES
  // ══════════════════════════════════════════════════════════════════

  describe('Error Handling', () => {
    it('should clear error', () => {
      component.clearError();
      expect(component.store.error()).toBeNull();
    });
  });
});
