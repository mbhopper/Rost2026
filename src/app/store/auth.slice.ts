import { mockApi } from '../../shared/api/mockApi';
import type { AppStore, AuthSlice, RegisterPayload } from './types';

type SetState = (partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>), replace?: boolean) => void;

export const createAuthSlice = (set: SetState): AuthSlice => ({
  authStatus: 'guest',
  user: null,
  login: async (email: string, password: string) => {
    set({ authStatus: 'loading' });
    const nextUser = await mockApi.signIn(email, password);
    set({ user: nextUser, authStatus: 'authenticated' });
  },
  register: async (payload: RegisterPayload) => {
    set({ authStatus: 'loading' });
    const nextUser = await mockApi.signUp(payload);
    set({ user: nextUser, authStatus: 'authenticated' });
  },
  logout: () => set({ authStatus: 'guest', user: null }),
});
