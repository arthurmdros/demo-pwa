import { Observable } from 'rxjs';
import { inject, injectable } from 'tsyringe';
import { User } from '../data/models/dto';
import { AddUserUseCase } from '../domain/usecases/add-user.usecase';
import { DeleteUserUseCase } from '../domain/usecases/delete-user.usecase';
import { FetchUsersUseCase } from '../domain/usecases/fetch-users.usecase';
import { GetCachedUsersUseCase } from '../domain/usecases/get-cached-users.usecase';
import { GetUserByIdUseCase } from '../domain/usecases/get-user-by-id.usecase';
import { UpdateUserUseCase } from '../domain/usecases/update-user.usecase';
import { USER_ADD_USER_CASE, USER_DELETE_USER_CASE, USER_FETCH_USER_CASE, USER_GET_USER_BY_ID_USER_CASE, USER_GET_USER_CACHED_USER_CASE, USER_UPDATE_USER_CASE } from '../injection-tokens';

@injectable()
export class UserViewModel {
  constructor(
    @inject(USER_ADD_USER_CASE) public addUserUseCase: AddUserUseCase,
    @inject(USER_UPDATE_USER_CASE) public updateUserUseCase: UpdateUserUseCase,
    @inject(USER_FETCH_USER_CASE) public fetchUsersUseCase: FetchUsersUseCase,
    @inject(USER_GET_USER_CACHED_USER_CASE) public getCachedUsersUseCase: GetCachedUsersUseCase,
    @inject(USER_DELETE_USER_CASE) public deleteUserUseCase: DeleteUserUseCase,
    @inject(USER_GET_USER_BY_ID_USER_CASE) public getUserbyIdUseCase: GetUserByIdUseCase
  ) {}

  addUser(user: User): Promise<void> {
    return this.addUserUseCase.execute(user);
  }

  updateUser(user: User): Promise<void> {
    return this.updateUserUseCase.execute(user);
  }

  fetchUsers(): Promise<User[]> {
    return this.fetchUsersUseCase.execute();
  }

  getCachedUsers(): Promise<User[]> {
    return this.getCachedUsersUseCase.execute();
  }

  deleteUser(id: number): Promise<void> {
    return this.deleteUserUseCase.execute(id);
  }

  getUserById(id: number): Observable<User> {
    return this.getUserbyIdUseCase.execute(id);
  }
}
