import type { QrSession } from '../../../entities/qr/model';
import { QR_STATUSES } from '../../../entities/qr/model';
import { QR_SESSION_TTL_SECONDS } from '../../../shared/config/qr';

interface GenerateQrSessionParams {
  employeeId: string;
  passId: string;
  ttlSeconds?: number;
}

const delay = async (ms = 180) =>
  new Promise((resolve) => setTimeout(resolve, ms));

const createSessionId = () =>
  `qr-session-${Math.random().toString(36).slice(2, 10)}`;

const createMockSignature = (sessionId: string) => `mock-signature:${sessionId}`;

const createQrValue = ({
  employeeId,
  passId,
  sessionId,
  timestamp,
}: {
  employeeId: string;
  passId: string;
  sessionId: string;
  timestamp: string;
}) =>
  JSON.stringify({
    employeeId,
    passId,
    sessionId,
    timestamp,
    mockSignature: createMockSignature(sessionId),
  });

export async function generateQrSession({
  employeeId,
  passId,
  ttlSeconds = QR_SESSION_TTL_SECONDS,
}: GenerateQrSessionParams): Promise<QrSession> {
  await delay();

  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + ttlSeconds * 1000);
  const sessionId = createSessionId();

  return {
    sessionId,
    employeeId,
    passId,
    qrValue: createQrValue({
      employeeId,
      passId,
      sessionId,
      timestamp: createdAt.toISOString(),
    }),
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
    ttlSeconds,
    status: QR_STATUSES.ACTIVE,
    scannedAt: null,
    revokedAt: null,
  };
}

export async function expireQrSession(session: QrSession): Promise<QrSession> {
  await delay(60);

  return {
    ...session,
    status: QR_STATUSES.EXPIRED,
    ttlSeconds: 0,
  };
}

export async function markQrAsScanned(session: QrSession): Promise<QrSession> {
  await delay(80);

  return {
    ...session,
    status: QR_STATUSES.SCANNED,
    ttlSeconds: 0,
    scannedAt: new Date().toISOString(),
  };
}

export async function revokeQrSession(session: QrSession): Promise<QrSession> {
  await delay(80);

  return {
    ...session,
    status: QR_STATUSES.BLOCKED,
    ttlSeconds: 0,
    revokedAt: new Date().toISOString(),
  };
}

export function restoreQrSession(session: QrSession): QrSession {
  const expiresAtMs = new Date(session.expiresAt).getTime();
  const remainingSeconds = Math.max(
    0,
    Math.ceil((expiresAtMs - Date.now()) / 1000),
  );

  if (session.status === QR_STATUSES.ACTIVE && remainingSeconds === 0) {
    return {
      ...session,
      status: QR_STATUSES.EXPIRED,
      ttlSeconds: 0,
    };
  }

  return {
    ...session,
    ttlSeconds:
      session.status === QR_STATUSES.ACTIVE ? remainingSeconds : session.ttlSeconds,
  };
}
