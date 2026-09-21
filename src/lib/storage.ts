/* WAZI Civic — Local Case & Settings Storage */

import type { CivicCase } from './types';
import { INITIAL_SAVED_CASES } from './demo-fixtures';

const CASES_STORAGE_KEY = 'wazi_civic_saved_cases_v1';
const SETTINGS_STORAGE_KEY = 'wazi_civic_settings_v1';

export interface AppSettings {
  language: string;
  lowDataMode: boolean;
  soundEnabled: boolean;
  apiKey?: string;
  useLiveApi: boolean;
  voiceName: string;
}

const DEFAULT_SETTINGS: AppSettings = {
  language: 'en-NG', // updated default to Nigerian English
  lowDataMode: false,
  soundEnabled: true,
  useLiveApi: false,
  voiceName: 'Kore'
};

export const loadSavedCases = (): CivicCase[] => {
  try {
    const raw = localStorage.getItem(CASES_STORAGE_KEY);
    if (!raw) {
      saveCases(INITIAL_SAVED_CASES);
      return INITIAL_SAVED_CASES;
    }
    return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to parse saved cases from localStorage:', err);
    return INITIAL_SAVED_CASES;
  }
};

export const saveCases = (cases: CivicCase[]): void => {
  try {
    localStorage.setItem(CASES_STORAGE_KEY, JSON.stringify(cases));
  } catch (err) {
    console.error('Failed to save cases to localStorage:', err);
  }
};

export const saveSingleCase = (newCase: CivicCase): CivicCase[] => {
  const current = loadSavedCases();
  const existingIndex = current.findIndex(c => c.id === newCase.id);
  let updated: CivicCase[];
  if (existingIndex >= 0) {
    updated = [...current];
    updated[existingIndex] = { ...newCase, updatedAt: new Date().toISOString() };
  } else {
    updated = [{ ...newCase, updatedAt: new Date().toISOString() }, ...current];
  }
  saveCases(updated);
  return updated;
};

export const loadSettings = (): AppSettings => {
  try {
    const raw = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (!raw) return DEFAULT_SETTINGS;
    return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {
    return DEFAULT_SETTINGS;
  }
};

export const saveSettings = (settings: Partial<AppSettings>): AppSettings => {
  const current = loadSettings();
  const updated = { ...current, ...settings };
  try {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(updated));
  } catch (err) {
    console.error('Failed to save settings:', err);
  }
  return updated;
};
