import type { ReactElement } from 'react';
import { render } from '@testing-library/react';
import { AppRouter } from '../../src/app/router/AppRouter';
import { useAppStore } from '../../src/app/store';
import { mapPassDtoToModel, mapUserDtoToModel } from '../../src/shared/api/dto';
import { defaultMockPassDtos } from '../../src/shared/mocks/pass/passes';
import { mockUserDto } from '../../src/shared/mocks/auth/user';
import { QR_STATUSES, type QrSession } from '../../src/entities/qr/model';
import type { AppStore } from '../../src/app/store';

const initialStore = useAppStore.getState();

const cloneState = (state: AppStore): AppStore => ({
  ...state,
  passes: [...state.passes],
  settings: { ...state.settings },
  user: state.user ? { ...state.user } : null,
  qrSession: state.qrSession ? { ...state.qrSession } : null,
});

export const resetAppStore = (overrides: Partial<AppStore> = {}) => {
  const nextState = cloneState(initialStore);
  useAppStore.setState(
    {
      ...nextState,
      ...overrides,
      passes: overrides.passes ? [...overrides.passes] : nextState.passes,
      settings: overrides.settings
        ? { ...nextState.settings, ...overrides.settings }
        : nextState.settings,
      user: overrides.user ? { ...overrides.user } : nextState.user,
      qrSession: overrides.qrSession
        ? { ...overrides.qrSession }
        : overrides.qrSession === null
          ? null
          : nextState.qrSession,
    },
    true,
  );
};

export const clearBrowserState = () => {
  window.localStorage.clear();
  window.sessionStorage.clear();
  window.location.hash = '#/';
};

export const createAuthenticatedState = (
  overrides: Partial<AppStore> = {},
): Partial<AppStore> => ({
  authStatus: 'authenticated',
  authMessage: null,
  isAuthBootstrapped: true,
  user: mapUserDtoToModel(mockUserDto),
  passes: defaultMockPassDtos.map(mapPassDtoToModel),
  qrSession: null,
  ...overrides,
});

export const createQrSessionFixture = (
  overrides: Partial<QrSession> = {},
): QrSession => {
  const createdAt = overrides.createdAt ?? new Date('2026-03-21T10:00:00.000Z');
  const expiresAt =
    overrides.expiresAt ??
    new Date(new Date(createdAt).getTime() + 5_000).toISOString();

  return {
    sessionId: 'qr-session-test-01',
    employeeId: 'EMP-1042',
    passId: 'PASS-HQ-01',
    qrValue: '{"sessionId":"qr-session-test-01"}',
    createdAt: new Date(createdAt).toISOString(),
    expiresAt,
    ttlSeconds: 5,
    status: QR_STATUSES.ACTIVE,
    scannedAt: null,
    revokedAt: null,
    ...overrides,
  };
};

export const renderWithRouter = (ui: ReactElement = <AppRouter />) => render(ui);
