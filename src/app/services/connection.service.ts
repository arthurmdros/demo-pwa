import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ConnectionService {
  public online$ = new BehaviorSubject<boolean>(navigator.onLine);

  private checkRetries = 3; // nº de tentativas
  private checkDelay = 2000; // intervalo entre tentativas
  private checking = false;

  constructor(private ngZone: NgZone) {
    // Eventos do navegador
    window.addEventListener('online', () => this.handleStatusChange(true));
    window.addEventListener('offline', () => this.handleStatusChange(false));

    // Estado inicial
    this.handleStatusChange(navigator.onLine);
  }

  // Sempre que o navegador mudar status
  private async handleStatusChange(browserStatus: boolean) {
    if (!this.checking) {
      this.checking = true;
      await this.checkInternetMultiple(browserStatus);
      this.checking = false;
    }
  }

  // Faz até N verificações reais
  private async checkInternetMultiple(expected: boolean) {
    let lastResult = expected;

    for (let i = 0; i < this.checkRetries; i++) {
      const result = await this.isOnline();
      lastResult = result;

      if (result === expected) {
        // confirma o status esperado
        this.updateStatus(result);
        return;
      }

      // espera antes de tentar de novo
      await this.delay(this.checkDelay);
    }

    // se mesmo após 3 tentativas não confirmou, assume último resultado
    this.updateStatus(lastResult);
  }

  private updateStatus(status: boolean) {
    this.ngZone.run(() => this.online$.next(status));
  }

  // Testa conectividade real
  private async isOnline(): Promise<boolean> {
    // if (!navigator.onLine) return false;

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

  private delay(ms: number) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
