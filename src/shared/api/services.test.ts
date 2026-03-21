/// <reference path="../../test/vitest.d.ts" />
import { describe, expect, it } from 'vitest';
import { AppApiError, mapAppApiErrorToMessage } from './appApi';
import { createMockApiAdapters } from './mockApi';

const registerPayload = {
  firstName: 'Ирина',
  lastName: 'Петрова',
  middleName: 'Андреевна',
  email: 'irina.petrova@futurepass.app',
  phone: '+7 (999) 555-44-11',
  department: 'Security',
  position: 'Analyst',
  password: 'future-pass',
  confirmPassword: 'future-pass',
};

describe('mock API services', () => {
  it('returns typed user and admin auth results', async () => {
    const api = createMockApiAdapters({ defaultDelayMs: 0, delays: {} });

    const authResult = await api.authService.login(
      'alex.ivanov@futurepass.app',
      'future-pass',
    );
    const adminResult = await api.adminAuthService.login(
      'admin@futurepass.app',
      'admin-pass',
    );
    const passResult = await api.passService.getPasses();

    expect(authResult.user.role).toBe('user');
    expect(adminResult.user.role).toBe('admin');
    expect(passResult.passes).toHaveLength(2);
  });

  it('supports admin directory filters and employee details', async () => {
    const api = createMockApiAdapters({ defaultDelayMs: 0, delays: {} });

    const blockedUsers = await api.adminDirectoryService.getEmployees({ status: 'blocked' });
    const employee = await api.adminDirectoryService.getEmployeeById('EMP-1042');

    expect(blockedUsers).toHaveLength(1);
    expect(employee?.user.email).toBe('alex.ivanov@futurepass.app');
  });

  it('simulates common API failures with a shared error type', async () => {
    const api = createMockApiAdapters({ defaultDelayMs: 0, delays: {} });

    await expect(
      api.authService.login('alex.ivanov@futurepass.app', 'wrong-password'),
    ).rejects.toMatchObject<AppApiError>({ code: 'invalid_credentials' });

    await expect(
      api.authService.register({
        ...registerPayload,
        email: 'offline.user@futurepass.app',
      }),
    ).rejects.toMatchObject<AppApiError>({ code: 'offline' });

    await expect(
      api.qrSessionService.generateQrSession('EMP-1042', 'PASS-BLOCKED-13'),
    ).rejects.toMatchObject<AppApiError>({ code: 'pass_blocked' });

    await expect(
      api.userProfileService.getCurrentProfile('expired-token'),
    ).rejects.toMatchObject<AppApiError>({ code: 'session_expired' });
  });

  it('maps shared API errors to user-friendly messages', () => {
    expect(mapAppApiErrorToMessage(new AppApiError('service_unavailable'))).toContain(
      'временно недоступен',
    );
    expect(mapAppApiErrorToMessage(new Error('boom'))).toContain(
      'непредвиденная ошибка',
    );
  });
});
