import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';

/**
 * LoginComponent - Página de inicio de sesión.
 *
 * Simula un sistema de login básico.
 * Demuestra cómo recuperar el returnUrl de los queryParams.
 */
@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login implements OnInit {
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  username = '';
  password = '';
  errorMessage = '';
  returnUrl = '/home';

  ngOnInit(): void {
    // Obtener la URL de retorno desde queryParams
    this.route.queryParams.subscribe(params => {
      this.returnUrl = params['returnUrl'] || '/home';
    });
  }

  onSubmit(): void {
    // Simulación de validación de login
    if (this.username === 'admin' && this.password === 'admin') {
      // Login exitoso - redirigir a returnUrl
      this.router.navigate([this.returnUrl]);
    } else {
      this.errorMessage = 'Usuario o contraseña incorrectos. Prueba con admin/admin';
    }
  }
}
