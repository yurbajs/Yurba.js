import { Client } from '../../src/client/Client';
import { VALID_TOKEN, MockREST, MockWebSocket, createMockMessage, wait } from '../utils/testUtils';
import { CommandError, MessageType } from '@yurbajs/types';

// Mock dependencies
jest.mock('@yurbajs/rest', () => {
  return {
    REST: jest.fn().mockImplementation(() => new MockREST())
  };
});

jest.mock('../../src/client/WebsocketManager', () => {
  return jest.fn().mockImplementation(() => new MockWebSocket());
});

describe('Command Tests', () => {
  let client: Client;

  beforeEach(async () => {
    jest.clearAllMocks();
    client = new Client(VALID_TOKEN);
    await client.init();
  });

  describe('Command Registration', () => {
    it('should register a command successfully', () => {
      const handler = jest.fn();
      client.registerCommand('test', { name: 'string' }, handler);
      
      const commands = client.getCommands();
      expect(commands).toContain('test');
    });

    it('should throw error when registering a command with empty name', () => {
      const handler = jest.fn();
      expect(() => client.registerCommand('', { name: 'string' }, handler)).toThrow('Command name is required');
    });

    it('should throw error when registering a duplicate command', () => {
      const handler = jest.fn();
      client.registerCommand('test', { name: 'string' }, handler);
      
      expect(() => client.registerCommand('test', { name: 'string' }, handler)).toThrow('Command "test" is already registered');
    });
  });

  describe('Command Execution', () => {
    it('should execute a command when message starts with prefix', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { name: 'string' }, handler);
      
      // Create a command message
      const message = createMockMessage('', true);
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).toHaveBeenCalled();
    });

    it('should not execute a command when message does not start with prefix', async () => {
      const handler = jest.fn();
      client.registerCommand('test', { name: 'string' }, handler);
      
      // Create a regular message
      const message = createMockMessage('Hello world');
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).not.toHaveBeenCalled();
    });

    it('should emit unknownCommand event when command not found', async () => {
      // Set up event handler
      const unknownCommandHandler = jest.fn();
      client.on('unknownCommand', unknownCommandHandler);
      
      // Create a message with unknown command
      const message = createMockMessage('', true);
      message.Text = '/unknown command';
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(unknownCommandHandler).toHaveBeenCalled();
      expect(unknownCommandHandler.mock.calls[0][0]).toBe('/unknown command');
    });

    it('should emit commandError event when command execution fails', async () => {
      // Register a command that throws an error
      const handler = jest.fn().mockRejectedValue(new Error('Command failed'));
      client.registerCommand('test', { name: 'string' }, handler);
      
      // Set up event handler
      const errorHandler = jest.fn();
      client.on('commandError', errorHandler);
      
      // Create a command message
      const message = createMockMessage('', true);
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0].error.message).toBe('Command failed');
    });
  });

  describe('Command Arguments Parsing', () => {
    it('should parse string arguments correctly', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { name: 'string' }, handler);
      
      // Create a command message with arguments
      const message = createMockMessage('', true);
      message.Text = '/test John';
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).toHaveBeenCalledWith(expect.anything(), { name: 'John' });
    });

    it('should parse integer arguments correctly', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { age: 'int' }, handler);
      
      // Create a command message with arguments
      const message = createMockMessage('', true);
      message.Text = '/test 25';
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).toHaveBeenCalledWith(expect.anything(), { age: 25 });
    });

    it('should throw error for invalid integer arguments', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { age: 'int' }, handler);
      
      // Set up error handler
      const errorHandler = jest.fn();
      client.on('commandError', errorHandler);
      
      // Create a command message with invalid arguments
      const message = createMockMessage('', true);
      message.Text = '/test notAnInteger';
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0].error.message).toContain('must be an integer');
    });

    it('should use default values for optional arguments', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { name: ['string', 'DefaultName'] }, handler);
      
      // Create a command message without arguments
      const message = createMockMessage();
      message.Text = '/test';
      message.Type = MessageType.Message;
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).toHaveBeenCalledWith(expect.anything(), { name: 'DefaultName' });
    });

    it('should throw error for missing required arguments', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { name: 'string' }, handler);
      
      // Set up error handler
      const errorHandler = jest.fn();
      client.on('commandError', errorHandler);
      
      // Create a command message without arguments
      const message = createMockMessage('', true);
      message.Text = '/test';
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).not.toHaveBeenCalled();
      expect(errorHandler).toHaveBeenCalled();
      expect(errorHandler.mock.calls[0][0].error.message).toContain('Missing required argument');
    });

    it('should capture rest arguments when specified', async () => {
      const handler = jest.fn().mockResolvedValue(undefined);
      client.registerCommand('test', { text: ['string', undefined, 'rest'] }, handler);
      
      // Create a command message with multiple words
      const message = createMockMessage('', true);
      message.Text = '/test this is a long message';
      
      // @ts-ignore - accessing private method for testing
      await client.handleMessage(message);
      
      expect(handler).toHaveBeenCalledWith(expect.anything(), { text: 'this is a long message' });
    });
  });


});