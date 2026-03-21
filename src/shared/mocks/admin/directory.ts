import { PASS_STATUSES } from '../../../entities/pass/model';
import { USER_ROLES, USER_STATUSES, type UserProfile } from '../../../entities/user/model';
import type { AdminEmployeeRecord, AdminOverview } from '../../api/admin/types';
import { mapPassDtoToModel } from '../../api/dto';
import type { PassDto } from '../../api/dto';

type AdminDirectoryUserSeed = Omit<UserProfile, 'fullName' | 'role' | 'middleName'> & {
  middleName?: string;
};

const createUser = (user: AdminDirectoryUserSeed): UserProfile => ({
  ...user,
  middleName: user.middleName ?? '',
  fullName: [user.lastName, user.firstName, user.middleName ?? ''].filter(Boolean).join(' '),
  role: USER_ROLES.USER,
});

const directoryPasses: Record<string, PassDto[]> = {
  'EMP-1042': [
    {
      pass_id: 'PASS-HQ-01',
      employee_id: 'EMP-1042',
      issued_at: '2026-01-10T08:00:00.000Z',
      expires_at: '2026-12-31T23:59:00.000Z',
      access_level: 'L3 · HQ Office / R&D Floor',
      status: PASS_STATUSES.ACTIVE,
      facility_name: 'Ростелеком · Башня А',
      is_blocked: false,
    },
  ],
  'EMP-2088': [
    {
      pass_id: 'PASS-B2-17',
      employee_id: 'EMP-2088',
      issued_at: '2026-02-12T09:30:00.000Z',
      expires_at: '2026-03-21T18:00:00.000Z',
      access_level: 'L2 · B2 Office',
      status: PASS_STATUSES.EXPIRED,
      facility_name: 'Ростелеком · B2',
      is_blocked: false,
    },
  ],
  'EMP-3321': [
    {
      pass_id: 'PASS-SEC-09',
      employee_id: 'EMP-3321',
      issued_at: '2026-01-20T10:00:00.000Z',
      expires_at: '2026-07-20T18:00:00.000Z',
      access_level: 'L4 · Secure zone',
      status: PASS_STATUSES.BLOCKED,
      facility_name: 'Ростелеком · ЦОД',
      is_blocked: true,
    },
  ],
  'EMP-4477': [
    {
      pass_id: 'PASS-GUEST-22',
      employee_id: 'EMP-4477',
      issued_at: '2026-03-01T09:00:00.000Z',
      expires_at: '2026-06-01T18:00:00.000Z',
      access_level: 'L1 · Support office',
      status: PASS_STATUSES.REVOKED,
      facility_name: 'Ростелеком · Поддержка',
      is_blocked: false,
    },
  ],
};

export const adminEmployeeDirectory: AdminEmployeeRecord[] = [
  {
    user: createUser({
      id: 'user-alex-ivanov',
      employeeId: 'EMP-1042',
      firstName: 'Александр',
      lastName: 'Иванов',
      email: 'alex.ivanov@futurepass.app',
      phone: '+7 (999) 555-01-42',
      department: 'Отдел цифровых платформ',
      position: 'Senior frontend engineer',
      avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=alex%20ivanov',
      status: USER_STATUSES.ACTIVE,
    }),
    passes: directoryPasses['EMP-1042'].map(mapPassDtoToModel),
    lastEntryAt: '2026-03-21T08:47:00.000Z',
    location: 'Башня A · Турникет 04',
  },
  {
    user: createUser({
      id: 'user-maria-petrova',
      employeeId: 'EMP-2088',
      firstName: 'Мария',
      lastName: 'Петрова',
      email: 'maria.petrova@futurepass.app',
      phone: '+7 (999) 111-20-88',
      department: 'B2B продажи',
      position: 'Account director',
      avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=maria%20petrova',
      status: USER_STATUSES.ON_LEAVE,
    }),
    passes: directoryPasses['EMP-2088'].map(mapPassDtoToModel),
    lastEntryAt: '2026-03-20T16:10:00.000Z',
    location: 'Башня B2 · Лобби',
  },
  {
    user: createUser({
      id: 'user-dmitry-sokolov',
      employeeId: 'EMP-3321',
      firstName: 'Дмитрий',
      lastName: 'Соколов',
      email: 'd.sokolov@futurepass.app',
      phone: '+7 (999) 222-33-21',
      department: 'Инфраструктура',
      position: 'DevOps engineer',
      avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=dmitry%20sokolov',
      status: USER_STATUSES.SUSPENDED,
    }),
    passes: directoryPasses['EMP-3321'].map(mapPassDtoToModel),
    lastEntryAt: '2026-03-18T21:44:00.000Z',
    location: 'ЦОД · Шлюз 02',
  },
  {
    user: createUser({
      id: 'user-olga-smirnova',
      employeeId: 'EMP-4477',
      firstName: 'Ольга',
      lastName: 'Смирнова',
      email: 'olga.smirnova@futurepass.app',
      phone: '+7 (999) 444-47-77',
      department: 'Контакт-центр',
      position: 'Support lead',
      avatarUrl: 'https://api.dicebear.com/9.x/initials/svg?seed=olga%20smirnova',
      status: USER_STATUSES.ACTIVE,
    }),
    passes: directoryPasses['EMP-4477'].map(mapPassDtoToModel),
    lastEntryAt: '2026-03-19T12:02:00.000Z',
    location: 'Офис поддержки · Вход 1',
  },
];

export const adminOverviewMock: AdminOverview = {
  activeEmployees: 1248,
  activePasses: 1186,
  blockedPasses: 12,
  expiringToday: 39,
  recentAlerts: [
    {
      id: 'alert-1',
      title: 'Резкий рост регенераций QR',
      detail: 'За последние 30 минут 14 пользователей обновили QR повторно.',
      tone: 'warning',
    },
    {
      id: 'alert-2',
      title: 'Заблокирован пропуск EMP-3321',
      detail: 'Блокировка применена вручную оператором СБ.',
      tone: 'danger',
    },
    {
      id: 'alert-3',
      title: 'Синхронизация справочника завершена',
      detail: 'Mock-слой готов к замене на backend adapter без изменения UI.',
      tone: 'info',
    },
  ],
};
