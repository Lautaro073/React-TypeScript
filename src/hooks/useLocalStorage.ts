import { useState } from 'react';

export function useLocalStorage<T>(
  key: string,
  initialValue: T
): [T, (value: T | ((prevValue: T) => T)) => void] {
  const [storedValue, setStoredValue] = useState<T>(() => {
    if (typeof window === 'undefined') return initialValue;
    try {
      const item = window.localStorage.getItem(key);
      return item ? (JSON.parse(item) as T) : initialValue;
    } catch (error) {
      console.error(`Error leyendo la clave ${key} en localStorage:`, error);
      return initialValue;
    }
  });

  const setValue = (value: T | ((prevValue: T) => T)) => {
    try {
      setStoredValue((prevValue) => {
        const newValue =
          typeof value === 'function'
            ? (value as (prevValue: T) => T)(prevValue)
            : value;
        if (typeof window !== 'undefined') {
          window.localStorage.setItem(key, JSON.stringify(newValue));
        }
        return newValue;
      });
    } catch (error) {
      console.error(`Error guardando la clave ${key} en localStorage:`, error);
    }
  };

  return [storedValue, setValue];
}
