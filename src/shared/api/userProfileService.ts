import { mapEmailToUserDto, mapUserDtoToModel } from './dto';
import { AppApiError } from './appApi';
import type { UserProfileService } from './contracts';
import { mockAdminDto, mockUserDto } from '../mocks/auth/user';
import {
  createMockDelayController,
  parseEmailFromMockToken,
  type MockApiConfig,
  simulateNetworkFailure,
} from './mockUtils';

export const createMockUserProfileService = (
  config: MockApiConfig = {},
): UserProfileService => {
  const delay = createMockDelayController(config);

  return {
    async getCurrentProfile(token) {
      await delay.wait('userProfile.getCurrentProfile');

      const email = parseEmailFromMockToken(token);

      if (!email || token.includes('expired')) {
        throw new AppApiError('session_expired');
      }

      simulateNetworkFailure(email, token);
      const template = email.toLowerCase().includes('admin') ? mockAdminDto : mockUserDto;

      return {
        user: mapUserDtoToModel(mapEmailToUserDto(email.replace(/^admin:/, ''), template)),
      };
    },
  };
};
