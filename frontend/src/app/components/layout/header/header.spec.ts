import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID, signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { Header } from './header';
import { ThemeService } from '../../../services/theme';

// Mock del ThemeService para evitar efectos secundarios en tests
const mockThemeService = {
  theme: signal('light').asReadonly(),
  currentTheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
};

describe('Header', () => {
  let component: Header;
  let fixture: ComponentFixture<Header>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Header],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useValue: mockThemeService }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(Header);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
