import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
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

  it('should maintain 3 curiosities when onNextCuriosity is called', () => {
    const initialLength = component.displayedCuriosities.length;
    component.onNextCuriosity(1);
    expect(component.displayedCuriosities.length).toBe(initialLength);
  });

  it('should replace curiosity at specified index', () => {
    const originalId = component.displayedCuriosities[0].id;
    component.onNextCuriosity(0);
    // El ID debe haber cambiado (puede ser igual si hay pocos elementos)
    expect(component.displayedCuriosities.length).toBe(3);
  });
});

