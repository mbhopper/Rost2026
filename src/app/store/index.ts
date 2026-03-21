import { create } from 'zustand';
import { createAuthSlice } from './auth.slice';
import { createPassSlice } from './pass.slice';
import { createQrSessionSlice } from './qr-session.slice';
import { createSettingsSlice } from './settings.slice';
import type { AppStore } from './types';

export const useAppStore = create<AppStore>((set) => ({
  ...createAuthSlice(set),
  ...createPassSlice(set),
  ...createQrSessionSlice(set),
  ...createSettingsSlice(set),
}));

export * from './types';
