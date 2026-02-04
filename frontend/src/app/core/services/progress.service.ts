import { Injectable, inject, signal, computed } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Interfaces para progreso de usuario
 */
export interface SaveProgressRequest {
  minigameType: string;
  score: number;
  timePlayed: number;
  completed: boolean;
}

export interface UserProgress {
  id: number;
  userId: number;
  minigameType: string;
  score: number;
  timePlayed: number;
  completed: boolean;
  playedAt: string;
}

export interface ProgressStats {
  totalScore: number;
  totalTimePlayed: number;
  completedMinigames: number;
  level: number;
  learningTime: number;
  bestScores: Record<string, number>;
}

/**
 * ProgressService - Servicio de Progreso de Minijuegos
 *
 * Gestiona el registro y consulta del progreso del usuario
 * en los minijuegos de EducaDino.
 *
 * Se sincroniza con el backend y actualiza el perfil del usuario.
 */
@Injectable({
  providedIn: 'root',
})
export class ProgressService {
  private readonly api = inject(ApiService);

  // Estado reactivo
  private readonly _myProgress = signal<UserProgress[]>([]);
  private readonly _stats = signal<ProgressStats | null>(null);
  private readonly _isLoading = signal(false);

  /** Historial de progreso */
  readonly myProgress = this._myProgress.asReadonly();

  /** Estadísticas del usuario */
  readonly stats = this._stats.asReadonly();

  /** Estado de carga */
  readonly isLoading = this._isLoading.asReadonly();

  /** Puntuación total */
  readonly totalScore = computed(() => this._stats()?.totalScore ?? 0);

  /** Nivel actual */
  readonly level = computed(() => this._stats()?.level ?? 1);

  /** Minijuegos completados */
  readonly completedMinigames = computed(() => this._stats()?.completedMinigames ?? 0);

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DE PROGRESO
  // ═══════════════════════════════════════════════════════════════

  /**
   * Guarda el resultado de un minijuego.
   */
  saveProgress(data: SaveProgressRequest): Observable<{ success: boolean; data: UserProgress }> {
    this._isLoading.set(true);

    return this.api.post<{ success: boolean; data: UserProgress }>('/progress', data).pipe(
      tap((response) => {
        if (response.success) {
          // Añadir al historial local
          this._myProgress.update((progress) => [response.data, ...progress]);

          // Recargar estadísticas
          this.loadStats().subscribe();

          console.log('[ProgressService] Progreso guardado:', response.data);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[ProgressService] Error guardando progreso:', error);
        // Si falla, guardamos en localStorage como fallback
        this.saveLocalProgress(data);
        return of({ success: false, data: {} as UserProgress });
      })
    );
  }

  /**
   * Carga todo el historial de progreso del usuario.
   */
  loadMyProgress(): Observable<{ success: boolean; data: UserProgress[] }> {
    this._isLoading.set(true);

    return this.api.get<{ success: boolean; data: UserProgress[] }>('/progress').pipe(
      tap((response) => {
        if (response.success) {
          this._myProgress.set(response.data);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[ProgressService] Error cargando progreso:', error);
        return of({ success: false, data: [] });
      })
    );
  }

  /**
   * Carga las estadísticas resumidas del usuario.
   */
  loadStats(): Observable<{ success: boolean; data: ProgressStats }> {
    return this.api.get<{ success: boolean; data: ProgressStats }>('/progress/stats').pipe(
      tap((response) => {
        if (response.success) {
          this._stats.set(response.data);
          console.log('[ProgressService] Estadísticas cargadas:', response.data);
        }
      }),
      catchError((error) => {
        console.error('[ProgressService] Error cargando estadísticas:', error);
        return of({ success: false, data: {} as ProgressStats });
      })
    );
  }

  /**
   * Obtiene el progreso de un minijuego específico.
   */
  getProgressByMinigame(minigameType: string): Observable<{ success: boolean; data: UserProgress[] }> {
    return this.api.get<{ success: boolean; data: UserProgress[] }>(`/progress/minigame/${minigameType}`);
  }

  /**
   * Obtiene la mejor puntuación en un minijuego.
   */
  getBestScore(minigameType: string): number {
    const stats = this._stats();
    return stats?.bestScores?.[minigameType] ?? 0;
  }

  // ═══════════════════════════════════════════════════════════════
  // FALLBACK LOCAL (cuando no hay conexión)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Guarda progreso en localStorage como fallback.
   */
  private saveLocalProgress(data: SaveProgressRequest): void {
    const key = 'educadino_local_progress';
    const stored = localStorage.getItem(key);
    const localProgress: SaveProgressRequest[] = stored ? JSON.parse(stored) : [];

    localProgress.push({
      ...data,
    });

    localStorage.setItem(key, JSON.stringify(localProgress));
    console.log('[ProgressService] Progreso guardado localmente');
  }

  /**
   * Sincroniza el progreso local con el servidor.
   */
  syncLocalProgress(): void {
    const key = 'educadino_local_progress';
    const stored = localStorage.getItem(key);

    if (!stored) return;

    const localProgress: SaveProgressRequest[] = JSON.parse(stored);

    if (localProgress.length === 0) return;

    console.log('[ProgressService] Sincronizando progreso local...');

    // Enviar cada progreso pendiente
    localProgress.forEach((progress) => {
      this.api.post('/progress', progress).subscribe({
        next: () => console.log('[ProgressService] Sincronizado:', progress.minigameType),
        error: (err) => console.error('[ProgressService] Error sincronizando:', err),
      });
    });

    // Limpiar localStorage
    localStorage.removeItem(key);
  }
}
