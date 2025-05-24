"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MessageResource = void 0;
/**
 * Ресурс для роботи з повідомленнями
 */
class MessageResource {
    constructor(client) {
        this.client = client;
    }
    /**
     * Отримати повідомлення з діалогу
     * @param dialogId - ID діалогу
     * @param lastId - ID останнього повідомлення для пагінації
     * @returns Список повідомлень
     */
    async getMessages(dialogId, lastId) {
        const params = lastId ? { last_id: lastId } : {};
        return this.client.get(`/dialogs/${dialogId}/messages`, params);
    }
    /**
     * Надіслати повідомлення в діалог
     * @param dialogId - ID діалогу
     * @param text - Текст повідомлення
     * @param options - Додаткові опції повідомлення
     * @returns Дані надісланого повідомлення
     */
    async send(dialogId, text, options = {}) {
        const messageData = {
            text,
            photos_list: options.photosList || [],
            replyTo: options.replyToId || null,
            edit: options.edit || null,
            attachments: options.attachments || [],
            repost: options.repost || null,
        };
        return this.client.post(`/dialogs/${dialogId}/messages`, messageData);
    }
    /**
     * Видалити повідомлення за ID
     * @param messageId - ID повідомлення
     * @returns Результат видалення
     */
    async delete(messageId) {
        return this.client.delete(`/dialogs/messages/${messageId}`);
    }
    /**
     * Редагувати повідомлення
     * @param dialogId - ID діалогу
     * @param messageId - ID повідомлення
     * @param text - Новий текст повідомлення
     * @returns Оновлене повідомлення
     */
    async edit(dialogId, messageId, text) {
        return this.send(dialogId, text, { edit: messageId });
    }
}
exports.MessageResource = MessageResource;
//# sourceMappingURL=MessageResource.js.map