import { 
  Message, 
  IMessageManager, 
  EnhancedMessage, 
  MessageResponse, 
  PhotoAttachment, 
  Attachment 
} from '@yurbajs/types';
import { REST } from '@yurbajs/rest';

/**
 * Message manager for client
 */
export default class MessageManager implements IMessageManager {
  private api: REST;

  /**
   * Creates a new message manager
   * @param api REST client
   */
  constructor(api: REST) {
    this.api = api;
  }

  /**
   * Enhances message object with additional methods
   * @param message Message object
   */
  enhanceMessage(message: Message): void {
    /**
     * Replies to the message
     * @param text Reply text
     * @param photos_list List of photos (optional)
     * @param attachments List of attachments (optional)
     * @returns Promise with send result
     */
    message.reply = async (
      text: string,
      photos_list: any[] | null = null,
      attachments: any[] | null = null
    ) => {
      return await this.api.messages.send(
        message.Dialog?.ID as number,
        text,
        message.ID,
        photos_list,
        attachments
      );
    };

    /**
     * Sends a message in response
     * @param text Message text
     * @param photos_list List of photos (optional)
     * @param attachments List of attachments (optional)
     * @param edit Message ID for editing (optional)
     * @returns Promise with send result and edit method for editing
     */
    message.response = async (
      text: string,
      photos_list: any[] | null = null,
      attachments: any[] | null = null,
      edit?: number | null
    ) => {
      const response = await this.api.messages.send(
        message.Dialog?.ID as number,
        text,
        message.ID,
        photos_list,
        attachments,
        edit
      );

      /**
       * Edits the sent message
       * @param newText New text
       * @param newPhotosList New list of photos (defaults to original message)
       * @param newAttachments New list of attachments (defaults to original message)
       * @returns Promise with edit result
       */
      response.edit = async (
        newText: string,
        newPhotosList: any[] | null = photos_list,
        newAttachments: any[] | null = attachments
      ) => {
        return await this.api.messages.send(
          message.Dialog?.ID as number,
          newText,
          message.ID,
          newPhotosList,
          newAttachments,
          response.ID
        );
      };

      return response;
    };

    /**
     * Deletes the message
     * @returns Promise with deletion result
     */
    message.delete = async () => {
      await this.api.messages.delete(message.ID);
    };

    /**
     * Edits the message
     * @param text New text (defaults to original message)
     * @param replyToId ID of message to reply to (defaults to original message)
     * @param photos_list New list of photos (defaults to original message)
     * @param attachments New list of attachments (defaults to original message)
     * @returns Promise with edit result
     */
    message.edit = async (
      text?: string,
      replyToId?: number | null,
      photos_list?: any[] | null,
      attachments?: any[] | null
    ) => {
      return await this.api.messages.send(
        message.Dialog?.ID as number,
        text || message.Text,
        replyToId ?? message.ReplyTo?.ID ?? null,
        photos_list || message.Photos,
        attachments || message.Attachments,
        message.ID
      );
    };

    // Add helper methods for working with commands
    (message as any).isCommand = (prefix: string = '/') => {
      return message.Text && message.Text.startsWith(prefix);
    };

    /**
     * Gets command arguments
     * @param prefix Command prefix (default '/')
     * @returns Array of arguments
     */
    (message as any).getCommandArgs = (prefix: string = '/') => {
      if (!message.Text || !message.Text.startsWith(prefix)) {
        return [];
      }

      const parts = message.Text.slice(prefix.length).split(' ');
      // First element is the command name, so return everything after it
      return parts.slice(1);
    };

    /**
     * Gets command name
     * @param prefix Command prefix (default '/')
     * @returns Command name or null if not a command
     */
    (message as any).getCommandName = (prefix: string = '/') => {
      if (!message.Text || !message.Text.startsWith(prefix)) {
        return null;
      }

      const parts = message.Text.slice(prefix.length).split(' ');
      return parts[0];
    };
  }
}