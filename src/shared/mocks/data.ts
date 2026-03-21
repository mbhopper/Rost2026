import { PASS_STATUSES } from '../../entities/pass/model';
import { QR_STATUSES } from '../../entities/qr/model';
import { USER_STATUSES } from '../../entities/user/model';
import type { PassDto, QrSessionDto, UserDto } from '../api/dto';

export const mockUserDto: UserDto = {
  id: 'user-alex-ivanov',
  employee_id: 'EMP-1042',
  first_name: 'Александр',
  last_name: 'Иванов',
  middle_name: 'Сергеевич',
  email: 'alex.ivanov@futurepass.app',
  phone: '+7 (999) 555-01-42',
  department: 'Platform Engineering',
  position: 'Senior Frontend Engineer',
  avatar_url: 'https://api.dicebear.com/9.x/initials/svg?seed=Alexander%20Ivanov',
  status: USER_STATUSES.ACTIVE,
};

export const mockPassDtos: PassDto[] = [
  {
    pass_id: 'PASS-HQ-01',
    employee_id: 'EMP-1042',
    issued_at: '2026-01-10T08:00:00.000Z',
    expires_at: '2026-12-31T23:59:00.000Z',
    access_level: 'L3 · HQ Office / R&D Floor',
    status: PASS_STATUSES.ACTIVE,
    facility_name: 'FuturePass HQ · Tower A',
    is_blocked: false,
  },
  {
    pass_id: 'PASS-LAB-07',
    employee_id: 'EMP-1042',
    issued_at: '2026-02-01T17:30:00.000Z',
    expires_at: '2026-09-15T20:30:00.000Z',
    access_level: 'L2 · Evening Lab Access',
    status: PASS_STATUSES.PENDING,
    facility_name: 'R&D Lab · Sector C',
    is_blocked: false,
  },
];

export const createMockQrSessionDto = (): QrSessionDto => {
  const createdAt = new Date();
  const expiresAt = new Date(createdAt.getTime() + 10 * 60 * 1000);

  return {
    session_id: `qr-session-${Math.random().toString(36).slice(2, 8)}`,
    qr_value: `FP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
    created_at: createdAt.toISOString(),
    expires_at: expiresAt.toISOString(),
    ttl_seconds: 600,
    status: QR_STATUSES.ACTIVE,
  };
};

export const mockQrSessionDto = createMockQrSessionDto();
