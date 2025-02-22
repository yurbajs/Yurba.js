import ReconnectingWebSocket from './ReconnectingWebSocket';
import { EventEmitter } from 'events';
import Logger from './utils/logs';
import { BotData, Message, CommandArgsSchema, YurbaClientInfo } from './types';
declare global {
    var botData: BotData;
}
declare class Client extends EventEmitter {
    private token;
    private prefix;
    private ws;
    private commands;
    private isReady;
    private api;
    yurbacli: YurbaClientInfo;
    /**
     * Constructs a new Client instance.
     *
     * @param token - The token used for authentication.
     * @param prefix - The prefix used for commands, defaults to '/'.
     *
     * Initializes the WebSocket connection, command map, and API interface.
     * Sets up Yurba CLI client information based on package metadata.
     * Logs initialization details if in developer mode.
     */
    constructor(token: string, prefix?: string);
    /**
     * Initializes the client.
     *
     * Checks for the presence of the bot token.
     * If present, fetches the bot's data and stores it globally.
     * Sets up the WebSocket connection and subscribes to events.
     * Emits a 'ready' event when the WebSocket connection is established.
     * Logs initialization-related messages if in developer mode.
     *
     * @returns A promise that resolves when initialization is complete.
     */
    init(): Promise<void>;
    getMe(): Promise<BotData>;
    subscribeToEvents(category: string, thing_id: number): void;
    waitForWebSocketOpen(websocket: ReconnectingWebSocket): Promise<void>;
    /**
     * Waits for a specific event to occur and resolves when a check function returns true.
     *
     * @param event - The event name to listen for.
     * @param check - A function that receives the event arguments and returns a boolean
     *                indicating if the desired condition is met.
     * @param options - Optional parameters to control the behavior of the wait:
     *   - `timeout`: Maximum time in milliseconds to wait for the event before rejecting. Default is 60000.
     *   - `multiple`: If true, resolve with all arguments; otherwise, resolve with the first or the full args array if multiple.
     *   - `once`: If true, remove the listener after the first match. Default is true.
     *   - `signal`: An AbortSignal to cancel the wait operation.
     * @returns A promise that resolves with the event arguments when the condition is met,
     *          or rejects if the timeout is reached or the operation is aborted.
     */
    waitFor(event: string, check: (...args: any[]) => boolean, options?: {
        timeout?: number;
        multiple?: boolean;
        once?: boolean;
        signal?: AbortSignal;
    }): Promise<any>;
    private handleMessage;
    handleCommand(message: Message['Message']): Promise<void>;
    parseArgs(args: string[], argsSchema: CommandArgsSchema, message: Message['Message']): Promise<any>;
    /**
     * Registers a new command.
     * @param command The name of the command.
     * @param argsSchema The schema of the command arguments.
     * @param handler The handler of the command.
     */
    registerCommand(command: string, argsSchema: CommandArgsSchema, handler: (message: Message['Message'], args: any) => Promise<void>): void;
    /**
     * Sends a message to the specified dialog.
     * @param dialogId The ID of the dialog.
     * @param text The text of the message.
     * @param replyToId The ID of the message to reply to. If not specified, the message won't be a reply.
     * @param photos_list The list of photos to attach. If not specified, the message won't have any photos.
     * @param attachments The list of attachments to attach. If not specified, the message won't have any attachments.
     * @param edit The ID of the message to edit. If not specified, the message won't be an edit.
     * @param repost The ID of the message to repost. If not specified, the message won't be a repost.
     * @returns A promise that resolves with the response of the API.
     */
    sendMessage(dialogId: number, text: string, replyToId?: number | null, photos_list?: any[] | null, attachments?: any[] | null, edit?: number | null, repost?: any): Promise<any>;
    getUser(userTag: string): Promise<any>;
    getPhoto(photoId: string): Promise<any>;
    deleteMessage(ID: number): Promise<void>;
}
declare const _default: {
    Client: typeof Client;
    Dev: {
        debug: boolean;
    };
    Logger: typeof Logger;
};
export default _default;
