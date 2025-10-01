import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications$ = new BehaviorSubject<NotificationItem[]>([]);
  connectionStatus$ = new BehaviorSubject<ConnectionStatus>('connecting');

  private eventSource?: EventSource;

  constructor(private zone: NgZone) {
    this.connect();
  }

  private connect() {
    this.eventSource = new EventSource('http://localhost:3000/notifications');

    // quando a conexão abre
    this.eventSource.onopen = () => {
      this.zone.run(() => this.connectionStatus$.next('connected'));
    };

    // eventos de mensagem da fila
    this.eventSource.addEventListener('message', (event: MessageEvent) => {
      this.zone.run(() => {
        const current = this.notifications$.value;
        const newNotification: NotificationItem = {
          id: crypto.randomUUID(),
          message: event.data,
          read: false,
          timestamp: new Date(),
        };
        this.notifications$.next([...current, newNotification]);
      });
    });

    // eventos de status enviados pelo backend (connected/disconnected/error)
    this.eventSource.addEventListener('status', (event: MessageEvent) => {
      this.zone.run(() => {
        try {
          const status = JSON.parse(event.data);
          if (status === 'connected') {
            this.connectionStatus$.next('connected');
          } else if (status === 'disconnected') {
            this.connectionStatus$.next('disconnected');
          } else if (status === 'error') {
            this.connectionStatus$.next('error');
          }
        } catch {
          this.connectionStatus$.next('error');
        }
      });
    });

    // erro genérico na conexão SSE
    this.eventSource.onerror = () => {
      this.zone.run(() => this.connectionStatus$.next('disconnected'));
      this.eventSource?.close();
      setTimeout(() => this.connect(), 5000); // tenta reconectar
    };
  }

  markAsRead(id: string) {
    const updated = this.notifications$.value.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    this.notifications$.next(updated);
  }

  removeNotification(id: string) {
    const updated = this.notifications$.value.filter((n) => n.id !== id);
    this.notifications$.next(updated);
  }

  clearAll() {
    this.notifications$.next([]);
  }
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
