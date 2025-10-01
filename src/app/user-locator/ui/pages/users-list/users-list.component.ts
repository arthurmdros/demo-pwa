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
import { CustomPaginator } from '../../../../services/custom-paginator-intl';
import { User } from '../../../../user/domain/entities/user';
import { UserFormDialogComponent } from '../../components/users-form/users-form.component';
import { DeleteUserUseCase } from '../../services/delete-user.usecase';
import { FetchUsersUseCase } from '../../services/fetch-users.usecase';
import { GetCachedUsersUseCase } from '../../services/get-cached-users.usecase';
import { GetUserByIdUseCase } from '../../services/get-user-by-id.usecase';

// Use cases de usuário

@Component({
  selector: 'app-user-list',
  templateUrl: './users-list.component.html',
  styleUrls: ['./users-list.component.css'],
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
    private deleteUserUseCase: DeleteUserUseCase,
    private getUserByIdUseCase: GetUserByIdUseCase
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
    // this.getUserByIdUseCase.execute(2).subscribe(vl => console.log(vl));
    // console.log(await this.getUserByIdUseCase.execute(2));
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
