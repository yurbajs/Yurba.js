import { generateMockUser, Server } from './index.js';

describe('@yurbajs/mock', () => {
  describe('generateMockUser', () => {
    it('should generate mock user with correct structure', () => {
      const user = generateMockUser('123', 'testuser');
      
      expect(user).toHaveProperty('ID', 123);
      expect(user).toHaveProperty('Name', 'Name_testuser');
      expect(user).toHaveProperty('Surname', 'Surname_testuser');
      expect(user).toHaveProperty('Link', 'https://yurba.one/u/123');
      expect(typeof user.Avatar).toBe('number');
      expect(typeof user.Online).toBe('number');
      expect([0, 1]).toContain(user.Online);
    });
  });

  describe('Server', () => {
    it('should create server instance', () => {
      const server = new Server({ port: 3001 });
      expect(server).toBeInstanceOf(Server);
    });
  });
});