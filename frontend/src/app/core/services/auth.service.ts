import { Injectable, inject, signal, computed } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap, catchError, throwError } from 'rxjs';
import { ApiService } from './api.service';
import { environment } from '../../../environments/environment';

/**
 * Interfaces para autenticación
 */
export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  ageRange?: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
}

export interface AuthResponse {
  success: boolean;
  token: string;
  username: string;
  email: string;
  role: string;
  profileImage?: string;
  level: number;
  learningTime: number;
  completedMinigames: number;
  totalScore: number;
  message?: string;
}

export interface UserProfile {
  id: number;
  username: string;
  email: string;
  role: string;
  ageRange?: string;
  profileImage?: string;
  level: number;
  learningTime: number;
  completedMinigames: number;
  totalScore: number;
}

/**
 * AuthService - Servicio de Autenticación
 *
 * Gestiona el login, registro, logout y estado de autenticación.
 * Usa Angular Signals para reactividad.
 *
 * ═══════════════════════════════════════════════════════════════
 * ¿CÓMO FUNCIONA?
 * ═══════════════════════════════════════════════════════════════
 *
 * 1. LOGIN:
 *    - Usuario envía credenciales
 *    - Backend valida y devuelve un JWT token
 *    - El token se guarda en localStorage
 *    - El interceptor lo añade a cada petición
 *
 * 2. ESTADO:
 *    - isAuthenticated$ indica si hay un token válido
 *    - currentUser$ contiene los datos del usuario logueado
 *
 * 3. LOGOUT:
 *    - Elimina el token de localStorage
 *    - Limpia el estado del usuario
 *    - Redirige al login
 */
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  // ═══════════════════════════════════════════════════════════════
  // ESTADO REACTIVO CON SIGNALS
  // ═══════════════════════════════════════════════════════════════

  private readonly _currentUser = signal<UserProfile | null>(null);
  private readonly _isLoading = signal(false);

  /** Usuario actual (solo lectura) */
  readonly currentUser = this._currentUser.asReadonly();

  /** Estado de carga */
  readonly isLoading = this._isLoading.asReadonly();

  /** ¿Está autenticado? */
  readonly isAuthenticated = computed(() => !!this._currentUser());

  /** ¿Es admin? */
  readonly isAdmin = computed(() => this._currentUser()?.role === 'ADMIN');

  /** Nombre de usuario */
  readonly username = computed(() => this._currentUser()?.username ?? '');

  constructor() {
    // Intentar recuperar sesión al iniciar
    this.loadStoredUser();
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DE AUTENTICACIÓN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Inicia sesión con credenciales.
   */
  login(credentials: LoginRequest): Observable<AuthResponse> {
    this._isLoading.set(true);

    return this.api.post<AuthResponse>('/auth/login', credentials).pipe(
      tap((response) => {
        if (response.success && response.token) {
          // Guardar token
          localStorage.setItem(environment.tokenKey, response.token);

          // Guardar datos del usuario
          const user: UserProfile = {
            id: 0, // El backend debería devolver esto
            username: response.username,
            email: response.email,
            role: response.role,
            profileImage: response.profileImage,
            level: response.level,
            learningTime: response.learningTime,
            completedMinigames: response.completedMinigames,
            totalScore: response.totalScore,
          };

          localStorage.setItem('educadino_user', JSON.stringify(user));
          this._currentUser.set(user);

          console.log('[AuthService] Login exitoso:', user.username);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[AuthService] Error en login:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Registra un nuevo usuario.
   */
  register(data: RegisterRequest): Observable<AuthResponse> {
    this._isLoading.set(true);

    return this.api.post<AuthResponse>('/auth/register', data).pipe(
      tap((response) => {
        if (response.success && response.token) {
          // Auto-login después de registro
          localStorage.setItem(environment.tokenKey, response.token);

          const user: UserProfile = {
            id: 0,
            username: response.username,
            email: response.email,
            role: response.role,
            level: response.level,
            learningTime: response.learningTime,
            completedMinigames: response.completedMinigames,
            totalScore: response.totalScore,
          };

          localStorage.setItem('educadino_user', JSON.stringify(user));
          this._currentUser.set(user);

          console.log('[AuthService] Registro exitoso:', user.username);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[AuthService] Error en registro:', error);
        return throwError(() => error);
      })
    );
  }

  /**
   * Resetea la contraseña de un usuario.
   */
  resetPassword(data: ResetPasswordRequest): Observable<{ success: boolean; message: string }> {
    return this.api.post<{ success: boolean; message: string }>('/auth/reset-password', data);
  }

  /**
   * Cierra la sesión actual.
   */
  logout(): void {
    localStorage.removeItem(environment.tokenKey);
    localStorage.removeItem('educadino_user');
    this._currentUser.set(null);
    this.router.navigate(['/login']);
    console.log('[AuthService] Sesión cerrada');
  }

  /**
   * Obtiene el perfil del usuario desde el backend.
   */
  getProfile(): Observable<{ success: boolean; data: UserProfile }> {
    return this.api.get<{ success: boolean; data: UserProfile }>('/users/me').pipe(
      tap((response) => {
        if (response.success) {
          this._currentUser.set(response.data);
          localStorage.setItem('educadino_user', JSON.stringify(response.data));
        }
      })
    );
  }

  /**
   * Actualiza el perfil del usuario.
   */
  updateProfile(data: Partial<UserProfile>): Observable<{ success: boolean; data: UserProfile }> {
    return this.api.put<{ success: boolean; data: UserProfile }>('/users/me', data).pipe(
      tap((response) => {
        if (response.success) {
          this._currentUser.set(response.data);
          localStorage.setItem('educadino_user', JSON.stringify(response.data));
        }
      })
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS PRIVADOS
  // ═══════════════════════════════════════════════════════════════

  /**
   * Carga el usuario almacenado en localStorage.
   */
  private loadStoredUser(): void {
    const token = localStorage.getItem(environment.tokenKey);
    const storedUser = localStorage.getItem('educadino_user');

    if (token && storedUser) {
      try {
        const user = JSON.parse(storedUser) as UserProfile;
        this._currentUser.set(user);
        console.log('[AuthService] Sesión recuperada:', user.username);
      } catch {
        // Si hay error, limpiar datos corruptos
        this.logout();
      }
    }
  }

  /**
   * Verifica si el token JWT ha expirado.
   */
  isTokenExpired(): boolean {
    const token = localStorage.getItem(environment.tokenKey);
    if (!token) return true;

    try {
      // Decodificar el payload del JWT (segunda parte)
      const payload = JSON.parse(atob(token.split('.')[1]));
      const expiration = payload.exp * 1000; // Convertir a milisegundos
      return Date.now() >= expiration;
    } catch {
      return true;
    }
  }

  /**
   * Obtiene el token actual.
   */
  getToken(): string | null {
    return localStorage.getItem(environment.tokenKey);
  }
}
