import { mockCharacterApi } from '../mock/characterCreation';
import { characterApi } from '../api/character';

// Use mock data if VITE_USE_MOCK_DATA is set to 'true'
const USE_MOCK_DATA = import.meta.env.VITE_USE_MOCK_DATA === 'true';

// Service that switches between mock and real data
export const characterCreationService = {
  genders: {
    list: async () => {
      if (USE_MOCK_DATA) {
        return mockCharacterApi.genders.list();
      }
      // TODO: Implement real API call when ready
      throw new Error('Real API not implemented yet');
    },
  },
  races: {
    list: async () => {
      if (USE_MOCK_DATA) {
        return mockCharacterApi.races.list();
      }
      return characterApi.races.list();
    },
  },
  classes: {
    list: async () => {
      if (USE_MOCK_DATA) {
        return mockCharacterApi.classes.list();
      }
      return characterApi.classes.list();
    },
  },
}; 