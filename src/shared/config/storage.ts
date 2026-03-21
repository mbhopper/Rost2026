export const storageKeys = {
  authToken: 'auth_token',
  authSession: 'auth_session',
  qrSession: 'qr_session',
  appSettings: 'app_settings',
} as const;

const isBrowser = typeof window !== 'undefined';

export function readLocalStorage(key: string): string | null {
  if (!isBrowser) {
    return null;
  }

  return window.localStorage.getItem(key);
}

export function writeLocalStorage(key: string, value: string) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.setItem(key, value);
}

export function removeLocalStorage(key: string) {
  if (!isBrowser) {
    return;
  }

  window.localStorage.removeItem(key);
}

export function readSessionStorage(key: string): string | null {
  if (!isBrowser) {
    return null;
  }

  return window.sessionStorage.getItem(key);
}

export function writeSessionStorage(key: string, value: string) {
  if (!isBrowser) {
    return;
  }

  window.sessionStorage.setItem(key, value);
}

export function removeSessionStorage(key: string) {
  if (!isBrowser) {
    return;
  }

  window.sessionStorage.removeItem(key);
}
