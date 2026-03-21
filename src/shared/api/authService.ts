import type { RegisterPayload } from '../../app/store/types';
import { mapEmailToUserDto, mapRegisterPayloadToUserDto, mapUserDtoToModel, type UserDto } from './dto';
import { AppApiError } from './appApi';
import type { AdminAuthService, AuthService } from './contracts';
import { mockAdminDto, mockUserDto } from '../mocks/auth/user';
import {
  createMockDelayController,
  createMockToken,
  type MockApiConfig,
  simulateNetworkFailure,
} from './mockUtils';
import { apiConfig, createAuthorizedRequestInit } from './config';
import { httpClient } from './httpClient';
import { readLocalStorage, storageKeys } from '../config/storage';

interface AuthSessionDto {
  token: string;
  user: UserDto;
}

const mapAuthSessionDto = ({ token, user }: AuthSessionDto) => ({
  token,
  user: mapUserDtoToModel(user),
});

export const createHttpAuthService = (): AuthService => ({
  async login(email, password) {
    const session = await httpClient.post<AuthSessionDto>(apiConfig.endpoints.authLogin, {
      email,
      password,
    });

    return mapAuthSessionDto(session);
  },
  async register(payload: RegisterPayload) {
    const session = await httpClient.post<AuthSessionDto>(apiConfig.endpoints.authRegister, payload);

    return mapAuthSessionDto(session);
  },
  async logout() {
    await httpClient.post<{ success?: true }>(
      apiConfig.endpoints.authLogout,
      undefined,
      createAuthorizedRequestInit(readLocalStorage(storageKeys.authToken)),
    );

    return { success: true };
  },
});

export const createHttpAdminAuthService = (): AdminAuthService => ({
  async login(email, password) {
    const session = await httpClient.post<AuthSessionDto>(apiConfig.endpoints.adminLogin, {
      email,
      password,
    });

    return mapAuthSessionDto(session);
  },
});

export const createMockAuthService = (config: MockApiConfig = {}): AuthService => {
  const delay = createMockDelayController(config);

  return {
    async login(email, password) {
      await delay.wait('auth.login');
      simulateNetworkFailure(email);

      if (password !== 'future-pass') {
        throw new AppApiError('invalid_credentials');
      }

      if (email.toLowerCase().includes('admin')) {
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

export const createMockAdminAuthService = (
  config: MockApiConfig = {},
): AdminAuthService => {
  const delay = createMockDelayController(config);

  return {
    async login(email, password) {
      await delay.wait('admin.login');
      simulateNetworkFailure(email);

      if (password !== 'admin-pass' || !email.toLowerCase().includes('admin')) {
        throw new AppApiError('invalid_credentials');
      }

      const user = mapUserDtoToModel(mapEmailToUserDto(email, mockAdminDto));

      return {
        token: createMockToken(`admin:${email}`),
        user,
      };
    },
  };
};
