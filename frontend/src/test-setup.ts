/**
 * Setup de Tests para Angular + Vitest
 *
 * FASE 7 - Testing (RA 7.2):
 * ─────────────────────────
 * Configura el entorno de testing para Angular con Vitest
 */

import 'zone.js';
import 'zone.js/testing';
import { getTestBed } from '@angular/core/testing';
import {
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting,
} from '@angular/platform-browser-dynamic/testing';

// Inicializar el entorno de testing de Angular
getTestBed().initTestEnvironment(
  BrowserDynamicTestingModule,
  platformBrowserDynamicTesting(),
);
