import { Routes } from '@angular/router';
import { authGuard } from '../../guards/auth.guard';
import { pendingChangesGuard } from '../../guards/pending-changes.guard';

/**
 * Rutas del módulo de administración (cargadas con Lazy Loading).
 *
 * Todas estas rutas están protegidas por authGuard.
 */
export const ADMIN_ROUTES: Routes = [
  {
    path: '',
    data: { breadcrumb: 'Panel Admin' },
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        loadComponent: () => import('./dashboard/admin-dashboard').then(m => m.AdminDashboard),
        data: { breadcrumb: 'Dashboard' }
      },
      {
        path: 'productos',
        data: { breadcrumb: 'Gestión Productos' },
        children: [
          {
            path: '',
            loadComponent: () => import('./products/admin-product-list').then(m => m.AdminProductList),
            data: { breadcrumb: '' }
          },
          {
            path: ':id/editar',
            loadComponent: () => import('./products/admin-product-edit').then(m => m.AdminProductEdit),
            canDeactivate: [pendingChangesGuard],
            data: { breadcrumb: 'Editar' }
          }
        ]
      },
      {
        path: 'usuarios',
        loadComponent: () => import('./users/admin-users').then(m => m.AdminUsers),
        data: { breadcrumb: 'Usuarios' }
      }
    ]
  }
];

