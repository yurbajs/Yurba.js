import { Client } from '../src/client/Client';
import axios from 'axios';
jest.mock('axios');

const VALID_TOKEN = 'y.AjqFIO1riKbU0ObhVXHscgnAC1LoZweW123456789';

// Test client initialization with token
test('Client should initialize with token', () => {
  const client = new Client(VALID_TOKEN);
  expect(client).toBeInstanceOf(Client);
});

// Test that duplicate command registration throws error
test('Client should not register duplicate command', () => {
  const client = new Client(VALID_TOKEN);
  client.registerCommand('test', {}, async () => {});
  expect(() => {
    client.registerCommand('test', {}, async () => {});
  }).toThrow();
});

// Test command handler execution
test('Client should call command handler', async () => {
  const client = new Client(VALID_TOKEN);
  const handler = jest.fn(async () => {});
  client.registerCommand('hello', {}, handler);
  const fakeMsg = { Text: '/hello', Author: { ID: 1, Name: 'Test' } };

  // @ts-expect-error - commandManager is private but we need to access it for testing
  await client.commandManager.handleCommand(fakeMsg, () => {});
  expect(handler).toHaveBeenCalled();
});

// Test message sending with mock
test('Client should send message (mock)', async () => {
  const client = new Client(VALID_TOKEN);
  client.api.messages.send = jest.fn().mockResolvedValue({ Message: { Text: 'hi' } });
  const res = await client.sendMessage(123, 'hi');
  expect(res.Message.Text).toBe('hi');
});

// Test message event handling
test('Client should emit message event', (done) => {
  const client = new Client(VALID_TOKEN);
  client.on('message', (msg) => {
    expect(msg.text).toBe('test');
    done();
  });
  client.emit('message', { text: 'test' });
});

// Test empty command name validation
test('Client should not register command without name', () => {
  const client = new Client(VALID_TOKEN);

  expect(() => client.registerCommand('', {}, async () => {})).toThrow();
});

// Test empty message validation
test('Client should not send empty message', async () => {
  const client = new Client(VALID_TOKEN);
  // @ts-expect-error - Intentionally using a partial mock of the Apis class for testing purposes
  client.api = { sendMessage: jest.fn() };
  await expect(client.sendMessage(123, '')).rejects.toThrow();
});