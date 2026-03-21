import type { QrSession } from '../../entities/qr/model';
import {
  expireQrSession as expireQrSessionModel,
  generateQrSession as generateQrSessionModel,
  markQrAsScanned as markQrAsScannedModel,
  revokeQrSession as revokeQrSessionModel,
} from '../../features/qr-session/model/qrSession.service';
import { AppApiError } from './appApi';
import type { QrSessionService } from './contracts';
import { findMockPassDtoById } from '../mocks/pass/passes';
import { createMockDelayController, type MockApiConfig, simulateNetworkFailure } from './mockUtils';

const assertPassIsAvailable = (passId: string) => {
  const pass = findMockPassDtoById(passId);

  if (pass?.is_blocked || passId.toLowerCase().includes('blocked')) {
    throw new AppApiError('pass_blocked');
  }
};

export const createMockQrSessionService = (
  config: MockApiConfig = {},
): QrSessionService => {
  const delay = createMockDelayController(config);

  const wrap = async (
    operation:
      | 'qrSession.generate'
      | 'qrSession.expire'
      | 'qrSession.scan'
      | 'qrSession.revoke',
    execute: () => Promise<QrSession>,
  ) => {
    await delay.wait(operation);

    return {
      session: await execute(),
    };
  };

  return {
    async generateQrSession(employeeId, passId) {
      simulateNetworkFailure(employeeId, passId);
      assertPassIsAvailable(passId);

      return wrap('qrSession.generate', () =>
        generateQrSessionModel({ employeeId, passId, delayMs: 0 }),
      );
    },
    async expireQrSession(session) {
      simulateNetworkFailure(session.employeeId, session.passId, session.sessionId);

      return wrap('qrSession.expire', () => expireQrSessionModel(session, 0));
    },
    async markQrAsScanned(session) {
      simulateNetworkFailure(session.employeeId, session.passId, session.sessionId);
      assertPassIsAvailable(session.passId);

      return wrap('qrSession.scan', () => markQrAsScannedModel(session, 0));
    },
    async revokeQrSession(session) {
      simulateNetworkFailure(session.employeeId, session.passId, session.sessionId);

      return wrap('qrSession.revoke', () => revokeQrSessionModel(session, 0));
    },
  };
};
