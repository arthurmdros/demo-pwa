import { Inject, Injectable } from '@angular/core';
import { User } from '../../data/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../injection-tokens';

@Injectable()
export class GetCachedUsersUseCase {
  constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}

  execute(): Promise<User[]> {
    return this.repo.getCachedUsers();
  }
}
