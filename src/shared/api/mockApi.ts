import type { ApiServices } from './contracts';
import { createMockAuthService } from './authService';
import { createMockPassService } from './passService';
import { createMockQrSessionService } from './qrSessionService';
import { createMockUserProfileService } from './userProfileService';
import type { MockApiConfig } from './mockUtils';

export const createMockApiAdapters = (
  config: MockApiConfig = {},
): ApiServices => ({
  authService: createMockAuthService(config),
  userProfileService: createMockUserProfileService(config),
  passService: createMockPassService(config),
  qrSessionService: createMockQrSessionService(config),
});

export const mockApi = createMockApiAdapters();
