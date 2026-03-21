export const PASS_STATUSES = {
  ACTIVE: 'active',
  EXPIRED: 'expired',
  PENDING: 'pending',
  REVOKED: 'revoked',
  BLOCKED: 'blocked',
} as const;

export type PassStatus = (typeof PASS_STATUSES)[keyof typeof PASS_STATUSES];

export interface DigitalPass {
  passId: string;
  employeeId: string;
  issuedAt: string;
  expiresAt: string;
  accessLevel: string;
  status: PassStatus;
  facilityName: string;
  isBlocked: boolean;
}
