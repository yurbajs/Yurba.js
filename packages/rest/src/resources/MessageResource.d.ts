import { RestClient } from '../RestClient';
/**
 * Ресурс для роботи з повідомленнями
 */
export declare class MessageResource {
    private client;
    constructor(client: RestClient);
    /**
     * Отримати повідомлення з діалогу
     * @param dialogId - ID діалогу
     * @param lastId - ID останнього повідомлення для пагінації
     * @returns Список повідомлень
     */
    getMessages(dialogId: number, lastId?: number): Promise<any>;
    /**
     * Надіслати повідомлення в діалог
     * @param dialogId - ID діалогу
     * @param text - Текст повідомлення
     * @param options - Додаткові опції повідомлення
     * @returns Дані надісланого повідомлення
     */
    send(dialogId: number, text: string, options?: {
        replyToId?: number;
        photosList?: number[];
        attachments?: number[];
        edit?: number;
        repost?: number;
    }): Promise<any>;
    /**
     * Видалити повідомлення за ID
     * @param messageId - ID повідомлення
     * @returns Результат видалення
     */
    delete(messageId: number): Promise<boolean>;
    /**
     * Редагувати повідомлення
     * @param dialogId - ID діалогу
     * @param messageId - ID повідомлення
     * @param text - Новий текст повідомлення
     * @returns Оновлене повідомлення
     */
    edit(dialogId: number, messageId: number, text: string): Promise<any>;
}
//# sourceMappingURL=MessageResource.d.ts.map