import type { RequestService } from '../contracts';
import { createMockDelayController, type MockApiConfig } from '../mockUtils';
import { requestRuntimeStore } from '../../mocks/requests/runtime';
import { apiConfig, createAuthorizedRequestInit } from '../config';
import { httpClient } from '../httpClient';
import { readLocalStorage, storageKeys } from '../../config/storage';
import type {
  ProcessRegistrationRequestPayload,
  RegistrationRequest,
  RegistrationRequestPayload,
  SupportRequest,
  SupportRequestPayload,
} from './types';

const buildQueueActionPath = (requestId: string) =>
  `${apiConfig.endpoints.adminRegistrationQueue}/${encodeURIComponent(requestId)}/process`;

export const createHttpRequestService = (): RequestService => ({
  submitRegistrationRequest(payload: RegistrationRequestPayload) {
    return httpClient.post<RegistrationRequest>(apiConfig.endpoints.registrationRequests, payload);
  },
  submitSupportRequest(payload: SupportRequestPayload) {
    return httpClient.post<SupportRequest>(apiConfig.endpoints.supportRequests, payload);
  },
  getRegistrationRequests() {
    return httpClient.get<RegistrationRequest[]>(
      apiConfig.endpoints.adminRegistrationQueue,
      createAuthorizedRequestInit(readLocalStorage(storageKeys.authToken)),
    );
  },
  processRegistrationRequest(payload: ProcessRegistrationRequestPayload) {
    return httpClient.post<RegistrationRequest>(
      buildQueueActionPath(payload.requestId),
      {
        employeeId: payload.employeeId,
        status: 'approved',
      },
      createAuthorizedRequestInit(readLocalStorage(storageKeys.authToken)),
    );
  },
});

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
    async processRegistrationRequest(payload) {
      await delay.wait('request.list');
      const request = requestRuntimeStore.approveRegistrationRequest(
        payload.requestId,
        payload.employeeId,
      );

      if (!request) {
        throw new Error('Registration request not found');
      }

      return request;
    },
  };
};
