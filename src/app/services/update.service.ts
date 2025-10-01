import { HttpClient } from '@angular/common/http';
import { Injectable, isDevMode } from '@angular/core';
import { BehaviorSubject, catchError, interval, of } from 'rxjs';
import { environment as envDev } from '../../environments/environment';
import { environment as envProd } from '../../environments/environment.prod';

const LOCAL_VERSION_KEY = 'app_current_version';
const VERSION_JSON_PATH = '/assets/version.json';
const POLLING_INTERVAL = 5 * 60 * 1000; // 5 minutos
// const POLLING_INTERVAL = 15000; // 15 seg

@Injectable({ providedIn: 'root' })
export class UpdateService {
  currentVersion: string;
  latestVersion: string;
  updateAvailable$ = new BehaviorSubject<boolean>(false);

  constructor(private http: HttpClient) {
    // Inicializa versão atual do localStorage ou assume versão inicial
    this.currentVersion =
      localStorage.getItem(LOCAL_VERSION_KEY) || (isDevMode() ? envDev.version : envProd.version);
    this.latestVersion = this.currentVersion;

    // Checagem inicial
    this.checkVersion();

    // Polling periódico para detectar novas versões
    interval(POLLING_INTERVAL).subscribe(() => this.checkVersion());
  }

  private checkVersion() {
    this.http
      .get<{ version: string }>(VERSION_JSON_PATH)
      .pipe(catchError(() => of({ version: this.currentVersion })))
      .subscribe((res) => {
        const serverVersion = res.version;
        if (serverVersion !== this.currentVersion) {
          this.latestVersion = serverVersion;
          this.updateAvailable$.next(true);
        } else {
          this.updateAvailable$.next(false);
        }
      });
  }

  applyUpdate() {
    // Atualiza localStorage para a nova versão
    this.currentVersion = this.latestVersion;
    localStorage.setItem(LOCAL_VERSION_KEY, this.currentVersion);

    // Força reload da aplicação
    document.location.reload();
  }
}
