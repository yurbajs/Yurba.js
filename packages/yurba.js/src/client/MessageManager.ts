import { Message, IMessageManager } from '@yurbajs/types';
import { REST } from '@yurbajs/rest';

/**
 * Менеджер повідомлень для клієнта
 */
export default class MessageManager implements IMessageManager {
  private api: REST;

  /**
   * Створює новий менеджер повідомлень
   * @param api REST клієнт
   */
  constructor(api: REST) {
    this.api = api;
  }

  /**
   * Розширює об'єкт повідомлення додатковими методами
   * @param message Об'єкт повідомлення
   */
  enhanceMessage(message: Message['Message']): void {
    /**
     * Відповідає на повідомлення
     * @param text Текст відповіді
     * @param photos_list Список фото (опціонально)
     * @param attachments Список вкладень (опціонально)
     * @returns Promise з результатом відправки
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
     * Відправляє повідомлення у відповідь
     * @param text Текст повідомлення
     * @param photos_list Список фото (опціонально)
     * @param attachments Список вкладень (опціонально)
     * @param edit ID повідомлення для редагування (опціонально)
     * @returns Promise з результатом відправки та методом edit для редагування
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
       * Редагує відправлене повідомлення
       * @param newText Новий текст
       * @param newPhotosList Новий список фото (за замовчуванням як у оригінальному повідомленні)
       * @param newAttachments Новий список вкладень (за замовчуванням як у оригінальному повідомленні)
       * @returns Promise з результатом редагування
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
     * Видаляє повідомлення
     * @returns Promise з результатом видалення
     */
    message.delete = async () => {
      await this.api.messages.delete(message.ID);
    };

    /**
     * Редагує повідомлення
     * @param text Новий текст (за замовчуванням як у оригінальному повідомленні)
     * @param replyToId ID повідомлення, на яке відповідаємо (за замовчуванням як у оригінальному повідомленні)
     * @param photos_list Новий список фото (за замовчуванням як у оригінальному повідомленні)
     * @param attachments Новий список вкладень (за замовчуванням як у оригінальному повідомленні)
     * @returns Promise з результатом редагування
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

    // Додаємо допоміжні методи для роботи з командами
    (message as any).isCommand = (prefix: string = '/') => {
      return message.Text && message.Text.startsWith(prefix);
    };

    /**
     * Отримує аргументи команди
     * @param prefix Префікс команди (за замовчуванням '/')
     * @returns Масив аргументів
     */
    (message as any).getCommandArgs = (prefix: string = '/') => {
      if (!message.Text || !message.Text.startsWith(prefix)) {
        return [];
      }

      const parts = message.Text.slice(prefix.length).split(' ');
      // Перший елемент - це назва команди, тому повертаємо все після неї
      return parts.slice(1);
    };

    /**
     * Отримує назву команди
     * @param prefix Префікс команди (за замовчуванням '/')
     * @returns Назва команди або null, якщо це не команда
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