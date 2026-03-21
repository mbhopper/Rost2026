import { useEffect, type PropsWithChildren } from 'react';
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
  const loadPasses = useAppStore((state) => state.loadPasses);
  const loadQrSession = useAppStore((state) => state.loadQrSession);

  useEffect(() => {
    void bootstrapAuth();
  }, [bootstrapAuth]);

  useEffect(() => {
    if (!isAuthBootstrapped || authStatus !== 'authenticated') {
      return;
    }

    void Promise.all([loadPasses(), loadQrSession()]);
  }, [authStatus, isAuthBootstrapped, loadPasses, loadQrSession]);

  return null;
}

function SettingsEffects() {
  const settings = useAppStore((state) => state.settings);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    const resolvedTheme = resolveTheme(settings.themeMode);

    root.dataset.themeMode = settings.themeMode;
    root.dataset.theme = resolvedTheme;
    root.style.colorScheme = resolvedTheme;
    root.dataset.secureScreen = String(settings.secureScreenMode);
    body.dataset.demoMode = String(settings.demoMode);

    if (settings.themeMode !== 'system' || typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
      return;
    }

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const updateTheme = () => {
      const nextTheme = mediaQuery.matches ? 'dark' : 'light';
      root.dataset.theme = nextTheme;
      root.style.colorScheme = nextTheme;
    };

    updateTheme();
    mediaQuery.addEventListener('change', updateTheme);

    return () => {
      mediaQuery.removeEventListener('change', updateTheme);
    };
  }, [settings.demoMode, settings.secureScreenMode, settings.themeMode]);

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
