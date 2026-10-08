let AsyncStorageModule: any = null;
try {
  AsyncStorageModule = require('@react-native-async-storage/async-storage').default;
} catch {
  // Graceful fallback to memory store if package not yet installed or linking
  const memoryCache = new Map<string, string>();
  AsyncStorageModule = {
    getItem: async (key: string) => memoryCache.get(key) || null,
    setItem: async (key: string, value: string) => {
      memoryCache.set(key, value);
    },
    removeItem: async (key: string) => {
      memoryCache.delete(key);
    },
    clear: async () => {
      memoryCache.clear();
    },
  };
}

export const STORAGE_KEYS = {
  AUTH_USER: '@cosmetics_auth_user',
  AUTH_TOKEN: '@cosmetics_auth_token',
  CART_ITEMS: '@cosmetics_cart_items',
  FAVORITES: '@cosmetics_favorites',
} as const;

export const storage = {
  async getItem<T>(key: string, defaultValue: T | null = null): Promise<T | null> {
    try {
      const data = await AsyncStorageModule.getItem(key);
      if (data === null || data === undefined) return defaultValue;
      return JSON.parse(data) as T;
    } catch {
      return defaultValue;
    }
  },

  async setItem<T>(key: string, value: T): Promise<void> {
    try {
      await AsyncStorageModule.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn('Storage setItem error for key:', key, error);
    }
  },

  async removeItem(key: string): Promise<void> {
    try {
      await AsyncStorageModule.removeItem(key);
    } catch (error) {
      console.warn('Storage removeItem error for key:', key, error);
    }
  },

  async clear(): Promise<void> {
    try {
      await AsyncStorageModule.clear();
    } catch (error) {
      console.warn('Storage clear error:', error);
    }
  },
};

export default storage;
