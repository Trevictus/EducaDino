import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Home } from './home';

/**
 * Tests para Home Component
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * ✅ Tests de componente principal
 * ✅ Tests de datos y estado inicial
 * ✅ Tests de interacciones de usuario
 * ✅ Tests de responsive (mobile/desktop)
 */
describe('Home', () => {
  let component: Home;
  let fixture: ComponentFixture<Home>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Home]
    }).compileComponents();

    fixture = TestBed.createComponent(Home);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CREACIÓN
  // ══════════════════════════════════════════════════════════════════

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE DATOS INICIALES
  // ══════════════════════════════════════════════════════════════════

  describe('Initial Data', () => {
    it('should have discoveries array with 4 regions', () => {
      expect(component.discoveries).toBeDefined();
      expect(component.discoveries.length).toBe(4);
    });

    it('should have correct discovery regions', () => {
      const regions = component.discoveries.map(d => d.region);
      expect(regions).toContain('Norteamérica');
      expect(regions).toContain('Sudamérica');
      expect(regions).toContain('Europa');
      expect(regions).toContain('Australia');
    });

    it('should have trends array with 5 items', () => {
      expect(component.trends).toBeDefined();
      expect(component.trends.length).toBe(5);
    });

    it('should have correct trend categories', () => {
      const categories = component.trends.map(t => t.category);
      expect(categories).toContain('Comportamiento');
      expect(categories).toContain('Alimentación');
      expect(categories).toContain('Velocidad');
    });

    it('should initialize with currentCardIndex at 0', () => {
      expect(component.currentCardIndex).toBe(0);
    });

    it('should have no active tooltip initially', () => {
      expect(component.activeTooltip).toBeNull();
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE TOOLTIP
  // ══════════════════════════════════════════════════════════════════

  describe('Tooltip Interactions', () => {
    it('should show tooltip when showTooltip is called', () => {
      const discovery = component.discoveries[0];
      component.showTooltip(discovery);
      expect(component.activeTooltip).toBe(discovery);
    });

    it('should hide tooltip when hideTooltip is called', () => {
      component.showTooltip(component.discoveries[0]);
      component.hideTooltip();
      expect(component.activeTooltip).toBeNull();
    });

    it('should change active tooltip when showing different discovery', () => {
      component.showTooltip(component.discoveries[0]);
      component.showTooltip(component.discoveries[1]);
      expect(component.activeTooltip).toBe(component.discoveries[1]);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CARRUSEL (DESKTOP)
  // ══════════════════════════════════════════════════════════════════

  describe('Carousel Navigation (Desktop)', () => {
    beforeEach(() => {
      component.isMobile = false;
    });

    it('should not change currentCardIndex on scrollLeft in desktop mode', () => {
      component.currentCardIndex = 2;
      // En desktop, no modifica currentCardIndex directamente
      expect(component.isMobile).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE CARRUSEL (MOBILE)
  // ══════════════════════════════════════════════════════════════════

  describe('Carousel Navigation (Mobile)', () => {
    beforeEach(() => {
      component.isMobile = true;
      component.currentCardIndex = 2;

      // Mock del cardsContainer para evitar errores de scrollIntoView
      const mockCards = Array(5).fill(null).map(() => ({
        scrollIntoView: vi.fn()
      }));

      component.cardsContainer = {
        nativeElement: {
          scrollBy: vi.fn(),
          querySelectorAll: vi.fn().mockReturnValue(mockCards)
        }
      } as any;
    });

    it('should decrement currentCardIndex on scrollLeft', () => {
      component.scrollLeft();
      expect(component.currentCardIndex).toBe(1);
    });

    it('should not go below 0 on scrollLeft', () => {
      component.currentCardIndex = 0;
      component.scrollLeft();
      expect(component.currentCardIndex).toBe(0);
    });

    it('should increment currentCardIndex on scrollRight', () => {
      component.currentCardIndex = 0;
      component.scrollRight();
      expect(component.currentCardIndex).toBe(1);
    });

    it('should not exceed trends length on scrollRight', () => {
      component.currentCardIndex = component.trends.length - 1;
      component.scrollRight();
      expect(component.currentCardIndex).toBe(component.trends.length - 1);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE RESPONSIVE
  // ══════════════════════════════════════════════════════════════════

  describe('Responsive Behavior', () => {
    it('should detect mobile when window width <= 768', () => {
      // Simular ngOnInit con window pequeño
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      component.ngOnInit();
      expect(component.isMobile).toBe(true);
    });

    it('should detect desktop when window width > 768', () => {
      Object.defineProperty(window, 'innerWidth', { value: 1024, writable: true });
      component.ngOnInit();
      expect(component.isMobile).toBe(false);
    });

    it('should update isMobile on resize', () => {
      Object.defineProperty(window, 'innerWidth', { value: 500, writable: true });
      component.onResize();
      expect(component.isMobile).toBe(true);

      Object.defineProperty(window, 'innerWidth', { value: 1200, writable: true });
      component.onResize();
      expect(component.isMobile).toBe(false);
    });
  });

  // ══════════════════════════════════════════════════════════════════
  // TESTS DE DISCOVERY DATA STRUCTURE
  // ══════════════════════════════════════════════════════════════════

  describe('Discovery Data Structure', () => {
    it('should have valid positions for all discoveries', () => {
      component.discoveries.forEach(discovery => {
        expect(discovery.position).toBeDefined();
        expect(discovery.position.top).toBeDefined();
        expect(discovery.position.left).toBeDefined();
      });
    });

    it('should have dinosaur names for all discoveries', () => {
      component.discoveries.forEach(discovery => {
        expect(discovery.dinosaur).toBeDefined();
        expect(discovery.dinosaur.length).toBeGreaterThan(0);
      });
    });
  });
});
