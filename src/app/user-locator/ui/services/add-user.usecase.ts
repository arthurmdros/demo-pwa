import { Inject, Injectable } from '@angular/core';
import { User } from '../../data/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../injection-tokens';

@Injectable()
export class AddUserUseCase {
  constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}

  execute(user: User): Promise<void> {
    return this.repo.addUser(user);
  }
}
