import { useEffect, type PropsWithChildren } from 'react';
import { useAppStore } from '../store';

function BootstrapStore() {
  const loadPasses = useAppStore((state) => state.loadPasses);
  const loadQrSession = useAppStore((state) => state.loadQrSession);

  useEffect(() => {
    void Promise.all([loadPasses(), loadQrSession()]);
  }, [loadPasses, loadQrSession]);

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
