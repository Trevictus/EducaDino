import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Curiosities } from './curiosities';
import { Card } from '../../components/card/card';
import { CommonModule } from '@angular/common';

describe('Curiosities', () => {
  let component: Curiosities;
  let fixture: ComponentFixture<Curiosities>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Curiosities, Card, CommonModule]
    }).compileComponents();

    fixture = TestBed.createComponent(Curiosities);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with exactly 3 curiosities', () => {
    expect(component.displayedCuriosities.length).toBe(3);
  });

  it('should replace only the clicked curiosity when onNextCuriosity is called', () => {
    const firstCuriosityId = component.displayedCuriosities[0].id;
    const secondId = component.displayedCuriosities[1].id;
    const thirdId = component.displayedCuriosities[2].id;

    // Reemplazar la primera tarjeta
    component.onNextCuriosity(0);

    // El segundo y tercero deben mantenerse
    expect(component.displayedCuriosities[1].id).toBe(secondId);
    expect(component.displayedCuriosities[2].id).toBe(thirdId);

    // El primero debe haber cambiado
    expect(component.displayedCuriosities[0].id).not.toBe(firstCuriosityId);
  });

  it('should maintain 3 curiosities when onNextCuriosity is called', () => {
    const initialLength = component.displayedCuriosities.length;
    component.onNextCuriosity(1);
    expect(component.displayedCuriosities.length).toBe(initialLength);
  });

  it('should not show duplicate curiosities in the 3 cards', () => {
    const secondId = component.displayedCuriosities[1].id;
    const thirdId = component.displayedCuriosities[2].id;

    // Reemplazar la primera tarjeta
    component.onNextCuriosity(0);

    // La nueva curiosidad no debe ser igual a la segunda ni a la tercera
    expect(component.displayedCuriosities[0].id).not.toBe(secondId);
    expect(component.displayedCuriosities[0].id).not.toBe(thirdId);
  });

  it('should replace any index independently without duplicates', () => {
    const firstId = component.displayedCuriosities[0].id;
    const secondId = component.displayedCuriosities[1].id;
    const thirdId = component.displayedCuriosities[2].id;

    // Reemplazar la segunda tarjeta (índice 1)
    component.onNextCuriosity(1);

    // El primero y tercero deben mantenerse
    expect(component.displayedCuriosities[0].id).toBe(firstId);
    expect(component.displayedCuriosities[2].id).toBe(thirdId);

    // El segundo debe haber cambiado y no debe ser igual a primero ni tercero
    expect(component.displayedCuriosities[1].id).not.toBe(secondId);
    expect(component.displayedCuriosities[1].id).not.toBe(firstId);
    expect(component.displayedCuriosities[1].id).not.toBe(thirdId);
  });

  it('should handle multiple replacements without duplicates', () => {
    // Hacer varios reemplazos
    for (let i = 0; i < 5; i++) {
      const ids = component.displayedCuriosities.map(c => c.id);
      // Verificar que no hay duplicados en las 3 tarjetas
      const uniqueIds = new Set(ids);
      expect(uniqueIds.size).toBe(3);

      component.onNextCuriosity(i % 3);
    }
  });
});

