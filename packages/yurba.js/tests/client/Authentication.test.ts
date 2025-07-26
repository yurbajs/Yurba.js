import { Client } from '../../src/client/Client';
import { YurbaError } from '@yurbajs/types';
import { VALID_TOKEN, MockREST, MockWebSocket } from '../utils/testUtils';

// Mock dependencies
jest.mock('@yurbajs/rest', () => {
  return {
    REST: jest.fn().mockImplementation(() => new MockREST())
  };
});

jest.mock('../../src/client/WebsocketManager', () => {
  return jest.fn().mockImplementation(() => new MockWebSocket());
});

describe('Authentication Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Token Validation', () => {
    it('should validate token format on client creation', () => {
      // Valid token
      expect(() => new Client(VALID_TOKEN)).not.toThrow();
      
      // Invalid token format
      expect(() => new Client('invalid')).toThrow(YurbaError);
      expect(() => new Client('invalid')).toThrow('Invalid Yurba token format');
      
      // Empty token
      expect(() => new Client('')).toThrow(YurbaError);
      expect(() => new Client('')).toThrow('Token must be a non-empty string');
      
      // Token without y. prefix
      expect(() => new Client('abcdefghijklmnopqrstuvwxyz1234567890')).toThrow(YurbaError);
      expect(() => new Client('abcdefghijklmnopqrstuvwxyz1234567890')).toThrow('Invalid Yurba token format');
      
      // Token too short
      expect(() => new Client('y.short')).toThrow(YurbaError);
      expect(() => new Client('y.short')).toThrow('Invalid Yurba token format');
    });

    it('should check token before initialization', async () => {
      // Create client with valid token but then set it to empty
      const client = new Client(VALID_TOKEN);
      // @ts-ignore - accessing private property for testing
      client.token = '';
      
      await expect(client.init()).rejects.toThrow('Token is not set');
    });
  });

  describe('API Authentication', () => {
    it('should pass token to REST client', () => {
      const restMock = jest.requireMock('@yurbajs/rest');
      
      new Client(VALID_TOKEN);
      
      expect(restMock.REST).toHaveBeenCalledWith(VALID_TOKEN);
    });

    it('should pass token to WebSocket manager', () => {
      const wsmMock = jest.requireMock('../../src/client/WebsocketManager');
      
      new Client(VALID_TOKEN);
      
      expect(wsmMock).toHaveBeenCalledWith(VALID_TOKEN);
    });
  });

  describe('User Authentication', () => {
    it('should fetch and store user data during initialization', async () => {
      const client = new Client(VALID_TOKEN);
      
      // Before initialization, user should be undefined
      expect(client.user).toBeUndefined();
      
      await client.init();
      
      // After initialization, user should be set
      expect(client.user).toBeDefined();
      expect(client.user?.ID).toBe(1);
      expect(client.user?.Name).toBe('TestBot');
    });

    it('should handle API errors during initialization', async () => {
      const client = new Client(VALID_TOKEN);
      
      // Mock API error
      const restMock = jest.requireMock('@yurbajs/rest');
      const mockRest = restMock.REST.mock.results[0].value;
      mockRest.users.getMe.mockRejectedValueOnce(new Error('API error'));
      
      await expect(client.init()).rejects.toThrow('Failed to initialize client: API error');
    });
  });



  describe('User Methods', () => {
    it('should get user by tag', async () => {
      const client = new Client(VALID_TOKEN);
      await client.init();
      
      const user = await client.getUser('testbot');
      
      expect(user).toBeDefined();
      expect(user?.ID).toBe(1);
      expect(user?.Name).toBe('TestBot');
    });

    it('should return null for non-existent user', async () => {
      const client = new Client(VALID_TOKEN);
      await client.init();
      
      // Mock API to return null for unknown tag
      const restMock = jest.requireMock('@yurbajs/rest');
      const mockRest = restMock.REST.mock.results[0].value;
      mockRest.users.getByTag.mockResolvedValueOnce(null);
      
      const user = await client.getUser('nonexistent');
      
      expect(user).toBeNull();
    });

    it('should handle errors when getting user', async () => {
      const client = new Client(VALID_TOKEN);
      await client.init();
      
      // Mock API error
      const restMock = jest.requireMock('@yurbajs/rest');
      const mockRest = restMock.REST.mock.results[0].value;
      mockRest.users.getByTag.mockRejectedValueOnce(new Error('API error'));
      
      const user = await client.getUser('error');
      
      expect(user).toBeNull();
    });
  });
});