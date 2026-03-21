import { useEffect, type PropsWithChildren } from 'react';
import { useAppStore } from '../store';

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

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <>
      <BootstrapStore />
      {children}
    </>
  );
}
