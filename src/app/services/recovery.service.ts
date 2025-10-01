import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class RecoveryService {
  private maxRetries = 3;
  private retries = 0;

  constructor() {
    window.addEventListener('error', (event) => this.handleError(event.error));
    window.addEventListener('unhandledrejection', (event) => this.handleError(event.reason));

    // Storage check inicial
    try {
      localStorage.setItem('__test__', '1');
      localStorage.removeItem('__test__');
    } catch {
      this.recover('Falha de storage inicial');
    }
  }

  private handleError(error: any) {
    console.error('Erro crítico detectado:', error);
    this.recover(error?.message || 'Erro global');
  }

  private recover(message?: string) {
    if (this.retries >= this.maxRetries) return;
    this.retries++;

    // Limpa storage
    localStorage.clear();
    sessionStorage.clear();

    // Remove SW
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker
        .getRegistrations()
        .then((regs) => regs.forEach((reg) => reg.unregister()));
    }

    // Força reload
    setTimeout(() => document.location.reload(), 500);
  }

  // 🔹 Função pública para testes
  public triggerRecovery(message?: string) {
    this.recover(message || 'Recuperação manual');
  }
}
