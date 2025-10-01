import { Inject, Injectable } from '@angular/core';
import { UserRepository } from '../../domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../injection-tokens';

@Injectable()
export class DeleteUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}

  execute(id: number): Promise<void> {
    return this.repo.deleteUser(id);
  }
}
