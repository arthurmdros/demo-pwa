import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatBadgeModule } from '@angular/material/badge';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { container } from 'tsyringe';
import { UserFormDialogComponent } from './ui/pages/form/form.component';
import { UserListComponent } from './ui/pages/list/list.component';
import { UserViewModel } from './ui/user_view_model';

@NgModule({
  declarations: [UserFormDialogComponent, UserListComponent],
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
    ReactiveFormsModule,
    MatDialogModule,
    MatSnackBarModule,
    MatInputModule,
  ],
  exports: [UserListComponent, UserFormDialogComponent],
  providers: [
    {
      provide: UserViewModel,
      useFactory: () => container.resolve(UserViewModel),
    }
  ],
  bootstrap: [],
})
export class UserModule {}
