import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { User } from '../../../data/entities/user';
import { AddUserUseCase } from '../../services/add-user.usecase';
import { UpdateUserUseCase } from '../../services/update-user.usecase';

@Component({
  selector: 'app-user-form-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    MatSnackBarModule,
    MatInputModule,
  ],
  templateUrl: './users-form.component.html',
  styleUrls: ['./users-form.component.css'],
})
export class UserFormDialogComponent {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    private addUserUseCase: AddUserUseCase,
    private updateUserUseCase: UpdateUserUseCase,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    this.form = this.fb.group({
      name: [data?.user?.name || '', Validators.required],
      email: [data?.user?.email || '', [Validators.required, Validators.email]],
    });
  }

  async submit() {
    if (this.form.invalid) return;

    this.saving = true;
    const user: User = { ...this.data?.user, ...this.form.value };

    try {
      if (user.id) {
        await this.updateUserUseCase.execute(user);
        this.snack.open('Usuário atualizado!', 'Fechar', { duration: 2000 });
      } else {
        await this.addUserUseCase.execute(user);
        this.snack.open('Usuário criado!', 'Fechar', { duration: 2000 });
      }
      this.dialogRef.close(true); // envia true para indicar sucesso
    } catch (err) {
      console.error('Erro ao salvar usuário:', err);
      this.snack.open('Erro ao salvar usuário', 'Fechar', { duration: 3000 });
    } finally {
      this.saving = false;
    }
  }
}
