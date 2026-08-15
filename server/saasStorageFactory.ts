import { SaasStorage } from './saasStorage';
import { MemSaasStorage } from './memSaasStorage';

/**
 * Feature flags for SaaS platform storage
 */
export interface StorageConfig {
  /** Whether to use in-memory storage instead of database */
  useMemoryStorage: boolean;
  /** Log storage operations for debugging */
  debugStorage: boolean;
}

/**
 * Get storage configuration from environment variables or defaults
 */
function getStorageConfig(): StorageConfig {
  return {
    useMemoryStorage: false, // Force use of database storage for production-ready setup
    debugStorage: process.env.DEBUG_STORAGE === 'true' || process.env.NODE_ENV === 'development'
  };
}

/**
 * Storage factory that returns either database or memory storage based on configuration
 */
class SaasStorageFactory {
  private static instance: SaasStorage | MemSaasStorage | null = null;
  private static config: StorageConfig;

  /**
   * Get the storage instance (singleton pattern)
   */
  static getInstance(): SaasStorage | MemSaasStorage {
    if (!this.instance) {
      this.config = getStorageConfig();
      
      if (this.config.useMemoryStorage) {
        console.log('🧠 Using in-memory SaaS storage for development');
        this.instance = new MemSaasStorage();
      } else {
        console.log('🗄️ Using database SaaS storage for production');
        this.instance = new SaasStorage();
      }

      if (this.config.debugStorage) {
        console.log('🔍 SaaS storage debugging enabled');
        this.instance = this.wrapWithDebugLogging(this.instance);
      }
    }

    return this.instance;
  }

  /**
   * Reset the storage instance (useful for testing)
   */
  static resetInstance(): void {
    this.instance = null;
  }

  /**
   * Check if currently using memory storage
   */
  static isUsingMemoryStorage(): boolean {
    return this.config?.useMemoryStorage ?? getStorageConfig().useMemoryStorage;
  }

  /**
   * Wrap storage instance with debug logging
   */
  private static wrapWithDebugLogging(storage: SaasStorage | MemSaasStorage): SaasStorage | MemSaasStorage {
    // Create a proxy to log all method calls
    return new Proxy(storage, {
      get(target, prop, receiver) {
        const value = Reflect.get(target, prop, receiver);
        
        if (typeof value === 'function') {
          return function(...args: any[]) {
            console.log(`📊 SaasStorage.${String(prop)}(${args.length > 0 ? '...' : ''})`);
            const start = Date.now();
            
            try {
              const result = value.apply(this, args);
              
              // Handle both sync and async results
              if (result && typeof result.then === 'function') {
                return result.then((res: any) => {
                  console.log(`✅ SaasStorage.${String(prop)} completed in ${Date.now() - start}ms`);
                  return res;
                }).catch((err: any) => {
                  console.log(`❌ SaasStorage.${String(prop)} failed in ${Date.now() - start}ms:`, err);
                  throw err;
                });
              } else {
                console.log(`✅ SaasStorage.${String(prop)} completed in ${Date.now() - start}ms`);
                return result;
              }
            } catch (err) {
              console.log(`❌ SaasStorage.${String(prop)} failed in ${Date.now() - start}ms:`, err);
              throw err;
            }
          };
        }
        
        return value;
      }
    });
  }
}

/**
 * Get the configured SaaS storage instance
 */
export function getSaasStorage(): SaasStorage | MemSaasStorage {
  return SaasStorageFactory.getInstance();
}

/**
 * Check if using memory storage (useful for conditional logic)
 */
export function isUsingMemoryStorage(): boolean {
  return SaasStorageFactory.isUsingMemoryStorage();
}

/**
 * Reset storage instance (useful for testing)
 */
export function resetStorageInstance(): void {
  SaasStorageFactory.resetInstance();
}

// Export storage config for external use
export { StorageConfig, getStorageConfig };