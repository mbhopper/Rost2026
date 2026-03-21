import { useCallback, useEffect, useMemo, useState } from 'react';
import { QR_STATUSES, type QrSession } from '../../../entities/qr/model';
import { useAppStore } from '../../../app/store';
import { useSecureView } from '../../secure-view/useSecureView';

export type QrScreenState = 'inactive' | 'unavailable' | 'used' | 'active' | 'expired' | 'regenerating' | 'blocked';

const ACTIVE_TICK_MS = 1000;

export function useQrSessionController() {
  const authStatus = useAppStore((state) => state.authStatus);
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const qrSession = useAppStore((state) => state.qrSession);
  const secureScreenMode = useAppStore((state) => state.settings.secureScreenMode);
  const generateSession = useAppStore((state) => state.generateQrSession);
  const rotateSession = useAppStore((state) => state.rotateQrSession);
  const expireSession = useAppStore((state) => state.expireQrSession);
  const scanSession = useAppStore((state) => state.markQrAsScanned);
  const revokeSession = useAppStore((state) => state.revokeQrSession);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(qrSession),
  );

  const secureView = useSecureView({
    enabled: secureScreenMode,
    inactivityTimeoutMs: 15_000,
  });

  const activePass = useMemo(
    () =>
      passes.find((item) => item.status === 'active' && !item.isBlocked) ?? null,
    [passes],
  );

  const isUnavailable = authStatus !== 'authenticated' || !user || !activePass;

  useEffect(() => {
    setRemainingSeconds(getRemainingSeconds(qrSession));
  }, [qrSession]);

  useEffect(() => {
    if (!qrSession || qrSession.status !== QR_STATUSES.ACTIVE) {
      return;
    }

    const updateCountdown = () => {
      const nextRemainingSeconds = getRemainingSeconds(qrSession);
      setRemainingSeconds(nextRemainingSeconds);

      if (nextRemainingSeconds === 0) {
        void expireSession();
      }
    };

    updateCountdown();

    const intervalId = window.setInterval(updateCountdown, ACTIVE_TICK_MS);

    return () => {
      window.clearInterval(intervalId);
    };
  }, [expireSession, qrSession]);

  const generate = useCallback(async () => {
    if (!user || !activePass) {
      return;
    }

    await generateSession({ employeeId: user.employeeId, passId: activePass.passId });
    secureView.reveal();
  }, [activePass, generateSession, secureView, user]);

  const regenerate = useCallback(async () => {
    if (!user || !activePass) {
      return;
    }

    await rotateSession({ employeeId: user.employeeId, passId: activePass.passId });
    secureView.reveal();
  }, [activePass, rotateSession, secureView, user]);

  const scanDemo = useCallback(async () => {
    await scanSession();
    secureView.mask();
  }, [scanSession, secureView]);

  const revoke = useCallback(async () => {
    await revokeSession();
    secureView.mask();
  }, [revokeSession, secureView]);

  const state: QrScreenState = useMemo(() => {
    if (isUnavailable) {
      return 'unavailable';
    }

    if (!qrSession) {
      return 'inactive';
    }

    if (qrSession.status === QR_STATUSES.SCANNED) {
      return 'used';
    }

    return qrSession.status;
  }, [isUnavailable, qrSession]);

  return {
    activePass,
    generate,
    isScreenMasked: secureView.isMasked,
    qrSession,
    regenerate,
    remainingSeconds,
    revealSecureContent: secureView.reveal,
    revoke,
    scanDemo,
    secureViewProps: secureView.secureProps,
    state,
    watermarkLabel: user ? `${user.employeeId} · ${user.email}` : 'защищённый экран',
  };
}

function getRemainingSeconds(session: QrSession | null) {
  if (!session || session.status !== QR_STATUSES.ACTIVE) {
    return 0;
  }

  return Math.max(
    0,
    Math.ceil((new Date(session.expiresAt).getTime() - Date.now()) / 1000),
  );
}
