import { CommonModule } from '@angular/common';
import { HttpClientModule, provideHttpClient } from '@angular/common/http';
import { importProvidersFrom, NgModule, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserModule } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { AppComponent } from './app.component';
import { routes } from './app.routes';
import { OfflineComponent } from './components/offline.component';
import { ConnectionService } from './services/connection.service';
import { CustomPaginator } from './services/custom-paginator-intl';
import { NotificationService } from './services/notification.service';
import { DbOfflineService } from './services/offline-db.service';
import { RecoveryService } from './services/recovery.service';
import { ThemeService } from './services/theme.service';
import { UpdateService } from './services/update.service';
import { UserModule } from './user/user.module';

@NgModule({
  declarations: [AppComponent, OfflineComponent],
  imports: [
    BrowserModule,
    CommonModule,
    UserModule,
    MatTooltipModule,
    MatSidenavModule,
    MatToolbarModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  providers: [
    importProvidersFrom(HttpClientModule),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    ConnectionService,
    DbOfflineService,
    UpdateService,
    RecoveryService,
    ThemeService,
    NotificationService,
    { provide: MatPaginatorIntl, useFactory: CustomPaginator },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
