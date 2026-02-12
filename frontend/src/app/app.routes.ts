import { Routes } from '@angular/router';
import { authGuard } from './guards/auth.guard';
import { pendingChangesGuard } from './guards/pending-changes.guard';
import { productResolver } from './resolvers/product.resolver';

// Componentes cargados de forma eager (rutas principales)
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Curiosities } from './pages/curiosities/curiosities';
import { Orders } from './pages/orders/orders';
import { Minigames } from './pages/minigames/minigames';

/**
 * Configuración de Rutas de la Aplicación
 *
 * FASE 4 - SISTEMA DE RUTAS (Requisitos cumplidos):
 * ─────────────────────────────────────────────────
 * 4.1 - Rutas definidas: 7+ rutas principales con breadcrumbs
 * 4.2 - Navegación programática: Implementada en componentes
 * 4.3 - Lazy Loading: Módulos de productos y admin cargados bajo demanda
 * 4.4 - Guards: authGuard (CanActivate) y pendingChangesGuard (CanDeactivate)
 * 4.5 - Resolvers: productResolver precarga datos antes de entrar a la ruta
 * 4.6 - Breadcrumbs: data.breadcrumb en cada ruta para navegación contextual
 * 4.7 - Wildcard: Ruta ** para página 404 NotFound
 */
export const routes: Routes = [
  // ══════════════════════════════════════════════════════════════════
  // RUTAS PRINCIPALES (Carga Eager)
  // ══════════════════════════════════════════════════════════════════

  /**
   * Ruta raíz - Redirige a Home
   */
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },

  /**
   * Home - Página principal
   */
  {
    path: 'home',
    component: Home,
    data: { breadcrumb: 'Inicio' },
    title: 'EducaDino - Inicio'
  },

  {
    path: 'sugerencias',
    loadComponent: () =>
      import('./pages/sugerencias/sugerencias').then(m => m.Sugerencias),
    data: { breadcrumb: 'Sugerencias' },
    title: 'EducaDino - Sugerencias'
  },

  /**
   * About - Información sobre la aplicación
   * Cargado con Lazy Loading para demostrar la técnica
   */
  {
    path: 'about',
    loadComponent: () => import('./pages/about/about').then(m => m.About),
    data: { breadcrumb: 'Sobre Nosotros' },
    title: 'EducaDino - Sobre Nosotros'
  },

  /**
   * Contacto - Formulario de contacto
   */
  {
    path: 'contacto',
    component: Contact,
    data: { breadcrumb: 'Contacto' },
    title: 'EducaDino - Contacto'
  },

  /**
   * Curiosidades - Información educativa sobre dinosaurios
   */
  {
    path: 'curiosidades',
    component: Curiosities,
    data: { breadcrumb: 'Curiosidades' },
    title: 'EducaDino - Curiosidades'
  },

  /**
   * Órdenes de dinosaurios - Clasificación taxonómica
   */
  {
    path: 'ordenes',
    component: Orders,
    data: { breadcrumb: 'Órdenes' },
    title: 'EducaDino - Órdenes de Dinosaurios'
  },

  /**
   * Style Guide - Documentación de componentes
   */
  {
    path: 'style-guide',
    component: StyleGuide,
    data: { breadcrumb: 'Guía de Estilos' },
    title: 'EducaDino - Style Guide'
  },

  // ══════════════════════════════════════════════════════════════════
  // MÓDULO DE PRODUCTOS (Lazy Loading - Requisito 4.3)
  // ══════════════════════════════════════════════════════════════════

  {
    path: 'productos',
    data: { breadcrumb: 'Productos' },
    children: [
      /**
       * Lista de productos
       * Lazy Loading del componente
       */
      {
        path: '',
        loadComponent: () =>
          import('./pages/products/product-list/product-list').then(m => m.ProductList),
        data: { breadcrumb: '' }, // Sin breadcrumb adicional (ya está 'Productos')
        title: 'EducaDino - Productos'
      },

      /**
       * Crear nuevo producto
       * Protegido con pendingChangesGuard para evitar pérdida de datos
       */
      {
        path: 'nuevo',
        loadComponent: () =>
          import('./pages/products/product-form/product-form').then(m => m.ProductForm),
        canDeactivate: [pendingChangesGuard], // Requisito 4.4 - CanDeactivate Guard
        data: { breadcrumb: 'Nuevo Producto' },
        title: 'EducaDino - Nuevo Producto'
      },

      /**
       * Detalle de producto
       * Usa productResolver para precargar datos (Requisito 4.5)
       * El :id se sustituye dinámicamente en el breadcrumb
       */
      {
        path: ':id',
        loadComponent: () =>
          import('./pages/products/product-detail/product-detail').then(m => m.ProductDetail),
        resolve: { product: productResolver }, // Requisito 4.5 - Resolver
        data: { breadcrumb: 'Producto :id' },
        title: 'EducaDino - Detalle de Producto'
      }
    ]
  },

  // ══════════════════════════════════════════════════════════════════
  // MÓDULO DE ADMINISTRACIÓN (Rutas Anidadas - Lazy Loading)
  // ══════════════════════════════════════════════════════════════════

  {
    path: 'admin',
    canActivate: [authGuard], // Requisito 4.4 - CanActivate Guard
    data: { breadcrumb: 'Administración' },
    loadChildren: () =>
      import('./pages/admin/admin.routes').then(m => m.ADMIN_ROUTES)
  },

  // 5. Ruta Órdenes
  { path: 'ordenes', component: Orders },

  // 6. Ruta Minijuegos
  { path: 'minijuegos', component: Minigames },

  // 7. Ruta Style Guide (documentación de componentes)
  { path: 'style-guide', component: StyleGuide },
  // ══════════════════════════════════════════════════════════════════
  // AUTENTICACIÓN
  // ══════════════════════════════════════════════════════════════════

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/login/login').then(m => m.Login),
    data: { breadcrumb: 'Iniciar Sesión' },
    title: 'EducaDino - Login'
  },

  /**
   * Perfil - Página de perfil de usuario
   * Lazy Loading del componente
   */
  {
    path: 'perfil',
    loadComponent: () =>
      import('./pages/profile/profile').then(m => m.Profile),
    data: { breadcrumb: 'Perfil' },
    title: 'EducaDino - Perfil'
  },

  {
    path: 'feedback',
    loadComponent: () =>
      import('./pages/feedback-page/feedback-page').then(m => m.FeedbackPage),
    data: { breadcrumb: 'Feedback' },
    title: 'EducaDino - Feedback'
  },

  // ══════════════════════════════════════════════════════════════════
  // WILDCARD - Página 404 (Requisito 4.7)
  // ══════════════════════════════════════════════════════════════════

  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found').then(m => m.NotFound),
    data: { breadcrumb: 'Página no encontrada' },
    title: 'EducaDino - Página no encontrada'
  },
  // 7. Wildcard: cualquier ruta desconocida redirige a Style Guide
  { path: '**', redirectTo: 'style-guide' }
];
