import { mockApi } from '../../shared/api/mockApi';
import type { AppStore, PassSlice } from './types';

type SetState = (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>), replace?: boolean) => void;

export const createPassSlice = (set: SetState): PassSlice => ({
  passes: [],
  loadPasses: async () => {
    const passes = await mockApi.getPasses();
    set({ passes });
  },
});
