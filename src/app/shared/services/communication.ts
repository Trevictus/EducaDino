import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

/**
 * Interfaz para las notificaciones de comunicación
 */
export interface CommunicationMessage {
  id: string;
  message: string;
  timestamp: Date;
  source?: string;
}

/**
 * TAREA 1: Servicio de Comunicación entre Componentes
 *
 * Implementa el patrón BehaviorSubject para comunicación reactiva
 * entre componentes hermanos o no relacionados jerárquicamente.
 *
 * Uso:
 * - Emisor: this.communicationService.sendNotification('Mensaje');
 * - Receptor: this.communicationService.notifications$.subscribe(msg => ...)
 */
@Injectable({
  providedIn: 'root'
})
export class CommunicationService {
  /**
   * BehaviorSubject privado - mantiene el último valor emitido
   * Inicializado con null para indicar "sin mensaje"
   */
  private readonly notificationsSubject = new BehaviorSubject<CommunicationMessage | null>(null);

  /**
   * Observable público para que los componentes se suscriban
   * Expone solo la capacidad de leer, no de emitir
   */
  readonly notifications$: Observable<CommunicationMessage | null> = this.notificationsSubject.asObservable();

  /**
   * Historial de mensajes (opcional, para debugging)
   */
  private messageHistory: CommunicationMessage[] = [];

  /**
   * Emite una nueva notificación a todos los suscriptores
   * @param message - Texto del mensaje
   * @param source - Componente origen (opcional, para debugging)
   */
  sendNotification(message: string, source?: string): void {
    const notification: CommunicationMessage = {
      id: this.generateId(),
      message,
      timestamp: new Date(),
      source
    };

    this.messageHistory.push(notification);
    this.notificationsSubject.next(notification);

    // Log para debugging
    console.log('[CommunicationService] Nueva notificación:', notification);
  }

  /**
   * Limpia la notificación actual (emite null)
   */
  clearNotification(): void {
    this.notificationsSubject.next(null);
  }

  /**
   * Obtiene el historial de mensajes
   */
  getHistory(): CommunicationMessage[] {
    return [...this.messageHistory];
  }

  /**
   * Genera un ID único para cada mensaje
   */
  private generateId(): string {
    return `msg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
  }
}
