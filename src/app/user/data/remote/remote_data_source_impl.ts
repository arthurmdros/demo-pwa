import { Observable } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { USER_API } from '../../injection-tokens';
import { UserRemoteDataSource } from '../data_source';
import { User } from '../models/dto';
import { UserApi } from './api';

@injectable()
export class UserRemoteDataSourceImpl implements UserRemoteDataSource {
  constructor(@inject(USER_API) private api: UserApi) {}

  fetchUsers(): Promise<User[]> {
    return this.api.fetchUsers();
  }

  getCachedUsers(): Promise<User[]> {
    return this.api.getCachedUsers();
  }

  getUserById(id: number): Observable<User> {
    return this.api.getUserById(id);
  }

  addUser(user: User): Promise<void> {
    return this.api.addUser(user);
  }

  updateUser(user: User): Promise<void> {
    return this.api.updateUser(user);
  }

  deleteUser(id: number): Promise<void> {
    return this.api.deleteUser(id);
  }
}
