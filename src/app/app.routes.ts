import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { StyleGuide } from './pages/style-guide/style-guide';
import { Curiosities } from './pages/curiosities/curiosities';
import { Orders } from './pages/orders/orders';
import { Minigames } from './pages/minigames/minigames';

export const routes: Routes = [
  // 1. Ruta raíz ('') redirige a Style Guide
  { path: '', redirectTo: 'style-guide', pathMatch: 'full' },

  // 2. Ruta Home (accesible desde el logotipo del header)
  { path: 'home', component: Home },

  // 3. Ruta Contacto
  { path: 'contacto', component: Contact },

  // 4. Ruta Curiosidades
  { path: 'curiosidades', component: Curiosities },

  // 5. Ruta Órdenes
  { path: 'ordenes', component: Orders },

  // 6. Ruta Minijuegos
  { path: 'minijuegos', component: Minigames },

  // 7. Ruta Style Guide (documentación de componentes)
  { path: 'style-guide', component: StyleGuide },

  // 7. Wildcard: cualquier ruta desconocida redirige a Style Guide
  { path: '**', redirectTo: 'style-guide' }
];
