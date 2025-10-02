import { Observable } from "rxjs";
import { User } from "./models/dto";

export interface UserRemoteDataSource {
  fetchUsers(): Promise<User[]>;
  getCachedUsers(): Promise<User[]>;
  getUserById(id: number): Observable<User>;
  addUser(user: User): Promise<void>;
  updateUser(user: User): Promise<void>;
  deleteUser(id: number): Promise<void>;
}
