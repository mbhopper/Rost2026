import { AppApiError } from './appApi';

export type MockApiOperation =
  | 'auth.login'
  | 'auth.register'
  | 'auth.logout'
  | 'admin.login'
  | 'admin.overview'
  | 'admin.directory'
  | 'admin.employee'
  | 'admin.registerEmployee'
  | 'request.registration'
  | 'request.support'
  | 'request.list'
  | 'userProfile.getCurrentProfile'
  | 'pass.getPasses'
  | 'qrSession.generate'
  | 'qrSession.expire'
  | 'qrSession.scan'
  | 'qrSession.revoke';

export interface MockApiConfig {
  defaultDelayMs?: number;
  delays?: Partial<Record<MockApiOperation, number>>;
}

const DEFAULT_DELAYS: Record<MockApiOperation, number> = {
  'auth.login': 320,
  'auth.register': 320,
  'auth.logout': 120,
  'admin.login': 320,
  'admin.overview': 180,
  'admin.directory': 220,
  'admin.employee': 140,
  'admin.registerEmployee': 260,
  'request.registration': 220,
  'request.support': 180,
  'request.list': 140,
  'userProfile.getCurrentProfile': 220,
  'pass.getPasses': 120,
  'qrSession.generate': 180,
  'qrSession.expire': 60,
  'qrSession.scan': 80,
  'qrSession.revoke': 80,
};

const normalizeMarker = (value: string) => value.trim().toLowerCase();

const hasMarker = (value: string | null | undefined, marker: string) =>
  Boolean(value && normalizeMarker(value).includes(marker));

const isOfflineByEnvironment = () =>
  typeof navigator !== 'undefined' && 'onLine' in navigator && !navigator.onLine;

export const createMockDelayController = (config: MockApiConfig = {}) => ({
  wait: async (operation: MockApiOperation) => {
    const timeout = config.delays?.[operation] ?? config.defaultDelayMs ?? DEFAULT_DELAYS[operation] ?? 0;
    await new Promise((resolve) => setTimeout(resolve, timeout));
  },
});

export const simulateNetworkFailure = (...values: Array<string | null | undefined>) => {
  if (isOfflineByEnvironment() || values.some((value) => hasMarker(value, 'offline'))) {
    throw new AppApiError('offline');
  }

  if (values.some((value) => hasMarker(value, 'unavailable'))) {
    throw new AppApiError('service_unavailable');
  }

  if (values.some((value) => hasMarker(value, 'unknown'))) {
    throw new AppApiError('unknown_error');
  }
};

export const createMockToken = (email: string) =>
  `mock-token::${email.toLowerCase()}::${Date.now()}`;

export const parseEmailFromMockToken = (token: string): string | null => {
  const [prefix, email] = token.split('::');

  if (prefix !== 'mock-token' || !email) {
    return null;
  }

  return email;
};
