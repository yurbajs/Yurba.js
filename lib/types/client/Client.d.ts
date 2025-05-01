import Apis from "../rest/Apis";
import { EventEmitter } from "events";
import Logger from "../utils/Logger";
import { UserModel, CommandArgsSchema, CommandHandler } from "../types";
declare global {
  var botData: UserModel;
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
  constructor(token: string, prefix?: string);
  /**
   * Registers a new command.
   * @param command The command to register.
   * @param argsSchema The schema of the command's arguments.
   * @param handler The handler of the command.
   */
  registerCommand(
    command: string,
    argsSchema: CommandArgsSchema,
    handler: CommandHandler,
  ): void;
  init(): Promise<void>;
  private handleMessage;
  getMe(): Promise<UserModel>;
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
  waitFor(
    event: string,
    check: (...args: any[]) => boolean,
    options?: {
      timeout?: number;
      multiple?: boolean;
      once?: boolean;
      signal?: AbortSignal;
    },
  ): Promise<any>;
  sendMessage(
    dialogId: number,
    text: string,
    replyToId?: number | null,
    photos_list?: any[] | null,
    attachments?: any[] | null,
    edit?: number | null,
    repost?: any,
  ): Promise<any>;
  getUser(userTag: string): Promise<any>;
  /**
   * Gets a photo from Yurba.
   * @param photoId The ID of the photo to get.
   * @returns A promise that resolves with the response of the API.
   */
  getPhoto(photoId: string): Promise<any>;
  deleteMessage(ID: number): Promise<void>;
}
export { Client, Dev, Logger };
//# sourceMappingURL=Client.d.ts.map
