import { PASS_STATUSES } from '../../../entities/pass/model';
import type { PassDto } from '../../api/dto';

export const defaultMockPassDtos: PassDto[] = [
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

export const blockedMockPassDto: PassDto = {
  pass_id: 'PASS-BLOCKED-13',
  employee_id: 'EMP-1042',
  issued_at: '2026-01-15T10:00:00.000Z',
  expires_at: '2026-10-15T10:00:00.000Z',
  access_level: 'L4 · Datacenter Access',
  status: PASS_STATUSES.BLOCKED,
  facility_name: 'Core Datacenter',
  is_blocked: true,
};

export const allMockPassDtos: PassDto[] = [...defaultMockPassDtos, blockedMockPassDto];

export const findMockPassDtoById = (passId: string) =>
  allMockPassDtos.find((pass) => pass.pass_id === passId) ?? null;
