import { EventEmitter } from 'events';
import { ShortUserModel } from '../types';
export default class WSM extends EventEmitter {
    private ws;
    private token;
    constructor(token: string);
    connect(botData: ShortUserModel): Promise<void>;
    private subscribeToEvents;
    private waitForWebSocketOpen;
    close(): void;
}
//# sourceMappingURL=WebsocketManager.d.ts.map