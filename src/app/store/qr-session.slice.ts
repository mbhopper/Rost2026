import { api } from '../../shared/api/auth';
import {
  readSessionStorage,
  removeSessionStorage,
  storageKeys,
  writeSessionStorage,
} from '../../shared/config/storage';
import { QR_STATUSES, type QrSession } from '../../entities/qr/model';
import { restoreQrSession } from '../../features/qr-session/model/qrSession.service';
import type { AppStore, GenerateQrSessionPayload, QrSessionSlice } from './types';

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
    return restoreQrSession(JSON.parse(rawValue) as QrSession);
  } catch {
    removeSessionStorage(storageKeys.qrSession);
    return null;
  }
};

const persistQrSession = (qrSession: NonNullable<AppStore['qrSession']>) => {
  writeSessionStorage(storageKeys.qrSession, JSON.stringify(qrSession));
};

const clearPersistedQrSession = () => {
  removeSessionStorage(storageKeys.qrSession);
};

const withPersistedSession = async (
  session: QrSession | null,
  updater: (value: QrSession) => Promise<{ session: QrSession }>,
) => {
  if (!session) {
    return null;
  }

  const { session: nextSession } = await updater(session);
  persistQrSession(nextSession);
  return nextSession;
};

export const createQrSessionSlice = (set: SetState): QrSessionSlice => ({
  qrSession: readPersistedQrSession(),
  loadQrSession: async () => {
    // Refresh strategy: restore the active QR session from sessionStorage and
    // recalculate the remaining TTL on reload. If the TTL already elapsed while the
    // page was closed, we keep the session shell but immediately mark it expired.
    const persistedQrSession = readPersistedQrSession();

    if (!persistedQrSession) {
      set({ qrSession: null });
      return;
    }

    persistQrSession(persistedQrSession);
    set({ qrSession: persistedQrSession });
  },
  generateQrSession: async ({ employeeId, passId }: GenerateQrSessionPayload) => {
    const { session } = await api.qrSessionService.generateQrSession(
      employeeId,
      passId,
    );
    persistQrSession(session);
    set({ qrSession: session });
  },
  rotateQrSession: async ({ employeeId, passId }: GenerateQrSessionPayload) => {
    set((state) => ({
      qrSession: state.qrSession
        ? { ...state.qrSession, status: QR_STATUSES.REGENERATING }
        : state.qrSession,
    }));

    const { session } = await api.qrSessionService.generateQrSession(
      employeeId,
      passId,
    );
    persistQrSession(session);
    set({ qrSession: session });
  },
  expireQrSession: async () => {
    const currentSession = readPersistedQrSession();
    const nextSession = await withPersistedSession(
      currentSession,
      api.qrSessionService.expireQrSession,
    );

    set({ qrSession: nextSession });
  },
  markQrAsScanned: async () => {
    const currentSession = readPersistedQrSession();
    const nextSession = await withPersistedSession(
      currentSession,
      api.qrSessionService.markQrAsScanned,
    );

    set({ qrSession: nextSession });
  },
  revokeQrSession: async () => {
    const currentSession = readPersistedQrSession();
    const nextSession = await withPersistedSession(
      currentSession,
      api.qrSessionService.revokeQrSession,
    );

    if (!nextSession) {
      clearPersistedQrSession();
    }

    set({ qrSession: nextSession });
  },
});
