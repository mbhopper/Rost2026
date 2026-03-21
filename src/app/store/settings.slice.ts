import { readLocalStorage, storageKeys, writeLocalStorage } from '../../shared/config/storage';
import type { AppStore, SettingsSlice, SettingsState, ThemeMode } from './types';

type SetState = (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>), replace?: boolean) => void;

const defaultSettings: SettingsState = {
  themeMode: 'system',
  demoMode: true,
  secureScreenMode: false,
  securityAlerts: true,
  passUpdates: true,
  sessionReminders: false,
};

const themeModes = new Set<ThemeMode>(['system', 'dark', 'light']);

const isSettingsState = (value: unknown): value is Partial<SettingsState> =>
  typeof value === 'object' && value !== null;

const sanitizeSettings = (value: unknown): SettingsState => {
  if (!isSettingsState(value)) {
    return defaultSettings;
  }

  return {
    themeMode:
      typeof value.themeMode === 'string' && themeModes.has(value.themeMode as ThemeMode)
        ? (value.themeMode as ThemeMode)
        : defaultSettings.themeMode,
    demoMode: typeof value.demoMode === 'boolean' ? value.demoMode : defaultSettings.demoMode,
    secureScreenMode:
      typeof value.secureScreenMode === 'boolean'
        ? value.secureScreenMode
        : defaultSettings.secureScreenMode,
    securityAlerts:
      typeof value.securityAlerts === 'boolean'
        ? value.securityAlerts
        : defaultSettings.securityAlerts,
    passUpdates: typeof value.passUpdates === 'boolean' ? value.passUpdates : defaultSettings.passUpdates,
    sessionReminders:
      typeof value.sessionReminders === 'boolean'
        ? value.sessionReminders
        : defaultSettings.sessionReminders,
  };
};

const readPersistedSettings = () => {
  const rawSettings = readLocalStorage(storageKeys.appSettings);

  if (!rawSettings) {
    return defaultSettings;
  }

  try {
    return sanitizeSettings(JSON.parse(rawSettings));
  } catch {
    return defaultSettings;
  }
};

const persistSettings = (settings: SettingsState) => {
  writeLocalStorage(storageKeys.appSettings, JSON.stringify(settings));
};

export const createSettingsSlice = (set: SetState): SettingsSlice => ({
  settings: readPersistedSettings(),
  toggleSetting: (key) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        [key]: !state.settings[key],
      };

      persistSettings(nextSettings);

      return {
        settings: nextSettings,
      };
    });
  },
  setThemeMode: (themeMode) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        themeMode,
      };

      persistSettings(nextSettings);

      return {
        settings: nextSettings,
      };
    });
  },
});
