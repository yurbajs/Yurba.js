import { Client } from '../src/client/Client';

const VALID_TOKEN = 'y.AjqFIO1riKbU0ObhVXHscgnAC1LoZweW123456789';

describe('Client Improvements', () => {
  describe('Token Validation', () => {
    it('should accept valid Yurba token', () => {
      expect(() => new Client(VALID_TOKEN)).not.toThrow();
    });

    it('should reject invalid token format', () => {
      expect(() => new Client('invalid_token')).toThrow();
    });

    it('should reject short token', () => {
      expect(() => new Client('y.short')).toThrow();
    });

    it('should reject empty token', () => {
      expect(() => new Client('')).toThrow();
    });
  });

  describe('Client Options', () => {
    it('should use default options', () => {
      const client = new Client(VALID_TOKEN);
      expect(client).toBeInstanceOf(Client);
    });

    it('should accept custom prefix', () => {
      const client = new Client(VALID_TOKEN, { prefix: '!' });
      expect(client).toBeInstanceOf(Client);
    });

    it('should accept custom reconnect attempts', () => {
      const client = new Client(VALID_TOKEN, { maxReconnectAttempts: 10 });
      expect(client).toBeInstanceOf(Client);
    });
  });

  describe('Middleware Management', () => {
    let client: Client;

    beforeEach(() => {
      client = new Client(VALID_TOKEN);
    });

    it('should add middleware', () => {
      const middleware = jest.fn();
      client.use(middleware, { name: 'test-middleware' });
      
      const middlewares = client.getMiddlewares();
      expect(middlewares).toHaveLength(1);
      expect(middlewares[0].name).toBe('test-middleware');
    });

    it('should remove middleware', () => {
      const middleware = jest.fn();
      client.use(middleware, { name: 'test-middleware' });
      
      const removed = client.removeMiddleware('test-middleware');
      expect(removed).toBe(true);
      expect(client.getMiddlewares()).toHaveLength(0);
    });
  });

  describe('Command Registration', () => {
    let client: Client;

    beforeEach(() => {
      client = new Client(VALID_TOKEN);
    });

    it('should register command successfully', () => {
      const handler = jest.fn();
      client.registerCommand('test', { name: 'string' }, handler);
      
      const commands = client.getCommands();
      expect(commands).toContain('test');
    });

    it('should not register duplicate commands', () => {
      const handler = jest.fn();
      client.registerCommand('test', { name: 'string' }, handler);
      
      expect(() => {
        client.registerCommand('test', { name: 'string' }, handler);
      }).toThrow();
    });
  });
});