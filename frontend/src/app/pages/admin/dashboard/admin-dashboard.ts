import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <section class="admin-dashboard">
      <h1>Panel de Administracion</h1>
      <p>Bienvenido al panel de administracion de EducaDino.</p>
      <div class="admin-dashboard__cards">
        <a routerLink="/admin/productos" class="admin-dashboard__card">
          <span>📦</span>
          <h3>Productos</h3>
          <p>Gestionar catalogo</p>
        </a>
        <a routerLink="/admin/usuarios" class="admin-dashboard__card">
          <span>👥</span>
          <h3>Usuarios</h3>
          <p>Gestionar usuarios</p>
        </a>
      </div>
    </section>
  `,
  styles: [`
    .admin-dashboard {
      padding: var(--spacing-4);
      max-width: 800px;
      margin: 0 auto;
      text-align: center;
    }
    .admin-dashboard h1 {
      font-family: var(--font-secondary);
      font-size: var(--font-size-4xl);
      color: var(--primary-color);
      margin-bottom: var(--spacing-2);
    }
    .admin-dashboard__cards {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: var(--spacing-3);
      margin-top: var(--spacing-4);
    }
    .admin-dashboard__card {
      background-color: var(--background-color-hover);
      border-radius: 16px;
      padding: var(--spacing-3);
      text-decoration: none;
      transition: transform 0.3s ease;
    }
    .admin-dashboard__card:hover {
      transform: translateY(-4px);
    }
    .admin-dashboard__card h3 {
      font-family: var(--font-secondary);
      color: var(--primary-color);
      margin: var(--spacing-1) 0;
    }
    .admin-dashboard__card span {
      font-size: 48px;
    }
  `]
})
export class AdminDashboard {}
