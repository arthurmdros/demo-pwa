import { inject, injectable } from 'tsyringe';
import { User } from '../../data/models/dto';
import { UserRepositoryImpl } from '../../data/repository-impl';
import { USER_REPOSITORY_IMPL } from '../../injection-tokens';

@injectable()
export class UpdateUserUseCase {
  constructor(@inject(USER_REPOSITORY_IMPL) private repo: UserRepositoryImpl) {}

  execute(user: User): Promise<void> {
    return this.repo.updateUser(user);
  }
}
