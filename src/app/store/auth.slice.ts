import { USER_ROLES, type UserRole } from '../../entities/user/model';
import { api } from '../../shared/api/auth';
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
  writeLocalStorage(storageKeys.authRole, user.role);
  writeSessionStorage(storageKeys.authSession, JSON.stringify(user));
};

const clearPersistedAuth = () => {
  removeLocalStorage(storageKeys.authToken);
  removeLocalStorage(storageKeys.authRole);
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

const setAuthenticatedState = (set: SetState, result: AuthResult) => {
  persistAuth(result);
  set({
    user: result.user,
    currentRole: result.user.role,
    authStatus: 'authenticated',
    authMessage: null,
    isAuthBootstrapped: true,
  });
};

const handleAuthFailure = (set: SetState, error: unknown) => {
  clearPersistedAuth();
  const { status, message } = resolveAuthError(error);
  set({
    user: null,
    currentRole: null,
    authStatus: status,
    authMessage: message,
    isAuthBootstrapped: true,
    passes: [],
    qrSession: null,
  });
};

const assertRole = (role: UserRole | null): role is UserRole =>
  role === USER_ROLES.USER || role === USER_ROLES.ADMIN;

export const createAuthSlice = (set: SetState): AuthSlice => ({
  authStatus: 'guest',
  authMessage: null,
  isAuthBootstrapped: false,
  user: null,
  currentRole: null,
  login: async (email: string, password: string) => {
    set({ authStatus: 'loading', authMessage: null });

    try {
      const result = await api.authService.login(email, password);
      setAuthenticatedState(set, result);
    } catch (error) {
      handleAuthFailure(set, error);
      throw error;
    }
  },
  loginAdmin: async (email: string, password: string) => {
    set({ authStatus: 'loading', authMessage: null });

    try {
      const result = await api.adminAuthService.login(email, password);
      setAuthenticatedState(set, result);
    } catch (error) {
      handleAuthFailure(set, error);
      throw error;
    }
  },
  register: async (payload: RegisterPayload) => {
    set({ authStatus: 'loading', authMessage: null });

    try {
      const result = await api.authService.register(payload);
      setAuthenticatedState(set, result);
    } catch (error) {
      handleAuthFailure(set, error);
      throw error;
    }
  },
  bootstrapAuth: async () => {
    const token = readLocalStorage(storageKeys.authToken);
    const role = readLocalStorage(storageKeys.authRole) as UserRole | null;

    if (!token || !assertRole(role)) {
      clearPersistedAuth();
      set({
        authStatus: 'guest',
        authMessage: null,
        user: null,
        currentRole: null,
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
      const { user } = await api.userProfileService.getCurrentProfile(token);
      persistAuth({ token, user });
      set({
        user,
        currentRole: user.role,
        authStatus: 'authenticated',
        authMessage: null,
        isAuthBootstrapped: true,
      });
    } catch (error) {
      handleAuthFailure(set, error);
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
    await api.authService.logout();
    set({
      authStatus: 'guest',
      authMessage: null,
      user: null,
      currentRole: null,
      passes: [],
      qrSession: null,
      isAuthBootstrapped: true,
    });
  },
});
