import { mockApi } from '../../shared/api/mockApi';
import {
  readSessionStorage,
  removeSessionStorage,
  storageKeys,
  writeSessionStorage,
} from '../../shared/config/storage';
import type { AppStore, QrSessionSlice } from './types';

type SetState = (
  partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>),
  replace?: boolean,
) => void;

const readPersistedQrSession = () => {
  const rawValue = readSessionStorage(storageKeys.qrSession);

  if (!rawValue) {
    return null;
  }

  try {
    return JSON.parse(rawValue);
  } catch {
    removeSessionStorage(storageKeys.qrSession);
    return null;
  }
};

const persistQrSession = (qrSession: NonNullable<AppStore['qrSession']>) => {
  writeSessionStorage(storageKeys.qrSession, JSON.stringify(qrSession));
};

export const createQrSessionSlice = (set: SetState): QrSessionSlice => ({
  qrSession: readPersistedQrSession(),
  loadQrSession: async () => {
    const persistedQrSession = readPersistedQrSession();

    if (persistedQrSession) {
      set({ qrSession: persistedQrSession });
      return;
    }

    const qrSession = await mockApi.getQrSession();
    persistQrSession(qrSession);
    set({ qrSession });
  },
  rotateQrSession: async () => {
    const qrSession = await mockApi.rotateQrSession();
    persistQrSession(qrSession);
    set({ qrSession });
  },
});
