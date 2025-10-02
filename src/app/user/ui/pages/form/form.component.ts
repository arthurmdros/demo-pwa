import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { User } from '../../../data/models/dto';
import { UserViewModel } from '../../user_view_model';

@Component({
  standalone: false,
  selector: 'app-user-form-dialog',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css'],
})
export class UserFormDialogComponent {
  form: FormGroup;
  saving = false;

  constructor(
    private fb: FormBuilder,
    private snack: MatSnackBar,
    public dialogRef: MatDialogRef<UserFormDialogComponent>,
    private userViewModel: UserViewModel,
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
        await this.userViewModel.updateUserUseCase.execute(user);
        this.snack.open('Usuário atualizado!', 'Fechar', { duration: 2000 });
      } else {
        await this.userViewModel.addUserUseCase.execute(user);
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
