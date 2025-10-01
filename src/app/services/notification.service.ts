import { Injectable, NgZone } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications$ = new BehaviorSubject<NotificationItem[]>([]);
  connectionStatus$ = new BehaviorSubject<ConnectionStatus>('connecting');

  private eventSource?: EventSource;
  private dbName = 'notifications-db';
  private storeName = 'notifications';

  constructor(private zone: NgZone) {
    this.initDB().then(() => {
      this.loadFromDB();
      this.connect();
    });
  }

  // --- SSE CONNECTION ---
  private connect() {
    const backendUrl = 'https://demo-pwa-server-production.up.railway.app/notifications';
    this.eventSource = new EventSource(backendUrl);

    this.eventSource.onopen = () => {
      this.zone.run(() => this.connectionStatus$.next('connected'));
    };

    this.eventSource.addEventListener('message', (event: MessageEvent) => {
      this.zone.run(async () => {
        const newNotification: NotificationItem = {
          id: crypto.randomUUID(),
          message: event.data,
          read: false,
          timestamp: new Date(),
        };
        const current = this.notifications$.value;
        this.notifications$.next([...current, newNotification]);
        await this.saveToDB(newNotification);
      });
    });

    this.eventSource.addEventListener('status', (event: MessageEvent) => {
      this.zone.run(() => {
        try {
          const status = JSON.parse(event.data);
          if (status['connected']) this.connectionStatus$.next('connected');
          else if (status['disconnected']) this.connectionStatus$.next('disconnected');
          else this.connectionStatus$.next('error');
        } catch {
          this.connectionStatus$.next('error');
        }
      });
    });

    this.eventSource.onerror = () => {
      this.zone.run(() => this.connectionStatus$.next('disconnected'));
      this.eventSource?.close();
      setTimeout(() => this.connect(), 5000);
    };
  }

  // --- INDEXEDDB LOGIC ---
  private db!: IDBDatabase;

  private initDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);

      request.onerror = () => reject(request.error);
      request.onsuccess = () => {
        this.db = request.result;
        resolve();
      };
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName, { keyPath: 'id' });
        }
      };
    });
  }

  private saveToDB(notification: NotificationItem): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      store.put(notification);
      tx.oncomplete = () => resolve();
      tx.onerror = () => reject(tx.error);
    });
  }

  private async loadFromDB() {
    return new Promise<void>((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readonly');
      const store = tx.objectStore(this.storeName);
      const request = store.getAll();
      request.onsuccess = () => {
        this.notifications$.next(request.result || []);
        resolve();
      };
      request.onerror = () => reject(request.error);
    });
  }

  private clearDB(): Promise<void> {
    return new Promise((resolve, reject) => {
      const tx = this.db.transaction(this.storeName, 'readwrite');
      const store = tx.objectStore(this.storeName);
      const request = store.clear();
      request.onsuccess = () => resolve();
      request.onerror = () => reject(request.error);
    });
  }

  // --- NOTIFICATIONS OPERATIONS ---
  async markAsRead(id: string) {
    const updated = this.notifications$.value.map((n) => (n.id === id ? { ...n, read: true } : n));
    this.notifications$.next(updated);
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    const notif = updated.find((n) => n.id === id);
    if (notif) store.put(notif);
  }

  async removeNotification(id: string) {
    const updated = this.notifications$.value.filter((n) => n.id !== id);
    this.notifications$.next(updated);
    const tx = this.db.transaction(this.storeName, 'readwrite');
    const store = tx.objectStore(this.storeName);
    store.delete(id);
  }

  async clearAll() {
    this.notifications$.next([]);
    await this.clearDB();
  }
}

// TYPES
export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}
