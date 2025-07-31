// Custom Mock Data Example
import { generateMockUser, randomBetween } from '@yurbajs/mock';

// Генерація власних mock даних
const customUser = {
  ...generateMockUser('456', 'custom'),
  CustomField: randomBetween(1, 100)
};

console.log(customUser);