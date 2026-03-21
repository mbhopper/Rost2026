import type { AdminDirectoryService } from '../contracts';
import type { AdminDirectoryFilters } from './types';
import { adminEmployeeDirectory, adminOverviewMock } from '../../mocks/admin/directory';
import { createMockDelayController, type MockApiConfig } from '../mockUtils';

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
  };
};
