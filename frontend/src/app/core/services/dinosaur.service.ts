import { Injectable, inject, signal } from '@angular/core';
import { Observable, tap, catchError, of } from 'rxjs';
import { ApiService } from './api.service';

/**
 * Interface para Dinosaurio
 */
export interface Dinosaur {
  id: number;
  name: string;
  description: string;
  diet: string;
  period: string;
  taxonomy: string;
  family: string;
  imageUrl: string;
  size: string;
  location: string;
  curiosities: string;
  createdAt: string;
}

export interface DinosaurRequest {
  name: string;
  description?: string;
  diet?: string;
  period?: string;
  taxonomy?: string;
  family?: string;
  imageUrl?: string;
  size?: string;
  location?: string;
  curiosities?: string;
}

/**
 * DinosaurService - Servicio de Dinosaurios
 *
 * Gestiona la información educativa sobre dinosaurios.
 */
@Injectable({
  providedIn: 'root',
})
export class DinosaurService {
  private readonly api = inject(ApiService);

  // Estado reactivo
  private readonly _dinosaurs = signal<Dinosaur[]>([]);
  private readonly _isLoading = signal(false);

  /** Lista de dinosaurios */
  readonly dinosaurs = this._dinosaurs.asReadonly();

  /** Estado de carga */
  readonly isLoading = this._isLoading.asReadonly();

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DE CONSULTA (públicos)
  // ═══════════════════════════════════════════════════════════════

  /**
   * Carga todos los dinosaurios.
   */
  loadAll(): Observable<{ success: boolean; data: Dinosaur[] }> {
    this._isLoading.set(true);

    return this.api.get<{ success: boolean; data: Dinosaur[] }>('/dinosaurs').pipe(
      tap((response) => {
        if (response.success) {
          this._dinosaurs.set(response.data);
        }
        this._isLoading.set(false);
      }),
      catchError((error) => {
        this._isLoading.set(false);
        console.error('[DinosaurService] Error cargando dinosaurios:', error);
        return of({ success: false, data: [] });
      })
    );
  }

  /**
   * Obtiene un dinosaurio por ID.
   */
  getById(id: number): Observable<{ success: boolean; data: Dinosaur }> {
    return this.api.get<{ success: boolean; data: Dinosaur }>(`/dinosaurs/${id}`);
  }

  /**
   * Busca dinosaurios por nombre.
   */
  searchByName(name: string): Observable<{ success: boolean; data: Dinosaur[] }> {
    return this.api.get<{ success: boolean; data: Dinosaur[] }>(`/dinosaurs/search?name=${name}`);
  }

  /**
   * Filtra dinosaurios por dieta.
   */
  getByDiet(diet: string): Observable<{ success: boolean; data: Dinosaur[] }> {
    return this.api.get<{ success: boolean; data: Dinosaur[] }>(`/dinosaurs/diet/${diet}`);
  }

  /**
   * Filtra dinosaurios por período.
   */
  getByPeriod(period: string): Observable<{ success: boolean; data: Dinosaur[] }> {
    return this.api.get<{ success: boolean; data: Dinosaur[] }>(`/dinosaurs/period/${period}`);
  }

  // ═══════════════════════════════════════════════════════════════
  // MÉTODOS DE ADMIN
  // ═══════════════════════════════════════════════════════════════

  /**
   * Crea un nuevo dinosaurio (solo admin).
   */
  create(data: DinosaurRequest): Observable<{ success: boolean; data: Dinosaur }> {
    return this.api.post<{ success: boolean; data: Dinosaur }>('/dinosaurs', data).pipe(
      tap((response) => {
        if (response.success) {
          this._dinosaurs.update((dinos) => [...dinos, response.data]);
        }
      })
    );
  }

  /**
   * Actualiza un dinosaurio (solo admin).
   */
  update(id: number, data: DinosaurRequest): Observable<{ success: boolean; data: Dinosaur }> {
    return this.api.put<{ success: boolean; data: Dinosaur }>(`/dinosaurs/${id}`, data).pipe(
      tap((response) => {
        if (response.success) {
          this._dinosaurs.update((dinos) =>
            dinos.map((d) => (d.id === id ? response.data : d))
          );
        }
      })
    );
  }

  /**
   * Elimina un dinosaurio (solo admin).
   */
  delete(id: number): Observable<{ success: boolean }> {
    return this.api.delete<{ success: boolean }>(`/dinosaurs/${id}`).pipe(
      tap((response) => {
        if (response.success) {
          this._dinosaurs.update((dinos) => dinos.filter((d) => d.id !== id));
        }
      })
    );
  }

  // ═══════════════════════════════════════════════════════════════
  // UTILIDADES
  // ═══════════════════════════════════════════════════════════════

  /**
   * Obtiene los tipos de dieta disponibles.
   */
  getDietTypes(): string[] {
    return ['Carnívoro', 'Herbívoro', 'Omnívoro'];
  }

  /**
   * Obtiene los períodos geológicos.
   */
  getPeriods(): string[] {
    return ['Triásico', 'Jurásico', 'Cretácico', 'Triásico Superior', 'Jurásico Superior', 'Cretácico Superior'];
  }

  /**
   * Obtiene los tamaños posibles.
   */
  getSizes(): string[] {
    return ['Pequeño', 'Mediano', 'Grande', 'Gigante'];
  }
}
