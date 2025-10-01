import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { AddUserUseCase } from '../../application/use-cases/add-user.usecase';
import { UpdateUserUseCase } from '../../application/use-cases/update-user.usecase';
import { User } from '../../domain/entities/user';

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
  template: `
    <h2 mat-dialog-title>{{ data.user ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
    <form [formGroup]="form" (ngSubmit)="submit()">
      <mat-form-field appearance="fill">
        <mat-label>Nome</mat-label>
        <input matInput formControlName="name" required />
      </mat-form-field>

      <mat-form-field appearance="fill">
        <mat-label>Email</mat-label>
        <input matInput formControlName="email" required type="email" />
      </mat-form-field>

      <div class="actions">
        <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || saving">
          {{ saving ? 'Salvando...' : 'Salvar' }}
        </button>
        <button mat-button type="button" (click)="dialogRef.close()">Cancelar</button>
      </div>
    </form>
  `,
  styles: [
    `
      form {
        display: flex;
        flex-direction: column;
        gap: 16px;
        width: 100%;
      }
      .actions {
        display: flex;
        justify-content: flex-end;
        gap: 8px;
        margin-top: 12px;
      }
    `,
  ],
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
