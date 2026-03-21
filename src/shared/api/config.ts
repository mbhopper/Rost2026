const trimTrailingSlash = (value: string) => value.replace(/\/+$/, '');
const trimLeadingSlash = (value: string) => value.replace(/^\/+/, '');

const resolveBaseUrl = () => {
  const explicitBaseUrl = import.meta.env.VITE_API_BASE_URL?.trim();

  if (explicitBaseUrl) {
    return trimTrailingSlash(explicitBaseUrl);
  }

  const explicitOrigin = import.meta.env.VITE_API_ORIGIN?.trim();
  const explicitPrefix = import.meta.env.VITE_API_PREFIX?.trim() ?? '/api';

  if (explicitOrigin) {
    return `${trimTrailingSlash(explicitOrigin)}/${trimLeadingSlash(explicitPrefix)}`;
  }

  return explicitPrefix.startsWith('/') ? explicitPrefix : `/${explicitPrefix}`;
};

export interface ApiEndpointConfig {
  authLogin: string;
  adminLogin: string;
  authRegister: string;
  authLogout: string;
  authProfile: string;
  passes: string;
  qrSessions: string;
  adminOverview: string;
  adminEmployees: string;
  registrationRequests: string;
  supportRequests: string;
  adminRegistrationQueue: string;
}

export interface ApiRuntimeConfig {
  baseUrl: string;
  timeoutMs: number;
  defaultHeaders: HeadersInit;
  endpoints: ApiEndpointConfig;
}

export const apiConfig: ApiRuntimeConfig = {
  baseUrl: resolveBaseUrl(),
  timeoutMs: Number(import.meta.env.VITE_API_TIMEOUT_MS ?? 15000),
  defaultHeaders: {
    Accept: 'application/json',
  },
  endpoints: {
    authLogin: '/auth/login',
    adminLogin: '/admin/auth/login',
    authRegister: '/auth/register',
    authLogout: '/auth/logout',
    authProfile: '/auth/me',
    passes: '/passes',
    qrSessions: '/qr-sessions',
    adminOverview: '/admin/directory/overview',
    adminEmployees: '/admin/employees',
    registrationRequests: '/requests/registration',
    supportRequests: '/requests/support',
    adminRegistrationQueue: '/admin/registration-requests',
  },
};

export const resolveApiUrl = (path: string) => {
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  return apiConfig.baseUrl.startsWith('http')
    ? `${apiConfig.baseUrl}${normalizedPath}`
    : `${apiConfig.baseUrl}${normalizedPath}`;
};

export const createAuthorizedRequestInit = (
  token: string | null | undefined,
  init: globalThis.RequestInit = {},
): globalThis.RequestInit => {
  if (!token) {
    return init;
  }

  const headers = new Headers(init.headers ?? undefined);
  headers.set('Authorization', `Bearer ${token}`);

  return {
    ...init,
    headers,
  };
};
