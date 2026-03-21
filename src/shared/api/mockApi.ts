import type { ApiServices } from './contracts';
import { createMockAdminDirectoryService } from './admin/adminDirectoryService';
import { createMockAdminAuthService, createMockAuthService } from './authService';
import { createMockPassService } from './passService';
import { createMockQrSessionService } from './qrSessionService';
import { createMockRequestService } from './requests/requestService';
import { createMockUserProfileService } from './userProfileService';
import type { MockApiConfig } from './mockUtils';

export const createMockApiAdapters = (
  config: MockApiConfig = {},
): ApiServices => ({
  authService: createMockAuthService(config),
  adminAuthService: createMockAdminAuthService(config),
  userProfileService: createMockUserProfileService(config),
  passService: createMockPassService(config),
  qrSessionService: createMockQrSessionService(config),
  adminDirectoryService: createMockAdminDirectoryService(config),
  requestService: createMockRequestService(config),
});

export const mockApi = createMockApiAdapters();
