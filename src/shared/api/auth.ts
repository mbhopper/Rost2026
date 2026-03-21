import type { RegisterPayload } from '../../app/store';
import type { UserProfile } from '../../entities/user/model';
import {
  mapEmailToUserDto,
  mapRegisterPayloadToUserDto,
  mapUserDtoToModel,
} from './dto';
import { mockUserDto } from '../mocks/data';

const delay = async (ms = 320) =>
  new Promise((resolve) => setTimeout(resolve, ms));
const TOKEN_PREFIX = 'mock-token';

export type AuthErrorCode =
  | 'auth_error'
  | 'session_expired'
  | 'service_unavailable';

export class AuthApiError extends Error {
  code: AuthErrorCode;

  constructor(code: AuthErrorCode, message: string) {
    super(message);
    this.name = 'AuthApiError';
    this.code = code;
  }
}

export interface AuthSuccessResponse {
  token: string;
  user: UserProfile;
}

const createToken = (email: string) =>
  `${TOKEN_PREFIX}::${email.toLowerCase()}::${Date.now()}`;

const parseEmailFromToken = (token: string): string | null => {
  const [prefix, email] = token.split('::');

  if (prefix !== TOKEN_PREFIX || !email) {
    return null;
  }

  return email;
};

const ensureServiceAvailability = async (identity: string) => {
  await delay();

  if (
    identity.toLowerCase().includes('offline') ||
    identity.toLowerCase().includes('unavailable')
  ) {
    throw new AuthApiError(
      'service_unavailable',
      'Auth service is temporarily unavailable.',
    );
  }
};

export const authApi = {
  async login(email: string, password: string): Promise<AuthSuccessResponse> {
    await ensureServiceAvailability(email);

    if (password !== 'future-pass') {
      throw new AuthApiError('auth_error', 'Неверный email или пароль.');
    }

    const user = mapUserDtoToModel(mapEmailToUserDto(email, mockUserDto));

    return {
      token: createToken(email),
      user,
    };
  },
  async register(payload: RegisterPayload): Promise<AuthSuccessResponse> {
    await ensureServiceAvailability(payload.email);

    const user = mapUserDtoToModel(
      mapRegisterPayloadToUserDto(payload, mockUserDto),
    );

    return {
      token: createToken(payload.email),
      user,
    };
  },
  async logout() {
    await delay(120);
  },
  async getCurrentUser(token: string): Promise<UserProfile> {
    await delay(220);

    const email = parseEmailFromToken(token);

    if (!email) {
      throw new AuthApiError(
        'session_expired',
        'Сессия истекла. Войдите заново.',
      );
    }

    if (token.includes('expired')) {
      throw new AuthApiError(
        'session_expired',
        'Сессия истекла. Войдите заново.',
      );
    }

    await ensureServiceAvailability(email);

    return mapUserDtoToModel(mapEmailToUserDto(email, mockUserDto));
  },
};
