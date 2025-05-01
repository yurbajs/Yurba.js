import { EventEmitter } from "events";
interface ReconnectingWebSocketOptions {
  maxReconnectAttempts?: number;
  retryDelay?: number;
}
declare class ReconnectingWebSocket extends EventEmitter {
  private url;
  private options;
  private ws;
  private reconnectAttempts;
  private isConnected;
  private messageQueue;
  constructor(url: string, options?: ReconnectingWebSocketOptions);
  private connect;
  private handleOpen;
  private handleClose;
  private handleError;
  private handleMessage;
  send(data: string): void;
  close(code?: number, reason?: string): void;
}
export default ReconnectingWebSocket;
//# sourceMappingURL=Websocket.d.ts.map
