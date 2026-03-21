import type { ApiServices } from './contracts';
import { createHttpAdminDirectoryService } from './admin/adminDirectoryService';
import { createHttpAdminAuthService, createHttpAuthService } from './authService';
import { createHttpPassService } from './passService';
import { createHttpQrSessionService } from './qrSessionService';
import { createHttpRequestService } from './requests/requestService';
import { createHttpUserProfileService } from './userProfileService';

export const createHttpApiAdapters = (): ApiServices => ({
  authService: createHttpAuthService(),
  adminAuthService: createHttpAdminAuthService(),
  userProfileService: createHttpUserProfileService(),
  passService: createHttpPassService(),
  qrSessionService: createHttpQrSessionService(),
  adminDirectoryService: createHttpAdminDirectoryService(),
  requestService: createHttpRequestService(),
});

export const api = createHttpApiAdapters();
