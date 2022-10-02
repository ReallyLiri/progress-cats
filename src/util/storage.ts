import { ProgressBarDefinition } from "src/model/ProgressBarDefinition";

const STORAGE_KEY = "progress-bars"

export const loadFromStorage = (): Record<string, ProgressBarDefinition> => {
  const value = localStorage.getItem(STORAGE_KEY);
  if (!value) {
    return {}
  }
  return JSON.parse(value) || {}
}

export const saveToStorage = (value: Record<string, ProgressBarDefinition>) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(value));
}