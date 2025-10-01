import { Inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../data/entities/user';
import { UserRepository } from '../../domain/repositories/user-repository';
import { USER_REPOSITORY } from '../../injection-tokens';

@Injectable()
export class GetUserByIdUseCase {
  constructor(@Inject(USER_REPOSITORY) private repo: UserRepository) {}

  execute(id: number): Observable<User> {
    return this.repo.getUserById(id);
  }
}
