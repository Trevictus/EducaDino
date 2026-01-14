import { Injectable, inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRouteSnapshot } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';

export interface Breadcrumb {
  label: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class BreadcrumbService {
  private readonly router = inject(Router);
  private readonly breadcrumbsSubject = new BehaviorSubject<Breadcrumb[]>([]);
  readonly breadcrumbs$ = this.breadcrumbsSubject.asObservable();

  constructor() {
    this.initBreadcrumbListener();
  }

  private initBreadcrumbListener(): void {
    this.generateBreadcrumbs();
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.generateBreadcrumbs();
      });
  }

  private generateBreadcrumbs(): void {
    const breadcrumbs: Breadcrumb[] = [];
    breadcrumbs.push({ label: 'Inicio', url: '/home' });

    let currentRoute = this.router.routerState.snapshot.root;
    let currentUrl = '';

    while (currentRoute.firstChild) {
      currentRoute = currentRoute.firstChild;
      const routeUrl = currentRoute.url.map(segment => segment.path).join('/');

      if (routeUrl) {
        currentUrl += `/${routeUrl}`;
      }

      const breadcrumbLabel = this.getBreadcrumbLabel(currentRoute);
      if (breadcrumbLabel) {
        breadcrumbs.push({ label: breadcrumbLabel, url: currentUrl });
      }
    }

    this.breadcrumbsSubject.next(breadcrumbs);
  }

  private getBreadcrumbLabel(route: ActivatedRouteSnapshot): string | null {
    if (route.data && route.data['breadcrumb']) {
      let label = route.data['breadcrumb'];
      if (label.includes(':')) {
        const paramMatch = label.match(/:(\w+)/);
        if (paramMatch) {
          const paramName = paramMatch[1];
          const paramValue = route.paramMap.get(paramName);
          if (paramValue) {
            label = label.replace(`:${paramName}`, paramValue);
          }
        }
      }
      return label;
    }
    return null;
  }

  getCurrentBreadcrumbs(): Breadcrumb[] {
    return this.breadcrumbsSubject.getValue();
  }
}
