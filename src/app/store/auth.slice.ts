import {
  authApi,
  AuthApiError,
  type AuthErrorCode,
} from '../../shared/api/auth';
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

const authMessages: Record<AuthErrorCode, string> = {
  auth_error: 'Не удалось выполнить вход. Проверьте email и пароль.',
  session_expired: 'Сессия истекла. Войдите заново, чтобы продолжить.',
  service_unavailable:
    'Сервис авторизации временно недоступен. Попробуйте позже.',
};

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
  if (error instanceof AuthApiError) {
    return {
      status: error.code,
      message: authMessages[error.code] ?? error.message,
    };
  }

  return {
    status: 'service_unavailable',
    message: authMessages.service_unavailable,
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
      const result = await authApi.login(email, password);
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
      const result = await authApi.register(payload);
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
      const user = await authApi.getCurrentUser(token);
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
    await authApi.logout();
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
