import { Injectable, NgZone } from '@angular/core';
import { Client, Message, StompSubscription } from '@stomp/stompjs';
import { BehaviorSubject } from 'rxjs';
import SockJS from 'sockjs-client';

export interface NotificationItem {
  id: string;
  message: string;
  read: boolean;
  timestamp: Date;
}

export type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

@Injectable({ providedIn: 'root' })
export class NotificationService {
  notifications$ = new BehaviorSubject<NotificationItem[]>([]);
  connectionStatus$ = new BehaviorSubject<ConnectionStatus>('connecting');

  private client!: Client;
  private subscription?: StompSubscription;

  private db!: IDBDatabase;
  private dbName = 'notifications-db';
  private storeName = 'notifications';

  constructor(private zone: NgZone) {
    this.initDB().then(() => {
      this.loadFromDB();
      this.connect();
    });
  }

  // -------------------- IndexedDB --------------------
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

  // -------------------- STOMP/SockJS --------------------
  private connect() {
    this.connectionStatus$.next('connecting');

    const socketFactory = () =>
      new SockJS('https://demo-pwa-server-production.up.railway.app/notifications');
    this.client = new Client({ webSocketFactory: socketFactory });

    this.client.debug = (msg) => console.log('[STOMP]', msg);

    this.client.onConnect = () => {
      this.zone.run(() => this.connectionStatus$.next('connected'));

      // Subscribing to backend topic
      this.subscription = this.client.subscribe('/topic/notifications', (msg: Message) => {
        this.zone.run(async () => {
          const notification: NotificationItem = {
            id: crypto.randomUUID(),
            message: msg.body,
            read: false,
            timestamp: new Date(),
          };
          const current = this.notifications$.value;
          this.notifications$.next([...current, notification]);
          await this.saveToDB(notification);
        });
      });
    };

    this.client.onStompError = (frame) => {
      console.error('STOMP error', frame);
      this.zone.run(() => this.connectionStatus$.next('error'));
    };

    this.client.onWebSocketClose = () => {
      this.zone.run(() => this.connectionStatus$.next('disconnected'));
      // Reconnect after 5s
      setTimeout(() => this.connect(), 5000);
    };

    this.client.activate();
  }

  // -------------------- Operations --------------------
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
    tx.objectStore(this.storeName).delete(id);
  }

  async clearAll() {
    this.notifications$.next([]);
    await this.clearDB();
  }
}
