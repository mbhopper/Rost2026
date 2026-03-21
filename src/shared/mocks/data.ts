import type { DigitalPass } from '../../entities/pass/model';
import { PASS_STATUSES } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import { QR_SESSION_STATUSES } from '../../entities/qr/model';
import type { UserProfile } from '../../entities/user/model';
import { USER_STATUSES } from '../../entities/user/model';

export const mockUser: UserProfile = {
  id: 'emp-1042',
  name: 'Александр Иванов',
  email: 'alex@futurepass.app',
  city: 'Москва',
  membershipLevel: 'Priority',
  department: 'Platform Engineering',
  position: 'Frontend engineer',
  status: USER_STATUSES.ACTIVE,
};

export const mockPasses: DigitalPass[] = [
  {
    id: 'office-core',
    title: 'Основной пропуск HQ',
    zone: 'Башня А · 1-12 этажи',
    status: PASS_STATUSES.ACTIVE,
    validUntil: '2026-12-31T23:59:00.000Z',
    sessionsLeft: 14,
    format: 'NFC + QR',
  },
  {
    id: 'lab-night',
    title: 'Лаборатория / вечерний доступ',
    zone: 'R&D Lab · после 19:00',
    status: PASS_STATUSES.PENDING,
    validUntil: '2026-09-15T20:30:00.000Z',
    sessionsLeft: 4,
    format: 'QR only',
  },
];

export const mockQrSession: QrSession = {
  id: 'qr-session-1',
  code: 'FP-2026-ALX-77A1',
  expiresAt: new Date(Date.now() + 12 * 60 * 1000).toISOString(),
  location: 'Checkpoint C / turnstile 04',
  status: QR_SESSION_STATUSES.ACTIVE,
};
