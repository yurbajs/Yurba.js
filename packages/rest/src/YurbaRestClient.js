"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.YurbaRestClient = void 0;
const RestClient_1 = require("./RestClient");
const UserResource_1 = require("./resources/UserResource");
const MessageResource_1 = require("./resources/MessageResource");
const DialogResource_1 = require("./resources/DialogResource");
const PostResource_1 = require("./resources/PostResource");
const MediaResource_1 = require("./resources/MediaResource");
const AuthResource_1 = require("./resources/AuthResource");
/**
 * Головний клієнт для роботи з REST API Yurba.one
 */
class YurbaRestClient {
    /**
     * Створює новий клієнт для роботи з REST API Yurba.one
     * @param token - Токен авторизації
     * @param baseURL - Базовий URL API (за замовчуванням https://api.yurba.one)
     */
    constructor(token, baseURL = 'https://api.yurba.one') {
        this.client = new RestClient_1.RestClient(token, baseURL);
        this.users = new UserResource_1.UserResource(this.client);
        this.messages = new MessageResource_1.MessageResource(this.client);
        this.dialogs = new DialogResource_1.DialogResource(this.client);
        this.posts = new PostResource_1.PostResource(this.client);
        this.media = new MediaResource_1.MediaResource(this.client);
        this.auth = new AuthResource_1.AuthResource(this.client);
    }
    /**
     * Підписатися на події
     * @param category - Категорія події
     * @param thingId - ID об'єкта
     * @returns Результат підписки
     */
    async subscribeToEvents(category, thingId) {
        const subscribeData = {
            command: 'subscribe',
            category: category,
            thing_id: thingId,
        };
        return this.client.post('/subscribe', subscribeData);
    }
}
exports.YurbaRestClient = YurbaRestClient;
//# sourceMappingURL=YurbaRestClient.js.map