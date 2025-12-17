import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

// 1. IMPORTAR LOS COMPONENTES
import { Header } from './components/layout/header/header';
import { Main } from './components/layout/main/main';
import { Footer } from './components/layout/footer/footer';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Main, Footer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  title = 'EducaDino';
}
