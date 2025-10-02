import { inject, injectable } from 'tsyringe';
import { User } from '../../data/models/dto';
import { UserRepositoryImpl } from '../../data/repository-impl';
import { USER_REPOSITORY_IMPL } from '../../injection-tokens';

@injectable()
export class GetCachedUsersUseCase {
  constructor(@inject(USER_REPOSITORY_IMPL) private repo: UserRepositoryImpl) {}

  execute(): Promise<User[]> {
    return this.repo.getCachedUsers();
  }
}
