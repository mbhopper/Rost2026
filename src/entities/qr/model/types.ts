export const QR_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  ROTATED: 'rotated',
  BLOCKED: 'blocked',
} as const;

export type QrStatus = (typeof QR_STATUSES)[keyof typeof QR_STATUSES];

export interface QrSession {
  sessionId: string;
  qrValue: string;
  createdAt: string;
  expiresAt: string;
  ttlSeconds: number;
  status: QrStatus;
}
