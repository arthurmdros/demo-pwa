import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { User } from '../../../data/models/dto';
import { UserViewModel } from '../../user_view_model';
import { UserFormDialogComponent } from '../form/form.component';

// Use cases de usuário

@Component({
  standalone: false,
  selector: 'app-user-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css'],
})
export class UserListComponent implements OnChanges {
  @Input() online = false;

  users: User[] = [];
  pagedUsers: User[] = [];
  pageSize = 5;
  currentPage = 0;
  syncing = false;

  constructor(public dialog: MatDialog, private userViewModel: UserViewModel) {}

  async ngOnInit() {
    await this.loadUsers();
  }

  async ngOnChanges(changes: SimpleChanges) {
    if (changes['online'].currentValue) {
      await this.loadUsers();
    }
  }

  private async loadUsers() {
    // this.getUserByIdUseCase.execute(2).subscribe(vl => console.log(vl));
    // console.log(await this.getUserByIdUseCase.execute(2));
    this.syncing = true;
    try {
      if (!this.online) {
        this.users = await this.userViewModel.getCachedUsers();
      } else {
        this.users = await this.userViewModel.fetchUsers();
      }
      this.updatePagedUsers();
    } catch (err) {
      console.error('Erro ao carregar usuários:', err);
      this.users = await this.userViewModel.getCachedUsers();
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
      await this.userViewModel.deleteUserUseCase.execute(user.id);
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
