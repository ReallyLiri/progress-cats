import { useCallback, useState } from "react";
import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";

const STORAGE_KEY = "progress-bars"

const loadFromStorage = (): Record<string, ProgressBarDefinition> => {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) {
    return {}
  }
  return JSON.parse(value) || {}
}

const saveToStorage = (value: Record<string, ProgressBarDefinition>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}

export const useProgressBars = () => {
  const [bars, setBars] = useState<Record<string, ProgressBarDefinition>>(loadFromStorage);

  const persistAndSet = useCallback((mutate: (value: Record<string, ProgressBarDefinition>) => void) => {
    setBars(value => {
      mutate(value);
      saveToStorage(value);
      return value;
    });
  }, []);

  return {
    barIds: Object.values(bars).map(b => b.id),
    barById: (id: string) => bars[id]!,
    addBar: (bar: ProgressBarDefinition) => persistAndSet(map => (map[bar.id] = bar)),
    removeBar: (id: string) => persistAndSet(map => (delete map[id])),
    updateBar: (id: string, value: number) => persistAndSet(map => (map[id].value = value))
  }
}
