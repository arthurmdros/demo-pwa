import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { map, Observable, Subscription } from 'rxjs';
import { ConnectionService } from './services/connection.service';
import {
  ConnectionStatus,
  NotificationItem,
  NotificationService,
} from './services/notification.service';
import { RecoveryService } from './services/recovery.service';
import { ThemeService } from './services/theme.service';
import { UpdateService } from './services/update.service';

interface RecoveryTestLog {
  scenario: string;
  status: 'pendente' | 'detectado' | 'recuperado';
  message?: string;
}

@Component({
  standalone: false,
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit, OnDestroy{
  logs: RecoveryTestLog[] = [];
  updateAvailable = false;
  countdown = 10;
  online = true;
  private onlineStatus!: Subscription;

  // Versões
  currentVersion: string;
  latestVersion: string;
  private intervalId: any;

  // Notificações
  unreadCount$: Observable<number>;
  notifications$: Observable<NotificationItem[]>;
  status$: Observable<ConnectionStatus>;

  constructor(
    public dialog: MatDialog,
    protected connectionService: ConnectionService,
    protected update: UpdateService,
    protected recovery: RecoveryService,
    protected notificationService: NotificationService,
    protected themeService: ThemeService
  ) {
    this.currentVersion = this.update.currentVersion;
    this.latestVersion = this.update.latestVersion;

    this.unreadCount$ = this.notificationService.notifications$.pipe(
      map((notifs) => notifs.filter((n) => !n.read).length)
    );
    this.notifications$ = this.notificationService.notifications$;
    this.status$ = this.notificationService.connectionStatus$;

    this.update.updateAvailable$.subscribe((avail) => {
      this.updateAvailable = avail;
      this.latestVersion = this.update.latestVersion;
      avail ? this.startCountdown() : this.clearCountdown();
    });
  }

  ngOnInit() {
    this.onlineStatus = this.connectionService.online$.subscribe((status) => {
      this.online = status;
    });
  }

  ngOnDestroy() {
    this.onlineStatus.unsubscribe();
  }

  // ------------------ UPDATE HANDLING ------------------
  reload() {
    this.update.applyUpdate();
  }

  private startCountdown() {
    this.countdown = 10;
    this.intervalId = setInterval(() => {
      this.countdown--;
      if (this.countdown <= 0) {
        this.clearCountdown();
        this.reload();
      }
    }, 1000);
  }

  private clearCountdown() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  // ------------------ RECOVERY TEST ------------------
  testRecovery() {
    this.logs = [
      { scenario: 'Erro JS global', status: 'pendente' },
      { scenario: 'Promise rejeitada', status: 'pendente' },
      { scenario: 'Falha de storage', status: 'pendente' },
      { scenario: 'Service Worker corrompido', status: 'pendente' },
      { scenario: 'Fetch crítico', status: 'pendente' },
    ];
    setTimeout(() => {
      this.updateLog('Erro JS global', 'detectado', 'Erro JS lançado intencionalmente');
      throw new Error('Erro JS global simulado');
    }, 500);
    setTimeout(() => {
      this.updateLog('Promise rejeitada', 'detectado', 'Promise rejeitada simulada');
      Promise.reject('Promise rejeitada simulada');
    }, 1000);
    setTimeout(() => {
      this.updateLog('Falha de storage', 'detectado', 'Recuperação manual acionada');
      this.recovery.triggerRecovery('Teste de falha de storage/SW');
    }, 1500);
    setTimeout(() => {
      this.updateLog('Service Worker corrompido', 'detectado', 'SW desregistrado intencionalmente');
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker
          .getRegistrations()
          .then((regs) => regs.forEach((reg) => reg.unregister()));
      }
    }, 2000);
    setTimeout(() => {
      this.updateLog('Fetch crítico', 'detectado', 'Fetch simulado falhou');
      fetch('/url-que-nao-existe').catch(() => {});
    }, 2500);
  }

  private updateLog(
    scenario: string,
    status: 'pendente' | 'detectado' | 'recuperado',
    message?: string
  ) {
    const log = this.logs.find((l) => l.scenario === scenario);
    if (log) {
      log.status = status;
      log.message = message;
    }
  }

  // ------------------ NOTIFICAÇÕES ------------------
  markAsRead(id: string) {
    this.notificationService.markAsRead(id);
  }
  removeNotification(id: string) {
    this.notificationService.removeNotification(id);
  }
  clearAll() {
    this.notificationService.clearAll();
  }

  // --------------------- TEMA -----------------------
  toggleTheme(theme: 'light' | 'dark' | 'system') {
    this.themeService.setTheme(theme);
  }

  currentTheme() {
    return this.themeService.getTheme();
  }
}
