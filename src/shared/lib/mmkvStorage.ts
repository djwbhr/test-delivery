import { createMMKV } from 'react-native-mmkv';

const storage = createMMKV({
  id: 'query-cache',
});

export const mmkvStorage = {
  getItem: (key: string) => {
    return storage.getString(key) ?? null;
  },
  setItem: (key: string, value: string) => {
    storage.set(key, value);
  },
  removeItem: (key: string) => {
    (storage as any).delete(key);
  },
} as const;
