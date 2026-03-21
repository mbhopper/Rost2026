import type { RegisterPayload } from '../../app/store/types';
import { mapEmailToUserDto, mapRegisterPayloadToUserDto, mapUserDtoToModel } from './dto';
import { AppApiError } from './appApi';
import type { AuthService } from './contracts';
import { mockUserDto } from '../mocks/auth/user';
import { createMockDelayController, createMockToken, type MockApiConfig, simulateNetworkFailure } from './mockUtils';

export const createMockAuthService = (config: MockApiConfig = {}): AuthService => {
  const delay = createMockDelayController(config);

  return {
    async login(email, password) {
      await delay.wait('auth.login');
      simulateNetworkFailure(email);

      if (password !== 'future-pass') {
        throw new AppApiError('invalid_credentials');
      }

      const user = mapUserDtoToModel(mapEmailToUserDto(email, mockUserDto));

      return {
        token: createMockToken(email),
        user,
      };
    },
    async register(payload: RegisterPayload) {
      await delay.wait('auth.register');
      simulateNetworkFailure(payload.email);

      const user = mapUserDtoToModel(
        mapRegisterPayloadToUserDto(payload, mockUserDto),
      );

      return {
        token: createMockToken(payload.email),
        user,
      };
    },
    async logout() {
      await delay.wait('auth.logout');

      return { success: true };
    },
  };
};
