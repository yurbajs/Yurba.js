"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DialogResource = void 0;
/**
 * Ресурс для роботи з діалогами
 */
class DialogResource {
    constructor(client) {
        this.client = client;
    }
    /**
     * Отримати всі діалоги користувача
     * @returns Список діалогів
     */
    async getAll() {
        return this.client.get('/dialogs');
    }
    /**
     * Створити новий діалог
     * @param name - Назва діалогу
     * @param description - Опис діалогу
     * @param type - Тип діалогу
     * @returns Створений діалог
     */
    async create(name, description, type) {
        return this.client.post('/dialogs', { name, description, type });
    }
    /**
     * Отримати учасників діалогу
     * @param dialogId - ID діалогу
     * @param lastId - ID останнього учасника для пагінації
     * @returns Список учасників
     */
    async getMembers(dialogId, lastId = 0) {
        return this.client.get(`/dialogs/${dialogId}/members`, { last_id: lastId });
    }
    /**
     * Додати користувача до діалогу
     * @param dialogId - ID діалогу
     * @param userId - ID користувача
     * @returns Результат операції
     */
    async addMember(dialogId, userId) {
        return this.client.post(`/dialogs/${dialogId}/join/${userId}`, {});
    }
    /**
     * Видалити користувача з діалогу
     * @param dialogId - ID діалогу
     * @param userId - ID користувача
     * @returns Результат операції
     */
    async removeMember(dialogId, userId) {
        return this.client.delete(`/dialogs/${dialogId}/leave/${userId}`);
    }
}
exports.DialogResource = DialogResource;
//# sourceMappingURL=DialogResource.js.map