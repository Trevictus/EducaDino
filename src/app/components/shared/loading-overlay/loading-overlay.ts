import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoadingService } from '../../../shared/services/loading';

/**
 * TAREA 4: Componente Loading Overlay
 *
 * Muestra un overlay con spinner cuando hay operaciones asíncronas activas.
 * Se integra en app.component.html para funcionar globalmente.
 */
@Component({
  selector: 'app-loading-overlay',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './loading-overlay.html',
  styleUrl: './loading-overlay.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LoadingOverlay {
  /**
   * Inyección del servicio de loading
   */
  private readonly loadingService = inject(LoadingService);

  /**
   * Signal de loading para reactividad en template
   */
  readonly isLoading = this.loadingService.isLoading;

  /**
   * Signal con número de peticiones activas (debugging)
   */
  readonly activeRequests = this.loadingService.activeRequests;
}
