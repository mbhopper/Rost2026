import { readLocalStorage, storageKeys, writeLocalStorage } from '../../shared/config/storage';
import type {
  AppStore,
  NotificationSettings,
  SettingsSlice,
  SettingsState,
  ThemeMode,
} from './types';

type SetState = (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>), replace?: boolean) => void;

const defaultSettings: SettingsState = {
  themeMode: 'system',
  demoMode: true,
  secureScreenMode: false,
  notifications: {
    securityEvents: true,
    passUpdates: true,
    sessionAlerts: false,
  },
};

const readPersistedSettings = (): SettingsState => {
  const rawValue = readLocalStorage(storageKeys.settings);

  if (!rawValue) {
    return defaultSettings;
  }

  try {
    const parsed = JSON.parse(rawValue) as Partial<SettingsState>;

    return {
      themeMode: isThemeMode(parsed.themeMode) ? parsed.themeMode : defaultSettings.themeMode,
      demoMode: typeof parsed.demoMode === 'boolean' ? parsed.demoMode : defaultSettings.demoMode,
      secureScreenMode:
        typeof parsed.secureScreenMode === 'boolean'
          ? parsed.secureScreenMode
          : defaultSettings.secureScreenMode,
      notifications: {
        securityEvents:
          typeof parsed.notifications?.securityEvents === 'boolean'
            ? parsed.notifications.securityEvents
            : defaultSettings.notifications.securityEvents,
        passUpdates:
          typeof parsed.notifications?.passUpdates === 'boolean'
            ? parsed.notifications.passUpdates
            : defaultSettings.notifications.passUpdates,
        sessionAlerts:
          typeof parsed.notifications?.sessionAlerts === 'boolean'
            ? parsed.notifications.sessionAlerts
            : defaultSettings.notifications.sessionAlerts,
      },
    };
  } catch {
    return defaultSettings;
  }
};

const persistSettings = (settings: SettingsState) => {
  writeLocalStorage(storageKeys.settings, JSON.stringify(settings));
};

const isThemeMode = (value: unknown): value is ThemeMode => value === 'system' || value === 'dark' || value === 'light';

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
  setThemeMode: (mode) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        themeMode: mode,
      };

      persistSettings(nextSettings);

      return { settings: nextSettings };
    });
  },
  toggleNotification: (key: keyof NotificationSettings) => {
    set((state) => {
      const nextSettings = {
        ...state.settings,
        notifications: {
          ...state.settings.notifications,
          [key]: !state.settings.notifications[key],
        },
      };

      persistSettings(nextSettings);

      return {
        settings: nextSettings,
      };
    });
  },
});
