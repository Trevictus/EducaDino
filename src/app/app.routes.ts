import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { StyleGuide } from './pages/style-guide/style-guide';

export const routes: Routes = [
  // 1. Ruta raíz ('') redirige a Style Guide
  { path: '', redirectTo: 'style-guide', pathMatch: 'full' },

  // 2. Ruta Home (accesible desde el logotipo del header)
  { path: 'home', component: Home },

  // 3. Ruta Contacto
  { path: 'contacto', component: Contact },

  // 4. Ruta Style Guide (documentación de componentes)
  { path: 'style-guide', component: StyleGuide },

  // 5. Wildcard: cualquier ruta desconocida redirige a Style Guide
  { path: '**', redirectTo: 'style-guide' }
];
