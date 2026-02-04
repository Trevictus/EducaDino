import { Injectable, inject, signal, computed } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { filter } from 'rxjs';

/**
 * Interfaz para una miga de pan
 */
export interface Breadcrumb {
  label: string;
  url: string;
  isCurrentPage?: boolean;
}

/**
 * BreadcrumbService - Servicio para gestión de breadcrumbs.
 *
 * FASE 4 - Navegación (Requisito 4.6):
 * ─────────────────────────────────────
 * - Escucha NavigationEnd para actualizar migas
 * - Recorre el árbol de rutas activas (route.firstChild)
 * - Construye el array de migas basándose en data.breadcrumb
 * - Soporta parámetros dinámicos (:id → valor real)
 *
 * Uso con Signals:
 * - breadcrumbs: Signal readonly con el array de migas
 * - hasBreadcrumbs: Computed que indica si hay migas
 */
@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly router = inject(Router);

  // ══════════════════════════════════════════════════════════════════
  // ESTADO REACTIVO CON SIGNALS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Signal privado con las breadcrumbs
   */
  private readonly _breadcrumbs = signal<Breadcrumb[]>([]);

  /**
   * Signal público de solo lectura
   */
  readonly breadcrumbs = this._breadcrumbs.asReadonly();

  /**
   * Computed: indica si hay breadcrumbs para mostrar
   */
  readonly hasBreadcrumbs = computed(() => this._breadcrumbs().length > 1);

  /**
   * Computed: última breadcrumb (página actual)
   */
  readonly currentPage = computed(() => {
    const crumbs = this._breadcrumbs();
    return crumbs.length > 0 ? crumbs[crumbs.length - 1] : null;
  });

  // ══════════════════════════════════════════════════════════════════
  // COMPATIBILIDAD CON OBSERVABLES (legacy)
  // ══════════════════════════════════════════════════════════════════

  /**
   * @deprecated Usar el Signal breadcrumbs() en su lugar
   */
  get breadcrumbs$() {
    // Para compatibilidad, convertir signal a observable-like
    return {
      subscribe: (callback: (value: Breadcrumb[]) => void) => {
        callback(this._breadcrumbs());
        return { unsubscribe: () => {} };
      }
    };
  }

  constructor() {
    this.initBreadcrumbListener();
  }

  // ══════════════════════════════════════════════════════════════════
  // INICIALIZACIÓN
  // ══════════════════════════════════════════════════════════════════

  /**
   * Inicializa el listener de navegación
   */
  private initBreadcrumbListener(): void {
    // Generar breadcrumbs iniciales
    this.generateBreadcrumbs();

    // Escuchar cambios de navegación
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.generateBreadcrumbs();
      });
  }

  // ══════════════════════════════════════════════════════════════════
  // GENERACIÓN DE BREADCRUMBS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Genera el array de breadcrumbs basándose en la ruta activa
   */
  private generateBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];

    // Siempre añadir Home como primera miga
    breadcrumbs.push({
      label: 'Inicio',
      url: '/home',
      isCurrentPage: false
    });

    // Recorrer el árbol de rutas
    let currentRoute = this.router.routerState.snapshot.root;
    let currentUrl = '';

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;

      // Construir la URL actual
      const routeUrl = currentRoute.url.map(segment => segment.path).join('/');
      if (routeUrl) {
        currentUrl += `/${routeUrl}`;
      }

      // Obtener el label del breadcrumb
      const breadcrumbLabel = this.getBreadcrumbLabel(currentRoute);

      if (breadcrumbLabel) {
        breadcrumbs.push({
          label: breadcrumbLabel,
          url: currentUrl,
          isCurrentPage: false
        });
      }
    }

    // Marcar la última miga como página actual
    if (breadcrumbs.length > 0) {
      breadcrumbs[breadcrumbs.length - 1].isCurrentPage = true;
    }

    // Actualizar el signal
    this._breadcrumbs.set(breadcrumbs);
  }

  /**
   * Obtiene el label de breadcrumb de una ruta
   *
   * Soporta parámetros dinámicos como :id que se reemplazan
   * por el valor real del parámetro.
   */
  private getBreadcrumbLabel(route: ActivatedRouteSnapshot): string | null {
    // Verificar si la ruta tiene configurado breadcrumb
    if (!route.data || !route.data['breadcrumb']) {
      return null;
    }

    let label = route.data['breadcrumb'] as string;

    // Si el label está vacío, no mostrar breadcrumb
    if (!label) {
      return null;
    }

    // Reemplazar parámetros dinámicos (:param → valor)
    if (label.includes(':')) {
      const paramMatches = label.match(/:(\w+)/g);

      if (paramMatches) {
        paramMatches.forEach(match => {
          const paramName = match.substring(1); // Quitar el :
          const paramValue = route.paramMap.get(paramName);

          if (paramValue) {
            label = label.replace(match, paramValue);
          }
        });
      }
    }

    return label;
  }

  // ══════════════════════════════════════════════════════════════════
  // MÉTODOS PÚBLICOS
  // ══════════════════════════════════════════════════════════════════

  /**
   * Obtiene las breadcrumbs actuales (para uso imperativo)
   */
  getCurrentBreadcrumbs(): Breadcrumb[] {
    return this._breadcrumbs();
  }

  /**
   * Fuerza la regeneración de breadcrumbs
   */
  refresh(): void {
    this.generateBreadcrumbs();
  }
}
