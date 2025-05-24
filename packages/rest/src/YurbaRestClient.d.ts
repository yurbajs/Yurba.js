import { UserResource } from './resources/UserResource';
import { MessageResource } from './resources/MessageResource';
import { DialogResource } from './resources/DialogResource';
import { PostResource } from './resources/PostResource';
import { MediaResource } from './resources/MediaResource';
import { AuthResource } from './resources/AuthResource';
/**
 * Головний клієнт для роботи з REST API Yurba.one
 */
export declare class YurbaRestClient {
    private client;
    /**
     * Ресурс для роботи з користувачами
     */
    users: UserResource;
    /**
     * Ресурс для роботи з повідомленнями
     */
    messages: MessageResource;
    /**
     * Ресурс для роботи з діалогами
     */
    dialogs: DialogResource;
    /**
     * Ресурс для роботи з постами
     */
    posts: PostResource;
    /**
     * Ресурс для роботи з медіа
     */
    media: MediaResource;
    /**
     * Ресурс для роботи з автентифікацією
     */
    auth: AuthResource;
    /**
     * Створює новий клієнт для роботи з REST API Yurba.one
     * @param token - Токен авторизації
     * @param baseURL - Базовий URL API (за замовчуванням https://api.yurba.one)
     */
    constructor(token: string, baseURL?: string);
    /**
     * Підписатися на події
     * @param category - Категорія події
     * @param thingId - ID об'єкта
     * @returns Результат підписки
     */
    subscribeToEvents(category: string, thingId: number): Promise<any>;
}
//# sourceMappingURL=YurbaRestClient.d.ts.map