import { mockApi } from '../../shared/api/mockApi';
import {
  AppApiError,
  mapAppApiErrorToMessage,
} from '../../shared/api/appApi';
import {
  readLocalStorage,
  removeLocalStorage,
  removeSessionStorage,
  storageKeys,
  writeLocalStorage,
  writeSessionStorage,
} from '../../shared/config/storage';
import type { AppStore, AuthSlice, AuthStatus, RegisterPayload } from './types';

type SetState = (
  partial: Partial<AppStore> | ((state: AppStore) => Partial<AppStore>),
  replace?: boolean,
) => void;

type AuthResult = {
  token: string;
  user: NonNullable<AuthSlice['user']>;
};

const authStatuses = new Set<AuthStatus>([
  'invalid_credentials',
  'session_expired',
  'service_unavailable',
  'offline',
  'unknown_error',
]);

const persistAuth = ({ token, user }: AuthResult) => {
  writeLocalStorage(storageKeys.authToken, token);
  writeSessionStorage(storageKeys.authSession, JSON.stringify(user));
};

const clearPersistedAuth = () => {
  removeLocalStorage(storageKeys.authToken);
  removeSessionStorage(storageKeys.authSession);
  removeSessionStorage(storageKeys.qrSession);
};

const resolveAuthError = (
  error: unknown,
): { status: AuthStatus; message: string } => {
  if (error instanceof AppApiError && authStatuses.has(error.code as AuthStatus)) {
    return {
      status: error.code as AuthStatus,
      message: mapAppApiErrorToMessage(error),
    };
  }

  return {
    status: 'unknown_error',
    message: mapAppApiErrorToMessage(error),
  };
};

export const createAuthSlice = (set: SetState): AuthSlice => ({
  authStatus: 'guest',
  authMessage: null,
  isAuthBootstrapped: false,
  user: null,
  login: async (email: string, password: string) => {
    set({ authStatus: 'loading', authMessage: null });

    try {
      const result = await mockApi.authService.login(email, password);
      persistAuth(result);
      set({
        user: result.user,
        authStatus: 'authenticated',
        authMessage: null,
        isAuthBootstrapped: true,
      });
    } catch (error) {
      clearPersistedAuth();
      const { status, message } = resolveAuthError(error);
      set({
        user: null,
        authStatus: status,
        authMessage: message,
        isAuthBootstrapped: true,
      });
      throw error;
    }
  },
  register: async (payload: RegisterPayload) => {
    set({ authStatus: 'loading', authMessage: null });

    try {
      const result = await mockApi.authService.register(payload);
      persistAuth(result);
      set({
        user: result.user,
        authStatus: 'authenticated',
        authMessage: null,
        isAuthBootstrapped: true,
      });
    } catch (error) {
      clearPersistedAuth();
      const { status, message } = resolveAuthError(error);
      set({
        user: null,
        authStatus: status,
        authMessage: message,
        isAuthBootstrapped: true,
      });
      throw error;
    }
  },
  bootstrapAuth: async () => {
    const token = readLocalStorage(storageKeys.authToken);

    if (!token) {
      clearPersistedAuth();
      set({
        authStatus: 'guest',
        authMessage: null,
        user: null,
        isAuthBootstrapped: true,
      });
      return;
    }

    set({
      authStatus: 'loading',
      authMessage: null,
      isAuthBootstrapped: false,
    });

    try {
      const { user } = await mockApi.userProfileService.getCurrentProfile(token);
      persistAuth({ token, user });
      set({
        user,
        authStatus: 'authenticated',
        authMessage: null,
        isAuthBootstrapped: true,
      });
    } catch (error) {
      clearPersistedAuth();
      const { status, message } = resolveAuthError(error);
      set({
        user: null,
        authStatus: status,
        authMessage: message,
        isAuthBootstrapped: true,
        passes: [],
        qrSession: null,
      });
    }
  },
  clearAuthFeedback: () => {
    set((state) => {
      if (
        state.authStatus === 'authenticated' ||
        state.authStatus === 'loading'
      ) {
        return { authMessage: null };
      }

      return { authStatus: 'guest', authMessage: null };
    });
  },
  logout: async () => {
    clearPersistedAuth();
    await mockApi.authService.logout();
    set({
      authStatus: 'guest',
      authMessage: null,
      user: null,
      passes: [],
      qrSession: null,
      isAuthBootstrapped: true,
    });
  },
});
