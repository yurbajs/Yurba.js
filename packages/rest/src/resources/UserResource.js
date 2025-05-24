"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserResource = void 0;
/**
 * Ресурс для роботи з користувачами
 */
class UserResource {
    constructor(client) {
        this.client = client;
    }
    /**
     * Отримати інформацію про поточного користувача
     * @returns Дані користувача
     */
    async getMe() {
        return this.client.get('/get_me');
    }
    /**
     * Отримати інформацію про користувача за тегом
     * @param tag - Тег користувача
     * @returns Дані користувача
     */
    async getByTag(tag) {
        return this.client.get(`/user/${tag}`);
    }
    /**
     * Отримати фотографії користувача
     * @param tag - Тег користувача
     * @param page - Номер сторінки
     * @param mode - Режим фотографій (0 - всі, 1 - публічні, 2 - приватні)
     * @returns Список фотографій
     */
    async getPhotos(tag, page, mode = 0) {
        return this.client.get(`/user/${tag}/photos`, { page, mode });
    }
    /**
     * Отримати друзів користувача
     * @param tag - Тег користувача
     * @param page - Номер сторінки
     * @returns Список друзів
     */
    async getFriends(tag, page) {
        return this.client.get(`/user/${tag}/friends`, { page });
    }
    /**
     * Отримати вхідні запити в друзі
     * @param page - Номер сторінки
     * @returns Список запитів
     */
    async getIncomingRequests(page) {
        return this.client.get('/incoming_requests', { page });
    }
    /**
     * Отримати вихідні запити в друзі
     * @param page - Номер сторінки
     * @returns Список запитів
     */
    async getOutgoingRequests(page) {
        return this.client.get('/outcoming_requests', { page });
    }
    /**
     * Відхилити вхідний запит в друзі
     * @param userId - ID користувача
     * @returns Результат операції
     */
    async ignoreIncomingRequest(userId) {
        return this.client.delete(`/incoming_requests/${userId}`);
    }
    /**
     * Отримати відносини з користувачем
     * @param tag - Тег користувача
     * @returns Дані про відносини
     */
    async getRelationships(tag) {
        return this.client.get(`/user/${tag}/relationships`);
    }
    /**
     * Підписатися на друзів користувача
     * @param tag - Тег користувача
     * @returns Результат операції
     */
    async subscribeFriends(tag) {
        return this.client.patch(`/user/${tag}/subscribe`, {});
    }
    /**
     * Видалити поточний акаунт
     * @returns Результат операції
     */
    async deleteAccount() {
        return this.client.delete('/');
    }
    /**
     * Відновити поточний акаунт
     * @returns Результат операції
     */
    async restoreAccount() {
        return this.client.post('/', {});
    }
}
exports.UserResource = UserResource;
//# sourceMappingURL=UserResource.js.map