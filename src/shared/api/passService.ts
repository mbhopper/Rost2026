import { mapPassDtoToModel } from './dto';
import type { PassService } from './contracts';
import { defaultMockPassDtos } from '../mocks/pass/passes';
import { createMockDelayController, type MockApiConfig } from './mockUtils';

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
