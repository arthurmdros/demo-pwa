import { Observable } from "rxjs";
import { User } from "../../data/entities/user";

export interface UserRepository {
  fetchUsers(): Promise<User[]>;
  getCachedUsers(): Promise<User[]>;
  getUserById(id: number): Observable<User>;
  addUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: number): Promise<void>;
}
