import { defaultSettings, normalizeSettings, type TeleprompterSettings } from './settings';

const SCRIPT_KEY = 'teleprompter.v1.script';
const SETTINGS_KEY = 'teleprompter.v1.settings';

export const storageKeys = {
  script: SCRIPT_KEY,
  settings: SETTINGS_KEY
} as const;

const readLocalStorage = (key: string): string | null => {
  try {
    return window.localStorage.getItem(key);
  } catch {
    return null;
  }
};

const writeLocalStorage = (key: string, value: string): void => {
  try {
    window.localStorage.setItem(key, value);
  } catch {
    // Ignore write failures (e.g. private browsing quota restrictions)
  }
};

export const loadScript = (): string => {
  const raw = readLocalStorage(SCRIPT_KEY);

  if (raw === null) {
    return '';
  }

  return raw;
};

export const saveScript = (script: string): void => {
  writeLocalStorage(SCRIPT_KEY, script);
};

export const loadSettings = (): TeleprompterSettings => {
  const raw = readLocalStorage(SETTINGS_KEY);

  if (!raw) {
    return { ...defaultSettings };
  }

  try {
    return normalizeSettings(JSON.parse(raw));
  } catch {
    return { ...defaultSettings };
  }
};

export const saveSettings = (settings: TeleprompterSettings): void => {
  writeLocalStorage(SETTINGS_KEY, JSON.stringify(settings));
};
