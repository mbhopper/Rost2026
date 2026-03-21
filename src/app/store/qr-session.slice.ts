import { mockApi } from '../../shared/api/mockApi';
import type { AppStore, QrSessionSlice } from './types';

type SetState = (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>), replace?: boolean) => void;

export const createQrSessionSlice = (set: SetState): QrSessionSlice => ({
  qrSession: null,
  loadQrSession: async () => {
    const qrSession = await mockApi.getQrSession();
    set({ qrSession });
  },
  rotateQrSession: async () => {
    const qrSession = await mockApi.rotateQrSession();
    set({ qrSession });
  },
});
