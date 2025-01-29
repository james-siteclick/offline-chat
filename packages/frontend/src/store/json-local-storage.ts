import superjson from "superjson";
import { PersistStorage, StorageValue } from "zustand/middleware";

// {@link https://zustand.docs.pmnd.rs/integrations/persisting-store-data}
export function makeLocalStorage<T>() {
  const storage: PersistStorage<T> = {
    getItem: (name: string) => {
      const str = localStorage.getItem(name);
      if (!str) return null;
      return superjson.parse(str);
    },
    setItem: (name: string, value: StorageValue<T>) => {
      localStorage.setItem(name, superjson.stringify(value));
    },
    removeItem: (name: string) => localStorage.removeItem(name),
  };
  return storage;
}
