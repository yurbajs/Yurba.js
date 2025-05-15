import Apis from '../rest/Apis';
import { EventEmitter } from 'events';
import Logger from '../utils/Logger';
import { UserModel, CommandArgsSchema, CommandHandler, Message, PhotoModel } from '../types';
declare global {
    let botData: UserModel;
}
declare const Dev: {
    debug: boolean;
};
declare class Client extends EventEmitter {
    private token;
    private prefix;
    private wsm;
    api: Apis;
    private messageManager;
    private commandManager;
    private _user?;
    private middlewares;
    constructor(token: string, prefix?: string);
    private checkToken;
    /**
     * Getter for bot's user data (user info)
     * @returns {UserModel | undefined} The user data or undefined if not initialized.
     */
    get user(): UserModel | undefined;
    /**
     * Registers a new command.
     * @param command The name of the command.
     * @param argsSchema The schema of the command's arguments.
     * @param handler The handler of the command.
     *
     * @example
     * client.registerCommand('hello', { name: 'string' }, (message, args) => {
     *   console.log(`Hello, ${args.name}!`);
     * });
     *
     * @example
     * client.registerCommand('add', { a: 'int', b: 'int' }, (message, args) => {
     *   const sum = args.a + args.b;
     *   messege.reply(`The sum is ${sum}`);
     * });
     */
    registerCommand(command: string, argsSchema: CommandArgsSchema, handler: CommandHandler): void;
    /**
     * Returns the list of registered command names.
     * @returns {string[]} Array of command names.
     *
     * @example
     * const commands = client.getCommands();
     * console.log('Registered commands:', commands);
     * // Result: Registered commands: [ 'info', 'help' ]
     */
    getCommands(): string[];
    init(): Promise<void>;
    /**
     * Handles command messages.
     * @param msg The message object.
     */
    private handleCommandMessage;
    /**
     * Handles incoming messages.
     * Delegates message processing to MessageManager and command execution to CommandManager.
     * Emits events for other handlers.
     * @param message The incoming message object.
     */
    private handleMessage;
    /**
     * Waits for a specific event to occur and resolves when a check function returns true.
     *
     * @template T The type of arguments passed to the event.
     * @param event The event name to listen for.
     * @param check A function that receives the event arguments and returns a boolean
     *              indicating if the desired condition is met.
     * @param options Optional parameters:
     *   - `timeout`: Maximum time in milliseconds to wait for the event before rejecting. Default is 60000.
     *   - `multiple`: If true, resolves with all arguments as an array; otherwise, resolves with the first argument or the full args array if there are several.
     *   - `once`: If true, removes the listener after the first match. Default is true.
     *   - `signal`: An AbortSignal to cancel the wait operation.
     * @returns A promise that resolves with the event arguments when the condition is met,
     *          or rejects if the timeout is reached or the operation is aborted.
     *
     * @example 1
     * // Wait for a message with text "Hello"
     * await client.waitFor('message', msg => msg.Text === 'Hello', { timeout: 5000 });
     *
     * @example 2
     * // Wait for a custom event and get all arguments
     * const [arg1, arg2] = await client.waitFor('customEvent', () => true, { multiple: true });
     */
    waitFor<T extends any[] = any[]>(event: string, check: (...args: T) => boolean, options?: {
        timeout?: number;
        multiple?: boolean;
        signal?: AbortSignal;
    }): Promise<any>;
    /**
     * Sends a message to a dialog.
     * @param dialogId The ID of the dialog.
     * @param text The message text.
     * @param replyToId The ID of the message to reply to (optional).
     * @param photos_list List of photos to attach (optional).
     * @param attachments List of attachments (optional).
     * @param edit ID of the message to edit (optional).
     * @param repost Repost data (optional).
     * @returns A promise that resolves with the response data.
     */
    sendMessage(dialogId: number, text: string, replyToId?: number | null, photos_list?: any[] | null, attachments?: any[] | null, edit?: number | null, repost?: any): Promise<Message>;
    /**
     * Gets user information by user tag.
     * @param userTag The user's tag.
     * @returns A promise that resolves with the user data.
     */
    getUser(userTag: string): Promise<UserModel | null>;
    /**
     * Gets a photo from Yurba.
     * @param photoId The ID of the photo to get.
     * @returns A promise that resolves with the response of the API.
     */
    getPhoto(photoId: string): Promise<PhotoModel | null>;
    /**
     * Deletes a message by its ID.
     * @param ID The ID of the message to delete.
     */
    deleteMessage(ID: number): Promise<boolean>;
    /**
     * Adds a listener for the specified event.
     * @param event The event name or symbol.
     * @param listener The callback function.
     * @returns The Client instance.
     * @example
     * client.on('message', (msg) => {
     *   console.log('Received message:', msg);
     * });
     */
    on(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * Adds a one-time listener for the specified event.
     * The listener is invoked only the next time the event is fired, then removed.
     * @param event The event name or symbol.
     * @param listener The callback function.
     * @returns The Client instance.
     * @example
     * client.once('ready', () => {
     *   console.log('Bot is ready!');
     * });
     */
    once(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * Removes a listener for the specified event.
     * @param event The event name or symbol.
     * @param listener The callback function to remove.
     * @returns The Client instance.
     * @example
     * const handler = (msg) => {};
     * client.on('message', handler);
     * client.off('message', handler);
     */
    off(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * Emits the specified event with the given arguments.
     * @internal
     * @param event The event name or symbol.
     * @param args Arguments to pass to event listeners.
     * @returns True if the event had listeners, false otherwise.
     * @example
     ```
      client.emit('customEvent', { foo: 'bar' });
     ```
     */
    emit(event: string | symbol, ...args: any[]): boolean;
    /**
     * Removes a specific listener from the event.
     * Alias for off().
     * @param event The event name or symbol.
     * @param listener The callback function to remove.
     * @returns The Client instance.
     */
    removeListener(event: string | symbol, listener: (...args: any[]) => void): this;
    /**
     * Removes all listeners, or those of the specified event.
     * @param event The event name or symbol (optional).
     * @returns The Client instance.
     * @example
     * client.removeAllListeners('message');
     */
    removeAllListeners(event?: string | symbol): this;
    /**
     * Adds a middleware function to be executed for each incoming message.
     * @param middleware The middleware function.
     */
    use(middleware: (msg: Message) => Promise<void>): void;
}
declare const Version: string;
declare const Author: string;
export { Client, Dev, Logger, Version, Author };
//# sourceMappingURL=Client.d.ts.map