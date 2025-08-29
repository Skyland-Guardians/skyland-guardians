// Safe storage utility: prefer localStorage, fall back to sessionStorage, then in-memory Map.
// API: safeStorage.getItem(key), setItem(key, value), removeItem(key), clear(), getStorageInfo()
type StorageMethod = 'localStorage' | 'sessionStorage' | 'memory';

class SafeStorage {
  private method: StorageMethod;
  private memory = new Map<string, string>();

  constructor() {
    this.method = this.detectBestStorage();
    // Small visible hint for debugging — can be removed later
    if (typeof window !== 'undefined' && (window as any).__DEBUG_SAFE_STORAGE__) {
      console.info(`📦 safe-storage: using ${this.method}`);
    }
  }

  private detectBestStorage(): StorageMethod {
    // Try localStorage
    try {
      if (typeof window !== 'undefined' && 'localStorage' in window) {
        const key = '__safe_storage_test__';
        window.localStorage.setItem(key, '1');
        window.localStorage.removeItem(key);
        return 'localStorage';
      }
    } catch (e) {
      // ignore and try sessionStorage
    }

    try {
      if (typeof window !== 'undefined' && 'sessionStorage' in window) {
        const key = '__safe_storage_test__';
        window.sessionStorage.setItem(key, '1');
        window.sessionStorage.removeItem(key);
        return 'sessionStorage';
      }
    } catch (e) {
      // ignore and fall back to memory
    }

    return 'memory';
  }

  getStorageInfo() {
    return { method: this.method } as const;
  }

  setItem(key: string, value: string) {
    try {
      if (this.method === 'localStorage') {
        window.localStorage.setItem(key, value);
        return;
      }
      if (this.method === 'sessionStorage') {
        window.sessionStorage.setItem(key, value);
        return;
      }
    } catch (e) {
      // fall through to memory fallback
      this.method = 'memory';
    }

    this.memory.set(key, value);
  }

  getItem(key: string): string | null {
    try {
      if (this.method === 'localStorage') {
        return window.localStorage.getItem(key);
      }
      if (this.method === 'sessionStorage') {
        return window.sessionStorage.getItem(key);
      }
    } catch (e) {
      // ignore and check memory
    }
    return this.memory.has(key) ? String(this.memory.get(key)) : null;
  }

  removeItem(key: string) {
    try {
      if (this.method === 'localStorage') {
        window.localStorage.removeItem(key);
        return;
      }
      if (this.method === 'sessionStorage') {
        window.sessionStorage.removeItem(key);
        return;
      }
    } catch (e) {
      // ignore
    }
    this.memory.delete(key);
  }

  clear() {
    try {
      if (this.method === 'localStorage') {
        window.localStorage.clear();
        return;
      }
      if (this.method === 'sessionStorage') {
        window.sessionStorage.clear();
        return;
      }
    } catch (e) {
      // ignore
    }
    this.memory.clear();
  }
}

export const safeStorage = new SafeStorage();
