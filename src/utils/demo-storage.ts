// 多级存储fallback方案 - 100%可靠的demo方案
export class DemoReliableStorage {
  private memoryStorage: Map<string, string> = new Map();
  private storageMethod: 'localStorage' | 'sessionStorage' | 'memory' = 'memory';

  constructor() {
    this.detectBestStorage();
  }

  private detectBestStorage() {
    // 优先级: localStorage > sessionStorage > 内存存储
    try {
      const testKey = '__demo_storage_test__';
      const testValue = 'test';
      
      // 测试 localStorage
      localStorage.setItem(testKey, testValue);
      if (localStorage.getItem(testKey) === testValue) {
        localStorage.removeItem(testKey);
        this.storageMethod = 'localStorage';
        console.log('🟢 Using localStorage');
        return;
      }
    } catch (e) {
      console.warn('localStorage failed:', e);
    }

    try {
      // 测试 sessionStorage
      const testKey = '__demo_storage_test__';
      const testValue = 'test';
      sessionStorage.setItem(testKey, testValue);
      if (sessionStorage.getItem(testKey) === testValue) {
        sessionStorage.removeItem(testKey);
        this.storageMethod = 'sessionStorage';
        console.log('🟡 Using sessionStorage fallback');
        return;
      }
    } catch (e) {
      console.warn('sessionStorage failed:', e);
    }

    // 最后使用内存存储
    this.storageMethod = 'memory';
    console.log('🔴 Using memory storage fallback');
  }

  setItem(key: string, value: string): boolean {
    try {
      switch (this.storageMethod) {
        case 'localStorage':
          localStorage.setItem(key, value);
          break;
        case 'sessionStorage':
          sessionStorage.setItem(key, value);
          break;
        case 'memory':
          this.memoryStorage.set(key, value);
          break;
      }
      console.log(`✅ [${this.storageMethod}] Saved: ${key}`);
      return true;
    } catch (e) {
      console.error(`❌ [${this.storageMethod}] Save failed for ${key}:`, e);
      // 降级到内存存储
      if (this.storageMethod !== 'memory') {
        this.storageMethod = 'memory';
        this.memoryStorage.set(key, value);
        console.log(`🔄 Fallback to memory: ${key}`);
        return true;
      }
      return false;
    }
  }

  getItem(key: string): string | null {
    try {
      let value: string | null = null;
      
      switch (this.storageMethod) {
        case 'localStorage':
          value = localStorage.getItem(key);
          break;
        case 'sessionStorage':
          value = sessionStorage.getItem(key);
          break;
        case 'memory':
          value = this.memoryStorage.get(key) || null;
          break;
      }
      
      console.log(`📖 [${this.storageMethod}] Read: ${key} = ${value ? 'found' : 'not found'}`);
      return value;
    } catch (e) {
      console.error(`❌ [${this.storageMethod}] Read failed for ${key}:`, e);
      // 尝试从内存存储读取
      const memValue = this.memoryStorage.get(key) || null;
      if (memValue) {
        console.log(`🔄 Fallback memory read: ${key}`);
      }
      return memValue;
    }
  }

  removeItem(key: string): boolean {
    try {
      switch (this.storageMethod) {
        case 'localStorage':
          localStorage.removeItem(key);
          break;
        case 'sessionStorage':
          sessionStorage.removeItem(key);
          break;
        case 'memory':
          this.memoryStorage.delete(key);
          break;
      }
      console.log(`🗑️ [${this.storageMethod}] Removed: ${key}`);
      return true;
    } catch (e) {
      console.error(`❌ [${this.storageMethod}] Remove failed for ${key}:`, e);
      // 从内存中也删除
      this.memoryStorage.delete(key);
      return false;
    }
  }

  // 获取当前存储状态信息
  getStorageInfo() {
    return {
      method: this.storageMethod,
      memorySize: this.memoryStorage.size,
      isDemo: this.storageMethod !== 'localStorage'
    };
  }

  // 清空所有数据
  clear(): boolean {
    try {
      switch (this.storageMethod) {
        case 'localStorage':
          // 只清理我们的keys，不影响其他应用
          const keys = Object.keys(localStorage).filter(k => 
            k.includes('parentControl') || k.includes('hasUsedMoneyRequest')
          );
          keys.forEach(k => localStorage.removeItem(k));
          break;
        case 'sessionStorage':
          const sessionKeys = Object.keys(sessionStorage).filter(k => 
            k.includes('parentControl') || k.includes('hasUsedMoneyRequest')
          );
          sessionKeys.forEach(k => sessionStorage.removeItem(k));
          break;
        case 'memory':
          this.memoryStorage.clear();
          break;
      }
      console.log(`🧹 [${this.storageMethod}] Cleared all data`);
      return true;
    } catch (e) {
      console.error(`❌ [${this.storageMethod}] Clear failed:`, e);
      this.memoryStorage.clear();
      return false;
    }
  }
}

// 创建全局实例
export const demoStorage = new DemoReliableStorage();