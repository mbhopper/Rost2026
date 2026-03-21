import type { DigitalPass } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import type { UserProfile } from '../../entities/user/model';
import type { RegisterPayload } from '../../app/store';
import {
  mapEmailToUserDto,
  mapPassDtoToModel,
  mapQrSessionDtoToModel,
  mapRegisterPayloadToUserDto,
  mapUserDtoToModel,
} from './dto';
import { createMockQrSessionDto, mockPassDtos, mockQrSessionDto, mockUserDto } from '../mocks/data';

const delay = async (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms));

export const mockApi = {
  async signIn(email: string, _password: string): Promise<UserProfile> {
    await delay();
    return mapUserDtoToModel(mapEmailToUserDto(email, mockUserDto));
  },
  async signUp(payload: RegisterPayload): Promise<UserProfile> {
    await delay();
    return mapUserDtoToModel(mapRegisterPayloadToUserDto(payload, mockUserDto));
  },
  async getPasses(): Promise<DigitalPass[]> {
    await delay(120);
    return mockPassDtos.map(mapPassDtoToModel);
  },
  async getQrSession(): Promise<QrSession> {
    await delay(120);
    return mapQrSessionDtoToModel(mockQrSessionDto);
  },
  async rotateQrSession(): Promise<QrSession> {
    await delay(200);
    return mapQrSessionDtoToModel(createMockQrSessionDto());
  },
};
