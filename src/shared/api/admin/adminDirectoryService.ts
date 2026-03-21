import { PASS_STATUSES } from '../../../entities/pass/model';
import { USER_ROLES, USER_STATUSES } from '../../../entities/user/model';
import type { AdminDirectoryService } from '../contracts';
import type {
  AdminApproveRegistrationPayload,
  AdminDirectoryFilters,
  AdminEmployeeRegistrationPayload,
  AdminEmployeeRecord,
  AdminOverview,
} from './types';
import type { RegistrationRequest } from '../requests/types';
import { adminEmployeeDirectory, adminOverviewMock } from '../../mocks/admin/directory';
import { createMockDelayController, type MockApiConfig } from '../mockUtils';
import { apiConfig, createAuthorizedRequestInit } from '../config';
import { httpClient } from '../httpClient';
import { readLocalStorage, storageKeys } from '../../config/storage';
import { requestRuntimeStore } from '../../mocks/requests/runtime';

const matchesQuery = (value: string, query: string) =>
  value.toLowerCase().includes(query.toLowerCase());

const matchesFilters = (
  filters: AdminDirectoryFilters = {},
  item: (typeof adminEmployeeDirectory)[number],
) => {
  const query = filters.query?.trim();
  const pass = item.passes[0];

  const queryMatch =
    !query ||
    [
      item.user.fullName,
      item.user.email,
      item.user.employeeId,
      item.user.department,
      pass?.passId ?? '',
    ].some((field) => matchesQuery(field, query));

  const statusMatch =
    !filters.status || filters.status === 'all'
      ? true
      : item.passes.some((entry) => entry.status === filters.status);

  return queryMatch && statusMatch;
};

const createEmployeeId = () => `EMP-${Math.floor(1000 + Math.random() * 9000)}`;
const createPassId = () => `PASS-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;

const createAvatarSeed = (firstName: string, lastName: string) =>
  `https://api.dicebear.com/9.x/initials/svg?seed=${encodeURIComponent(
    `${firstName} ${lastName}`,
  )}`;

const createRecord = (payload: AdminEmployeeRegistrationPayload) => {
  const employeeId = createEmployeeId();
  const passId = createPassId();
  const fullName = [payload.lastName, payload.firstName, payload.middleName ?? '']
    .filter(Boolean)
    .join(' ');

  return {
    user: {
      id: `user-${employeeId.toLowerCase()}`,
      firstName: payload.firstName,
      lastName: payload.lastName,
      middleName: payload.middleName ?? '',
      fullName,
      email: payload.email,
      phone: payload.phone,
      department: payload.department,
      position: payload.position,
      employeeId,
      avatarUrl: createAvatarSeed(payload.firstName, payload.lastName),
      status: USER_STATUSES.ACTIVE,
      role: USER_ROLES.USER,
    },
    passes: [
      {
        passId,
        employeeId,
        issuedAt: new Date().toISOString(),
        expiresAt: new Date('2026-12-31T23:59:00.000Z').toISOString(),
        accessLevel: payload.accessLevel,
        status: PASS_STATUSES.ACTIVE,
        facilityName: payload.facilityName,
        isBlocked: false,
      },
    ],
    lastEntryAt: new Date().toISOString(),
    location: `${payload.facilityName} · Регистрация администратором`,
  };
};

const createQueryString = (filters: AdminDirectoryFilters = {}) => {
  const params = new URLSearchParams();

  if (filters.query?.trim()) {
    params.set('query', filters.query.trim());
  }

  if (filters.status && filters.status !== 'all') {
    params.set('status', filters.status);
  }

  const query = params.toString();
  return query ? `?${query}` : '';
};

const buildQueueActionPath = (requestId: string) =>
  `${apiConfig.endpoints.adminRegistrationQueue}/${encodeURIComponent(requestId)}/process`;

const createAuthInit = (init: RequestInit = {}) =>
  createAuthorizedRequestInit(readLocalStorage(storageKeys.authToken), init);

const persistRegisteredRecord = (record: AdminEmployeeRecord) => {
  adminEmployeeDirectory.unshift(record);
  adminOverviewMock.activeEmployees += 1;
  adminOverviewMock.activePasses += 1;
  adminOverviewMock.recentAlerts.unshift({
    id: `alert-${Date.now()}`,
    title: `Зарегистрирован ${record.user.employeeId}`,
    detail: `${record.user.fullName} добавлен в каталог и получил активный пропуск.`,
    tone: 'info',
  });
  adminOverviewMock.recentAlerts = adminOverviewMock.recentAlerts.slice(0, 5);
};

const processRegistrationRequest = async (
  requestId: string,
  employeeId: string,
): Promise<RegistrationRequest> =>
  httpClient.post<RegistrationRequest>(
    buildQueueActionPath(requestId),
    {
      employeeId,
      status: 'approved',
    },
    createAuthInit(),
  );

export const createHttpAdminDirectoryService = (): AdminDirectoryService => ({
  getOverview() {
    return httpClient.get<AdminOverview>(apiConfig.endpoints.adminOverview, createAuthInit());
  },
  getEmployees(filters = {}) {
    return httpClient.get<AdminEmployeeRecord[]>(
      `${apiConfig.endpoints.adminEmployees}${createQueryString(filters)}`,
      createAuthInit(),
    );
  },
  getEmployeeById(employeeId) {
    return httpClient.get<AdminEmployeeRecord | null>(
      `${apiConfig.endpoints.adminEmployees}/${encodeURIComponent(employeeId)}`,
      createAuthInit(),
    );
  },
  getRegistrationRequests() {
    return httpClient.get<RegistrationRequest[]>(
      apiConfig.endpoints.adminRegistrationQueue,
      createAuthInit(),
    );
  },
  registerEmployee(payload) {
    return httpClient.post<AdminEmployeeRecord>(
      apiConfig.endpoints.adminEmployees,
      payload,
      createAuthInit(),
    );
  },
  async approveRegistrationRequest(payload) {
    const record = await httpClient.post<AdminEmployeeRecord>(
      apiConfig.endpoints.adminEmployees,
      payload,
      createAuthInit(),
    );

    await processRegistrationRequest(payload.requestId, record.user.employeeId);

    return record;
  },
});

export const createMockAdminDirectoryService = (
  config: MockApiConfig = {},
): AdminDirectoryService => {
  const delay = createMockDelayController(config);

  return {
    async getOverview() {
      await delay.wait('admin.overview');
      return adminOverviewMock;
    },
    async getEmployees(filters = {}) {
      await delay.wait('admin.directory');
      return adminEmployeeDirectory.filter((item) => matchesFilters(filters, item));
    },
    async getEmployeeById(employeeId) {
      await delay.wait('admin.employee');
      return (
        adminEmployeeDirectory.find((item) => item.user.employeeId === employeeId) ??
        null
      );
    },
    async getRegistrationRequests() {
      await delay.wait('admin.registrationQueue');
      return requestRuntimeStore.getRegistrationRequests();
    },
    async registerEmployee(payload) {
      await delay.wait('admin.registerEmployee');

      const record = createRecord(payload as AdminEmployeeRegistrationPayload);
      persistRegisteredRecord(record);

      return record;
    },
    async approveRegistrationRequest(payload: AdminApproveRegistrationPayload) {
      await delay.wait('admin.approveRegistrationRequest');

      const record = createRecord(payload);
      persistRegisteredRecord(record);

      const request = requestRuntimeStore.processRegistrationRequest(
        payload.requestId,
        record.user.employeeId,
      );

      if (!request) {
        throw new Error('Registration request not found');
      }

      return record;
    },
  };
};
