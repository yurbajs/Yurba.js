"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostResource = void 0;
/**
 * Ресурс для роботи з постами
 */
class PostResource {
    constructor(client) {
        this.client = client;
    }
    /**
     * Отримати пости користувача
     * @param tag - Тег користувача
     * @param lastId - ID останнього поста для пагінації
     * @param lang - Код мови
     * @param feed - Чи отримувати пости з стрічки
     * @returns Список постів
     */
    async getPosts(tag, lastId, lang, feed = false) {
        const params = { last_id: lastId, feed };
        if (lang)
            params.lang = lang;
        return this.client.get(`/user/${tag}/posts`, params);
    }
    /**
     * Створити новий пост
     * @param tag - Тег користувача
     * @param content - Вміст поста
     * @param options - Додаткові опції поста
     * @returns Створений пост
     */
    async create(tag, content, options = {}) {
        const postData = {
            content,
            photos_list: options.photos || [],
            language: options.lang || 0,
            nsfw: options.nsfw || 0,
            edit: 0,
            repost: options.repost || 0
        };
        return this.client.post(`/user/${tag}/post`, postData);
    }
    /**
     * Редагувати пост
     * @param postId - ID поста
     * @param content - Новий вміст поста
     * @returns Оновлений пост
     */
    async update(postId, content) {
        return this.client.patch(`/posts/${postId}`, { content });
    }
    /**
     * Видалити пост
     * @param postId - ID поста
     * @returns Результат видалення
     */
    async delete(postId) {
        return this.client.delete(`/posts/${postId}`);
    }
    /**
     * Отримати коментарі до поста
     * @param postId - ID поста
     * @param lastId - ID останнього коментаря для пагінації
     * @returns Список коментарів
     */
    async getComments(postId, lastId) {
        return this.client.get(`/posts/${postId}/comments`, { last_id: lastId });
    }
    /**
     * Додати коментар до поста
     * @param postId - ID поста
     * @param content - Вміст коментаря
     * @param photos - Список ID фотографій
     * @returns Створений коментар
     */
    async addComment(postId, content, photos = []) {
        const commentData = { content, photos_list: photos };
        return this.client.post(`/posts/${postId}/comment`, commentData);
    }
    /**
     * Видалити коментар
     * @param commentId - ID коментаря
     * @returns Результат видалення
     */
    async deleteComment(commentId) {
        return this.client.delete(`/comments/${commentId}`);
    }
}
exports.PostResource = PostResource;
//# sourceMappingURL=PostResource.js.map