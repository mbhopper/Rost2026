import type { AppStore, SettingsSlice, SettingsState } from './types';

type SetState = (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>), replace?: boolean) => void;

const defaultSettings: SettingsState = {
  securityAlerts: true,
  weeklyDigest: true,
  priorityReminders: false,
};

export const createSettingsSlice = (set: SetState): SettingsSlice => ({
  settings: defaultSettings,
  toggleSetting: (key: keyof SettingsState) => {
    set((state) => ({
      settings: {
        ...state.settings,
        [key]: !state.settings[key],
      },
    }));
  },
});
