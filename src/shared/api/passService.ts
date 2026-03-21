import { mapPassDtoToModel, type PassDto } from './dto';
import type { PassService } from './contracts';
import { defaultMockPassDtos } from '../mocks/pass/passes';
import { createMockDelayController, type MockApiConfig } from './mockUtils';
import { apiConfig, createAuthorizedRequestInit } from './config';
import { httpClient } from './httpClient';
import { readLocalStorage, storageKeys } from '../config/storage';

export const createHttpPassService = (): PassService => ({
  async getPasses() {
    const response = await httpClient.get<{ passes: PassDto[] }>(
      apiConfig.endpoints.passes,
      createAuthorizedRequestInit(readLocalStorage(storageKeys.authToken)),
    );

    return {
      passes: response.passes.map(mapPassDtoToModel),
    };
  },
});

export const createMockPassService = (config: MockApiConfig = {}): PassService => {
  const delay = createMockDelayController(config);

  return {
    async getPasses() {
      await delay.wait('pass.getPasses');

      return {
        passes: defaultMockPassDtos.map(mapPassDtoToModel),
      };
    },
  };
};
