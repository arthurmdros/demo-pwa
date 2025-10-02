import { Observable } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { UserRepository } from '../domain/repository';
import { USER_REMOTE_DATA_SOURCE_IMPL } from '../injection-tokens';
import { User } from './models/dto';
import { UserRemoteDataSourceImpl } from './remote/remote_data_source_impl';

@injectable()
export class UserRepositoryImpl implements UserRepository {
  constructor(
    @inject(USER_REMOTE_DATA_SOURCE_IMPL) private userRemoteDataSource: UserRemoteDataSourceImpl
  ) {}

  fetchUsers(): Promise<User[]> {
    return this.userRemoteDataSource.fetchUsers();
  }

  getCachedUsers(): Promise<User[]> {
    return this.userRemoteDataSource.getCachedUsers();
  }

  getUserById(id: number): Observable<User> {
    throw new Error('Method not implemented.');
  }

  addUser(user: User): Promise<void> {
    return this.userRemoteDataSource.addUser(user);
  }

  updateUser(user: User): Promise<void> {
    return this.userRemoteDataSource.updateUser(user);
  }

  deleteUser(id: number): Promise<void> {
    return this.userRemoteDataSource.deleteUser(id);
  }
}
