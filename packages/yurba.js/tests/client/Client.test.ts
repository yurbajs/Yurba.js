import { Client } from '../../src/client/Client';
import { YurbaError, WebSocketError, ApiRequestError } from '@yurbajs/types';
import { VALID_TOKEN, mockUser, MockREST, MockWebSocket, wait } from '../utils/testUtils';

// Mock dependencies
jest.mock('@yurbajs/rest', () => {
  return {
    REST: jest.fn().mockImplementation(() => new MockREST())
  };
});

jest.mock('../../src/client/WebsocketManager', () => {
  return jest.fn().mockImplementation(() => new MockWebSocket());
});

describe('Client Tests', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('Initialization and Configuration', () => {
    it('should create a client with valid token', () => {
      const client = new Client(VALID_TOKEN);
      expect(client).toBeInstanceOf(Client);
    });

    it('should throw YurbaError with invalid token format', () => {
      expect(() => new Client('invalid_token')).toThrow(YurbaError);
    });

    it('should throw YurbaError with empty token', () => {
      expect(() => new Client('')).toThrow(YurbaError);
    });

    it('should use default options when none provided', () => {
      const client = new Client(VALID_TOKEN);
      // @ts-ignore - accessing private property for testing
      expect(client.prefix).toBe('/');
      // @ts-ignore - accessing private property for testing
      expect(client.maxReconnectAttempts).toBe(5);
    });

    it('should use custom options when provided', () => {
      const client = new Client(VALID_TOKEN, {
        prefix: '!',
        maxReconnectAttempts: 10
      });
      // @ts-ignore - accessing private property for testing
      expect(client.prefix).toBe('!');
      // @ts-ignore - accessing private property for testing
      expect(client.maxReconnectAttempts).toBe(10);
    });
  });

  describe('Client Lifecycle', () => {
    it('should initialize client successfully', async () => {
      const client = new Client(VALID_TOKEN);
      
      // Should emit 'ready' event when WebSocket is ready
      const readyHandler = jest.fn();
      client.on('ready', readyHandler);
      
      await client.init();
      
      // Wait for ready event to be emitted
      await wait(50);
      
      expect(readyHandler).toHaveBeenCalled();
      expect(client.user).toEqual(mockUser);
    });

    it('should handle reconnection on WebSocket close', async () => {
      const client = new Client(VALID_TOKEN);
      await client.init();
      
      // Mock WebSocket manager
      // @ts-ignore - accessing private property for testing
      const wsm = client.wsm;
      
      // Emit close event to trigger reconnection
      wsm.emit('close');
      
      // @ts-ignore - accessing private property for testing
      expect(client.isReady).toBe(false);
      // @ts-ignore - accessing private property for testing
      expect(client.reconnectAttempts).toBe(1);
      
      // Wait for reconnection attempt
      await wait(100);
    });

    it('should handle reconnection on WebSocket error', async () => {
      const client = new Client(VALID_TOKEN);
      await client.init();
      
      // Mock WebSocket manager
      // @ts-ignore - accessing private property for testing
      const wsm = client.wsm;
      
      // Emit error event to trigger reconnection
      wsm.emit('error', new Error('Test error'));
      
      // @ts-ignore - accessing private property for testing
      expect(client.isReady).toBe(false);
      // @ts-ignore - accessing private property for testing
      expect(client.reconnectAttempts).toBe(1);
      
      // Wait for reconnection attempt
      await wait(100);
    });

    it('should emit reconnectFailed when max attempts reached', async () => {
      const client = new Client(VALID_TOKEN, { maxReconnectAttempts: 1 });
      await client.init();
      
      // Mock WebSocket manager
      // @ts-ignore - accessing private property for testing
      const wsm = client.wsm;
      
      // Set up reconnectFailed handler
      const reconnectFailedHandler = jest.fn();
      client.on('reconnectFailed', reconnectFailedHandler);
      
      // Manually set reconnect attempts to max
      // @ts-ignore - accessing private property for testing
      client.reconnectAttempts = 1;
      
      // Emit close event to trigger reconnection
      wsm.emit('close');
      
      // Wait for reconnection attempt
      await wait(100);
      
      expect(reconnectFailedHandler).toHaveBeenCalled();
    });
  });

  describe('Event Handling', () => {
    it('should register and trigger event handlers', async () => {
      const client = new Client(VALID_TOKEN);
      const handler = jest.fn();
      
      client.on('testEvent', handler);
      client.emit('testEvent', 'test data');
      
      expect(handler).toHaveBeenCalledWith('test data');
    });

    it('should register one-time event handlers with once()', async () => {
      const client = new Client(VALID_TOKEN);
      const handler = jest.fn();
      
      client.once('testEvent', handler);
      client.emit('testEvent', 'test data');
      client.emit('testEvent', 'test data again');
      
      expect(handler).toHaveBeenCalledTimes(1);
      expect(handler).toHaveBeenCalledWith('test data');
    });

    it('should remove event handlers with off()', async () => {
      const client = new Client(VALID_TOKEN);
      const handler = jest.fn();
      
      client.on('testEvent', handler);
      client.off('testEvent', handler);
      client.emit('testEvent', 'test data');
      
      expect(handler).not.toHaveBeenCalled();
    });

    it('should remove all listeners for an event with removeAllListeners()', async () => {
      const client = new Client(VALID_TOKEN);
      const handler1 = jest.fn();
      const handler2 = jest.fn();
      
      client.on('testEvent', handler1);
      client.on('testEvent', handler2);
      client.removeAllListeners('testEvent');
      client.emit('testEvent', 'test data');
      
      expect(handler1).not.toHaveBeenCalled();
      expect(handler2).not.toHaveBeenCalled();
    });
  });

  describe('waitFor Method', () => {
    it('should resolve when condition is met', async () => {
      const client = new Client(VALID_TOKEN);
      
      // Set up a promise that will resolve when the event is emitted
      const waitPromise = client.waitFor('testEvent', (data) => data === 'expected data');
      
      // Emit the event with the expected data
      setTimeout(() => {
        client.emit('testEvent', 'expected data');
      }, 10);
      
      const result = await waitPromise;
      expect(result).toBe('expected data');
    });

    it('should timeout when condition is not met', async () => {
      const client = new Client(VALID_TOKEN);
      
      // Set up a promise that will timeout
      const waitPromise = client.waitFor('testEvent', () => false, { timeout: 50 });
      
      await expect(waitPromise).rejects.toThrow('Timeout waiting for event: testEvent');
    });

    it('should abort when signal is triggered', async () => {
      const client = new Client(VALID_TOKEN);
      
      // Create an abort controller
      const controller = new AbortController();
      
      // Set up a promise that will be aborted
      const waitPromise = client.waitFor('testEvent', () => false, { signal: controller.signal });
      
      // Abort the operation
      setTimeout(() => {
        controller.abort();
      }, 10);
      
      await expect(waitPromise).rejects.toThrow('Operation aborted');
    });
  });
});