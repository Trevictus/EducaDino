import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * AdminUsers - Gestión de usuarios.
 * Cargado con Lazy Loading.
 */
@Component({
  selector: 'app-admin-users',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="admin-users">
      <h1>👥 Gestión de Usuarios</h1>
      <p>Administra los usuarios registrados.</p>

      <table class="admin-users__table">
        <thead>
          <tr>
            <th>Usuario</th>
            <th>Email</th>
            <th>Rol</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>admin</td>
            <td>admin&#64;educadino.com</td>
            <td>Administrador</td>
          </tr>
          <tr>
            <td>usuario1</td>
            <td>usuario1&#64;email.com</td>
            <td>Usuario</td>
          </tr>
        </tbody>
      </table>
    </section>
  `,
  styles: [`
    .admin-users {
      padding: var(--spacing-4);
      max-width: 800px;
      margin: 0 auto;

      h1 {
        font-family: var(--font-secondary);
        font-size: var(--font-size-4xl);
        color: var(--primary-color);
      }

      &__table {
        width: 100%;
        margin-top: var(--spacing-3);
        border-collapse: collapse;
        font-family: var(--font-primary);

        th, td {
          padding: var(--spacing-2);
          text-align: left;
          border-bottom: 1px solid var(--gray-scale);
        }

        th {
          background-color: var(--primary-color);
          color: var(--text-color-light);
        }

        tr:hover {
          background-color: var(--background-color-hover);
        }
      }
    }
  `]
})
export class AdminUsers {}

