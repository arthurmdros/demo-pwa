import { CommonModule } from '@angular/common';
import { Component, HostListener, Input } from '@angular/core';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorIntl, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CustomPaginator } from '../../../services/custom-paginator-intl';
import { User } from '../../../user/domain/entities/user';
import { DeleteUserUseCase } from '../../application/use-cases/delete-user.usecase';
import { FetchUsersUseCase } from '../../application/use-cases/fetch-users.usecase';
import { GetCachedUsersUseCase } from '../../application/use-cases/get-cached-users.usecase';
import { UserFormDialogComponent } from './users-form.component';

// Use cases de usuário

@Component({
  selector: 'app-user-list-another',
  template: `
    <div class="toolbar">
      <button mat-icon-button color="primary" (click)="openUserDialog()">
        <mat-icon class="text-xlg cursor-pointer" style="color: var(--color-primary)">
          person_add
        </mat-icon>
      </button>
      <button mat-icon-button (click)="reloadUsers()">
        <mat-icon class="text-xlg cursor-pointer" style="color: var(--color-secondary)">
          refresh
        </mat-icon>
      </button>
    </div>

    <div *ngIf="syncing" class="loading-container">
      <span>Carregando usuários...</span>
      <mat-progress-spinner mode="indeterminate"></mat-progress-spinner>
    </div>

    <div *ngIf="!syncing">
      <div class="users-grid">
        <mat-card *ngFor="let user of pagedUsers" class="user-card">
          <mat-card-actions class="actions">
            <button mat-icon-button color="primary" (click)="openUserDialog(user)">
              <mat-icon class="text-xlg cursor-pointer" style="color: var(--color-primary)">
                edit
              </mat-icon>
            </button>
            <button mat-icon-button color="warn" (click)="deleteUser(user)">
              <mat-icon class="text-xlg text-red-400 cursor-pointer">delete</mat-icon>
            </button>
          </mat-card-actions>
          <mat-card-title>{{ user.name }}</mat-card-title>
          <mat-card-subtitle>{{ user.email }}</mat-card-subtitle>
        </mat-card>
      </div>

      <mat-paginator
        [length]="users.length"
        [pageSize]="pageSize"
        [pageSizeOptions]="[5, 10, 15]"
        (page)="onPageChange($event)"
      >
      </mat-paginator>
    </div>
  `,
  imports: [
    CommonModule,
    MatTooltipModule,
    MatListModule,
    MatIconModule,
    MatButtonModule,
    MatBadgeModule,
    MatCardModule,
    MatPaginatorModule,
    MatProgressSpinnerModule,
    MatMenuModule,
  ],
  providers: [{ provide: MatPaginatorIntl, useFactory: CustomPaginator }],
  styles: `
    .toolbar {
      display: flex;
      justify-content: end;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }

    .loading-container {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 12px;
      margin: 20px 0;
    }

    .users-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(auto, 1fr));
      gap: 16px;
    }

    .user-card {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 10px;
    }

    .actions {
      display: flex;
      justify-content: flex-end;
      gap: 8px;
    }

  `,
})
export class UserListComponent {
  @Input() offline = false;

  users: User[] = [];
  pagedUsers: User[] = [];
  pageSize = 5;
  currentPage = 0;
  syncing = false;

  constructor(
    public dialog: MatDialog,
    private fetchUsers: FetchUsersUseCase,
    private getCachedUsers: GetCachedUsersUseCase,
    private deleteUserUseCase: DeleteUserUseCase
  ) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  @HostListener('window:offline')
  async onOffline() {
    this.offline = true;
    await this.loadUsers();
  }

  @HostListener('window:online')
  async onOnline() {
    this.offline = false;
    await this.loadUsers();
  }

  private async loadUsers() {
    this.syncing = true;
    try {
      if (this.offline) {
        this.users = await this.getCachedUsers.execute();
      } else {
        this.users = await this.fetchUsers.execute();
      }
      this.updatePagedUsers();
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      this.users = await this.getCachedUsers.execute();
      this.updatePagedUsers();
    } finally {
      this.syncing = false;
    }
  }

  openUserDialog(user?: User) {
    const dialogRef = this.dialog.open(UserFormDialogComponent, {
      width: '400px',
      panelClass: ['position-relative'],
      data: { user },
    });

    dialogRef.afterClosed().subscribe(() => this.loadUsers());
  }

  async deleteUser(user: User) {
    if (!confirm(`Deseja remover o usuário ${user.name}?`)) return;
    try {
      await this.deleteUserUseCase.execute(user.id);
      await this.loadUsers();
    } catch (err) {
      console.error('Erro ao remover usuário:', err);
      alert('Erro ao remover usuário');
    }
  }

  reloadUsers() {
    this.loadUsers();
  }

  updatePagedUsers() {
    const start = this.currentPage * this.pageSize;
    this.pagedUsers = this.users.slice(start, start + this.pageSize);
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.currentPage = event.pageIndex;
    this.updatePagedUsers();
  }
}
