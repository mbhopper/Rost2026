import { useCallback, useEffect, useMemo, useState } from 'react';
import { QR_STATUSES, type QrSession } from '../../../entities/qr/model';
import { useAppStore } from '../../../app/store';

export type QrScreenState =
  | 'inactive'
  | 'unavailable'
  | QrSession['status'];

const ACTIVE_TICK_MS = 1000;

export function useQrSessionController() {
  const authStatus = useAppStore((state) => state.authStatus);
  const user = useAppStore((state) => state.user);
  const passes = useAppStore((state) => state.passes);
  const qrSession = useAppStore((state) => state.qrSession);
  const generateSession = useAppStore((state) => state.generateQrSession);
  const rotateSession = useAppStore((state) => state.rotateQrSession);
  const expireSession = useAppStore((state) => state.expireQrSession);
  const scanSession = useAppStore((state) => state.markQrAsScanned);
  const revokeSession = useAppStore((state) => state.revokeQrSession);

  const [isScreenMasked, setIsScreenMasked] = useState(false);
  const [remainingSeconds, setRemainingSeconds] = useState(() =>
    getRemainingSeconds(qrSession),
  );

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

  useEffect(() => {
    // Browser-only best-effort safeguard: true screenshot prevention requires a
    // native shell / OS integration, so here we only mask the QR while hidden.
    const maskScreen = () => setIsScreenMasked(true);
    const unmaskScreen = () => {
      if (document.visibilityState === 'visible' && document.hasFocus()) {
        setIsScreenMasked(false);
      }
    };
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'hidden') {
        maskScreen();
        return;
      }

      unmaskScreen();
    };

    window.addEventListener('blur', maskScreen);
    window.addEventListener('focus', unmaskScreen);
    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      window.removeEventListener('blur', maskScreen);
      window.removeEventListener('focus', unmaskScreen);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const generate = useCallback(async () => {
    if (!user || !activePass) {
      return;
    }

    await generateSession({ employeeId: user.employeeId, passId: activePass.passId });
  }, [activePass, generateSession, user]);

  const regenerate = useCallback(async () => {
    if (!user || !activePass) {
      return;
    }

    await rotateSession({ employeeId: user.employeeId, passId: activePass.passId });
  }, [activePass, rotateSession, user]);

  const scanDemo = useCallback(async () => {
    await scanSession();
  }, [scanSession]);

  const revoke = useCallback(async () => {
    await revokeSession();
  }, [revokeSession]);

  const state: QrScreenState = useMemo(() => {
    if (isUnavailable) {
      return 'unavailable';
    }

    if (!qrSession) {
      return 'inactive';
    }

    return qrSession.status;
  }, [isUnavailable, qrSession]);

  return {
    activePass,
    generate,
    isScreenMasked,
    qrSession,
    regenerate,
    remainingSeconds,
    revoke,
    scanDemo,
    state,
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
