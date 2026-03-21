import { describe, expect, it } from 'vitest';
import { QR_SESSION_TTL_SECONDS } from '../../../shared/config/qr';
import { QR_STATUSES } from '../../../entities/qr/model';
import {
  expireQrSession,
  generateQrSession,
  markQrAsScanned,
  restoreQrSession,
  revokeQrSession,
} from './qrSession.service';

describe('qrSession.service', () => {
  it('generates a mock QR payload with employee and pass metadata', async () => {
    const session = await generateQrSession({
      employeeId: 'EMP-1042',
      passId: 'PASS-HQ-01',
    });

    const payload = JSON.parse(session.qrValue) as Record<string, string>;

    expect(session.status).toBe(QR_STATUSES.ACTIVE);
    expect(session.ttlSeconds).toBe(QR_SESSION_TTL_SECONDS);
    expect(payload.employeeId).toBe('EMP-1042');
    expect(payload.passId).toBe('PASS-HQ-01');
    expect(payload.sessionId).toBe(session.sessionId);
    expect(payload.mockSignature).toContain(session.sessionId);
  });

  it('moves session through expire, scan and revoke mock transitions', async () => {
    const active = await generateQrSession({
      employeeId: 'EMP-1042',
      passId: 'PASS-HQ-01',
    });

    const expired = await expireQrSession(active);
    const scanned = await markQrAsScanned(active);
    const revoked = await revokeQrSession(active);

    expect(expired.status).toBe(QR_STATUSES.EXPIRED);
    expect(scanned.status).toBe(QR_STATUSES.SCANNED);
    expect(scanned.scannedAt).not.toBeNull();
    expect(revoked.status).toBe(QR_STATUSES.BLOCKED);
    expect(revoked.revokedAt).not.toBeNull();
  });

  it('restores persisted active session with recalculated ttl and expires stale sessions', () => {
    const future = new Date(Date.now() + 45_000).toISOString();
    const past = new Date(Date.now() - 5_000).toISOString();

    const restored = restoreQrSession({
      sessionId: 'future-session',
      employeeId: 'EMP-1042',
      passId: 'PASS-HQ-01',
      qrValue: '{"ok":true}',
      createdAt: new Date().toISOString(),
      expiresAt: future,
      ttlSeconds: QR_SESSION_TTL_SECONDS,
      status: QR_STATUSES.ACTIVE,
      scannedAt: null,
      revokedAt: null,
    });

    const expired = restoreQrSession({
      ...restored,
      sessionId: 'expired-session',
      expiresAt: past,
    });

    expect(restored.ttlSeconds).toBeLessThanOrEqual(45);
    expect(restored.ttlSeconds).toBeGreaterThan(0);
    expect(expired.status).toBe(QR_STATUSES.EXPIRED);
    expect(expired.ttlSeconds).toBe(0);
  });
});
