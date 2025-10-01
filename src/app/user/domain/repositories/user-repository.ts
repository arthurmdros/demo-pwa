import { User } from '../entities/user';

export interface UserRepository {
  fetchUsers(): Promise<User[]>;
  getCachedUsers(): Promise<User[]>;
  addUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: number): Promise<void>;
}
