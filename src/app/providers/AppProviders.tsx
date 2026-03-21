import { useEffect, type PropsWithChildren } from 'react';
import { USER_ROLES } from '../../entities/user/model';
import { useAppStore } from '../store';

function resolveTheme(themeMode: 'system' | 'dark' | 'light') {
  if (themeMode !== 'system') {
    return themeMode;
  }

  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'dark';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function BootstrapStore() {
  const authStatus = useAppStore((state) => state.authStatus);
  const bootstrapAuth = useAppStore((state) => state.bootstrapAuth);
  const isAuthBootstrapped = useAppStore((state) => state.isAuthBootstrapped);
  const currentRole = useAppStore((state) => state.currentRole);
  const loadPasses = useAppStore((state) => state.loadPasses);
  const loadQrSession = useAppStore((state) => state.loadQrSession);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    if (
      !isAuthBootstrapped ||
      authStatus !== 'authenticated' ||
      currentRole !== USER_ROLES.USER
    ) {
      return;
    }

    void Promise.all([loadPasses(), loadQrSession()]);
  }, [authStatus, currentRole, isAuthBootstrapped, loadPasses, loadQrSession]);

  return null;
}

function SettingsEffects() {
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const root = document.documentElement;
    const body = document.body;
    const resolvedTheme = resolveTheme(settings.themeMode);

    root.dataset.theme = resolvedTheme;
    body.dataset.secureScreen = String(settings.secureScreenMode);
  }, [settings.secureScreenMode, settings.themeMode]);

  return null;
}

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <BootstrapStore />
      <SettingsEffects />
      {children}
    </>
  );
}
