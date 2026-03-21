import { mapEmailToUserDto, mapUserDtoToModel, type UserDto } from './dto';
import { AppApiError } from './appApi';
import type { UserProfileService } from './contracts';
import { mockAdminDto, mockUserDto } from '../mocks/auth/user';
import {
  createMockDelayController,
  parseEmailFromMockToken,
  type MockApiConfig,
  simulateNetworkFailure,
} from './mockUtils';
import { apiConfig, createAuthorizedRequestInit } from './config';
import { httpClient } from './httpClient';

export const createHttpUserProfileService = (): UserProfileService => ({
  async getCurrentProfile(token) {
    const response = await httpClient.get<{ user: UserDto }>(
      apiConfig.endpoints.authProfile,
      createAuthorizedRequestInit(token),
    );

    return {
      user: mapUserDtoToModel(response.user),
    };
  },
});

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
