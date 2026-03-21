export const QR_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  SCANNED: 'scanned',
  REGENERATING: 'regenerating',
  BLOCKED: 'blocked',
} as const;

export type QrStatus = (typeof QR_STATUSES)[keyof typeof QR_STATUSES];

export interface QrSession {
  sessionId: string;
  employeeId: string;
  passId: string;
  qrValue: string;
  createdAt: string;
  expiresAt: string;
  ttlSeconds: number;
  status: QrStatus;
  scannedAt: string | null;
  revokedAt: string | null;
}
