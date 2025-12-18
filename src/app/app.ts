import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. IMPORTAR LOS COMPONENTES DE LAYOUT
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';

// 2. IMPORTAR COMPONENTES GLOBALES (FASE 2)
import { ToastComponent } from './components/shared/toast/toast';
import { LoadingOverlay } from './components/shared/loading-overlay/loading-overlay';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    Header,
    Main,
    Footer,
    ToastComponent,
    LoadingOverlay
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'EducaDino';
}
