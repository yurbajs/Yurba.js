// Jest Test Example
import { setupServer } from 'msw/node';
import { handlers } from '@yurbajs/mock';

const server = setupServer(...handlers);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

test('should return mock user by ID', async () => {
  const response = await fetch('https://api.yurba.one/user/123');
  const user = await response.json();
  
  expect(user.ID).toBe(123);
  expect(user.Name).toBe('Name_user_123');
});

test('should return mock user by tag', async () => {
  const response = await fetch('https://api.yurba.one/user/testuser');
  const user = await response.json();
  
  expect(user.Name).toBe('Name_testuser');
});