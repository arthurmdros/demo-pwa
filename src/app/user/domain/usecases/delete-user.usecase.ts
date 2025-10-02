import { inject, injectable } from 'tsyringe';
import { UserRepositoryImpl } from '../../data/repository-impl';
import { USER_REPOSITORY_IMPL } from '../../injection-tokens';

@injectable()
export class DeleteUserUseCase {
  constructor(@inject(USER_REPOSITORY_IMPL) private repo: UserRepositoryImpl) {}

  execute(id: number): Promise<void> {
    return this.repo.deleteUser(id);
  }
}
