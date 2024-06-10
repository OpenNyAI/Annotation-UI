import { useEffect, useState } from "react";

type StorageValue = string | null;

export const useLocalStorage = (
  key: string,
  initialValue: StorageValue
): [StorageValue, (value: StorageValue) => void] => {
  const getInitialValue = (): StorageValue => {
    const storedValue = window.localStorage.getItem(key);
    return storedValue !== null ? storedValue : initialValue;
  };

  const [value, setValue] = useState<StorageValue>(getInitialValue);

  useEffect(() => {
    if (value === null) {
      window.localStorage.removeItem(key);
    } else {
      window.localStorage.setItem(key, value);
    }
  }, [key, value]);

  const updateValue = (newValue: StorageValue) => {
    setValue(newValue);
  };

  return [value, updateValue];
};
