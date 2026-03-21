import type { DigitalPass } from '../../entities/pass/model';
import type { QrSession } from '../../entities/qr/model';
import type { UserProfile } from '../../entities/user/model';
import type { RegisterPayload } from '../../app/store';
import { mockPasses, mockQrSession, mockUser } from '../mocks/data';

const delay = async (ms = 320) => new Promise((resolve) => setTimeout(resolve, ms));

const createRotatedSession = (): QrSession => ({
  ...mockQrSession,
  id: `qr-session-${Math.random().toString(36).slice(2, 8)}`,
  code: `FP-${Math.random().toString(36).slice(2, 6).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`,
  expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
});

export const mockApi = {
  async signIn(email: string, _password: string): Promise<UserProfile> {
    await delay();
    return {
      ...mockUser,
      email,
      name: email.split('@')[0].replace(/^./, (letter) => letter.toUpperCase()),
    };
  },
  async signUp(payload: RegisterPayload): Promise<UserProfile> {
    await delay();
    const name = [payload.lastName, payload.firstName, payload.middleName].filter(Boolean).join(' ');

    return {
      ...mockUser,
      name,
      email: payload.email,
      department: payload.department,
      position: payload.position,
    };
  },
  async getPasses(): Promise<DigitalPass[]> {
    await delay(120);
    return mockPasses;
  },
  async getQrSession(): Promise<QrSession> {
    await delay(120);
    return mockQrSession;
  },
  async rotateQrSession(): Promise<QrSession> {
    await delay(200);
    return createRotatedSession();
  },
};
