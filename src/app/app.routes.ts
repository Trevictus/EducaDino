import { Routes } from '@angular/router';
import { Home } from './pages/home/home';
import { Contact } from './pages/contact/contact';
import { StyleGuide } from './pages/style-guide/style-guide';

export const routes: Routes = [
  // 1. Ruta raíz ('') carga Home
  { path: '', component: Home },

  // 2. Ruta explícita '/home' (opcional, buena práctica)
  { path: 'home', redirectTo: '', pathMatch: 'full' },

  // 3. Ruta Contacto
  { path: 'contacto', component: Contact },

  // 4. Ruta Style Guide (documentación de componentes)
  { path: 'style-guide', component: StyleGuide },

  // 5. Wildcard: cualquier ruta desconocida redirige a Home
  { path: '**', redirectTo: '' }
];
