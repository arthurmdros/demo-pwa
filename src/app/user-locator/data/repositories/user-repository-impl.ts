import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DbOfflineService } from '../../domain/datasources/offline-db.service';
import { UserRepository } from '../../domain/repositories/user-repository';
import { User } from '../entities/user';

@Injectable()
export class UserRepositoryImpl implements UserRepository {
  private apiUrl = 'http://localhost:3000/users';

  constructor(private http: HttpClient, private dbOffline: DbOfflineService) {}

  async fetchUsers(): Promise<User[]> {
    try {
      const users = (await this.http.get<User[]>(this.apiUrl).toPromise()) || [];
      await this.dbOffline.clear('users');
      for (const user of users) await this.dbOffline.add('users', user);
      return users;
    } catch (err) {
      console.warn('⚠️ Offline, carregando do IndexedDB...', err);
      return await this.dbOffline.getAll<User>('users');
    }
  }

  async getCachedUsers(): Promise<User[]> {
    return await this.dbOffline.getAll<User>('users');
  }

  async addUser(user: User): Promise<void> {
    if (navigator.onLine) {
      try {
        const saved = await this.http.post<User>(this.apiUrl, user).toPromise();
        if (saved) await this.dbOffline.add('users', saved);
      } catch {
        await this.savePending(user);
      }
    } else {
      await this.savePending(user);
    }
  }

  async updateUser(user: User): Promise<void> {
    if (navigator.onLine) {
      try {
        const updated = await this.http.put<User>(`${this.apiUrl}/${user.id}`, user).toPromise();
        if (updated) await this.dbOffline.add('users', { ...updated, _update: true });
      } catch {
        await this.savePending({ ...user, _update: true });
      }
    } else {
      await this.savePending({ ...user, _update: true });
    }
  }

  async deleteUser(id: number): Promise<void> {
    if (navigator.onLine) {
      try {
        await this.http.delete(`${this.apiUrl}/${id}`).toPromise();
        await this.dbOffline.delete('users', id);
      } catch {
        await this.dbOffline.delete('users', id);
        await this.dbOffline.add('pending-users', { id, _delete: true });
      }
    } else {
      await this.dbOffline.delete('users', id);
      await this.dbOffline.add('pending-users', { id, _delete: true });
    }
  }

  private async savePending(user: Partial<User> & { _delete?: boolean; _update?: boolean }) {
    await this.dbOffline.add('users', user);
    await this.dbOffline.add('pending-users', user);
  }

  getUserById(id: number): Observable<User> {
    return this.http.get<User>(`${this.apiUrl}/${id}`);
  }

  // async getUserById(id: number): Promise<User> {
  //   try {
  //     const users = await this.http.get<User>(`${this.apiUrl}/${id}`).toPromise();
  //     return users!;
  //   } catch (err) {
  //     console.warn('⚠️ Offline, carregando do IndexedDB...', err);
  //     return {} as User;
  //   }
  // }
}
