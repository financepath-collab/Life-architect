// Custom lightweight IndexedDB wrapper for asynchronous, high-capacity, non-blocking local storage

class IndexedDBStore {
  private dbName = "SecondBrainDB";
  private storeName = "keyvalue";
  private db: IDBDatabase | null = null;

  private init(): Promise<IDBDatabase> {
    if (this.db) return Promise.resolve(this.db);
    return new Promise((resolve, reject) => {
      const request = indexedDB.open(this.dbName, 1);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(this.storeName)) {
          db.createObjectStore(this.storeName);
        }
      };
      request.onsuccess = () => {
        this.db = request.result;
        resolve(this.db);
      };
      request.onerror = () => {
        reject(request.error);
      };
    });
  }

  async getItem<T>(key: string): Promise<T | null> {
    try {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readonly");
        const store = transaction.objectStore(this.storeName);
        const request = store.get(key);
        request.onsuccess = () => {
          resolve(request.result !== undefined ? (request.result as T) : null);
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error(`IndexedDB getItem failed for key "${key}":`, e);
      return null;
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.put(value, key);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error(`IndexedDB setItem failed for key "${key}":`, e);
    }
  }

  async removeItem(key: string): Promise<void> {
    try {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.delete(key);
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error(`IndexedDB removeItem failed for key "${key}":`, e);
    }
  }

  async clear(): Promise<void> {
    try {
      const db = await this.init();
      return new Promise((resolve, reject) => {
        const transaction = db.transaction(this.storeName, "readwrite");
        const store = transaction.objectStore(this.storeName);
        const request = store.clear();
        request.onsuccess = () => {
          resolve();
        };
        request.onerror = () => {
          reject(request.error);
        };
      });
    } catch (e) {
      console.error("IndexedDB clear failed:", e);
    }
  }
}

export const dbStore = new IndexedDBStore();
