import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  // Emite somente quando o status realmente muda
  public online$ = new BehaviorSubject<boolean>(navigator.onLine);

  private backoffInterval = 2000; // começa com 2s
  private maxBackoff = 60000; // máximo de 1 minuto
  private reconnectTimeout: any;

  constructor(private ngZone: NgZone) {
    // Eventos nativos do navegador
    window.addEventListener('online', () => this.updateStatus(true));
    window.addEventListener('offline', () => this.updateStatus(false));

    // Se iniciou offline, começa tentativa de reconexão
    if (!navigator.onLine) this.scheduleReconnect();

    // Opcional: Distinct para evitar emissões repetidas
    this.online$ = new BehaviorSubject<boolean>(navigator.onLine).pipe(
      distinctUntilChanged()
    ) as BehaviorSubject<boolean>;
  }

  private updateStatus(status: boolean) {
    this.ngZone.run(() => {
      if (this.online$.value !== status) {
        this.online$.next(status);
      }
    });

    if (!status) this.scheduleReconnect();
    else this.clearReconnect();
  }

  private scheduleReconnect() {
    if (this.reconnectTimeout) return;

    this.reconnectTimeout = setTimeout(async () => {
      const online = await this.isOnline();
      this.updateStatus(online);

      if (!online) {
        // backoff exponencial
        this.backoffInterval = Math.min(this.backoffInterval * 2, this.maxBackoff);
        this.reconnectTimeout = null; // limpa para novo agendamento
        this.scheduleReconnect();
      }
    }, this.backoffInterval);
  }

  private clearReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }
    this.backoffInterval = 2000; // reseta para valor inicial
  }

  // Checagem real de conexão
  public async isOnline(): Promise<boolean> {
    if (!navigator.onLine) return false;

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const response = await fetch('https://demo-pwa-server-production.up.railway.app/', {
        method: 'GET',
        cache: 'no-cache',
        signal: controller.signal,
      });

      clearTimeout(timeout);
      return response.ok;
    } catch {
      return false;
    }
  }

  // Permite checagem manual, ex.: ao tentar enviar dados
  public async checkOnline(): Promise<boolean> {
    const online = await this.isOnline();
    this.updateStatus(online);
    return online;
  }
}
