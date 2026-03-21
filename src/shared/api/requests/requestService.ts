import type { RequestService } from '../contracts';
import { createMockDelayController, type MockApiConfig } from '../mockUtils';
import { requestRuntimeStore } from '../../mocks/requests/runtime';

export const createMockRequestService = (
  config: MockApiConfig = {},
): RequestService => {
  const delay = createMockDelayController(config);

  return {
    async submitRegistrationRequest(payload) {
      await delay.wait('request.registration');
      return requestRuntimeStore.submitRegistrationRequest(payload);
    },
    async submitSupportRequest(payload) {
      await delay.wait('request.support');
      return requestRuntimeStore.submitSupportRequest(payload);
    },
    async getRegistrationRequests() {
      await delay.wait('request.list');
      return requestRuntimeStore.getRegistrationRequests();
    },
  };
};
