import type { DigitalPass } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import type { UserProfile } from '../../entities/user/model';
import type { RegisterPayload } from '../../app/store';
import {
  expireQrSession,
  generateQrSession,
  markQrAsScanned,
  revokeQrSession,
} from '../../features/qr-session/model/qrSession.service';
import {
  mapEmailToUserDto,
  mapPassDtoToModel,
  mapRegisterPayloadToUserDto,
  mapUserDtoToModel,
} from './dto';
import { mockPassDtos, mockUserDto } from '../mocks/data';

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
  async generateQrSession(employeeId: string, passId: string): Promise<QrSession> {
    return generateQrSession({ employeeId, passId });
  },
  async expireQrSession(session: QrSession): Promise<QrSession> {
    return expireQrSession(session);
  },
  async markQrAsScanned(session: QrSession): Promise<QrSession> {
    return markQrAsScanned(session);
  },
  async revokeQrSession(session: QrSession): Promise<QrSession> {
    return revokeQrSession(session);
  },
};
