import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class DbOfflineService {
  private dbName = 'app-offline-db';
  private dbVersion = 1;
  private db!: IDBDatabase;

  // Promise que resolve quando o DB estiver pronto
  private dbReady!: Promise<IDBDatabase>;

  constructor() {
    this.dbReady = this.init();
  }

  /** Inicializa o IndexedDB e cria as stores necessárias */
  private init(): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, this.dbVersion);

      request.onerror = (event) => {
        console.error('Erro ao abrir IndexedDB:', event);
        reject(event);
      };

      request.onsuccess = (event: any) => {
        this.db = event.target.result;
        resolve(this.db);
      };

      request.onupgradeneeded = (event: any) => {
        this.db = event.target.result;

        if (!this.db.objectStoreNames.contains('users')) {
          this.db.createObjectStore('users', { keyPath: 'id', autoIncrement: true });
        }
        if (!this.db.objectStoreNames.contains('notifications')) {
          this.db.createObjectStore('notifications', { keyPath: 'id', autoIncrement: true });
        }
        if (!this.db.objectStoreNames.contains('pending-users')) {
          this.db.createObjectStore('pending-users', { keyPath: 'id', autoIncrement: true });
        }
      };
    });
  }

  /** Adiciona ou atualiza um registro na store */
  async add(storeName: string, value: any): Promise<IDBValidKey> {
    const db = await this.dbReady;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.put(value);
      request.onsuccess = () => resolve(request.result);
      request.onerror = (e) => reject(e);
    });
  }

  /** Busca todos os registros de uma store */
  async getAll<T = any>(storeName: string): Promise<T[]> {
    const db = await this.dbReady;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result as T[]);
      request.onerror = (e) => reject(e);
    });
  }

  /** Busca por ID */
  async getById<T = any>(storeName: string, id: IDBValidKey): Promise<T | undefined> {
    const db = await this.dbReady;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readonly');
      const store = tx.objectStore(storeName);
      const request = store.get(id);
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = (e) => reject(e);
    });
  }

  /** Remove por ID */
  async delete(storeName: string, id: IDBValidKey): Promise<void> {
    const db = await this.dbReady;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.delete(id);
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e);
    });
  }

  /** Limpa toda a store */
  async clear(storeName: string): Promise<void> {
    const db = await this.dbReady;
    return new Promise((resolve, reject) => {
      const tx = db.transaction([storeName], 'readwrite');
      const store = tx.objectStore(storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = (e) => reject(e);
    });
  }
}
