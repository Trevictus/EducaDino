import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { PLATFORM_ID, signal } from '@angular/core';
import { describe, it, expect, beforeEach } from 'vitest';
import { App } from './app';
import { ThemeService } from './services/theme';

// Mock del ThemeService para evitar efectos secundarios en tests
const mockThemeService = {
  theme: signal('light').asReadonly(),
  currentTheme: 'light',
  toggleTheme: () => {},
  setTheme: () => {}
};

describe('App', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [
        provideRouter([]),
        { provide: PLATFORM_ID, useValue: 'browser' },
        { provide: ThemeService, useValue: mockThemeService }
      ],
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render the app component', async () => {
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled).toBeTruthy();
  });
});
