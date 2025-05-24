import { RestClient } from '../RestClient';
import { UserModel, PhotoModel } from '@yurbajs/types';
/**
 * Ресурс для роботи з користувачами
 */
export declare class UserResource {
    private client;
    constructor(client: RestClient);
    /**
     * Отримати інформацію про поточного користувача
     * @returns Дані користувача
     */
    getMe(): Promise<UserModel>;
    /**
     * Отримати інформацію про користувача за тегом
     * @param tag - Тег користувача
     * @returns Дані користувача
     */
    getByTag(tag: string): Promise<UserModel>;
    /**
     * Отримати фотографії користувача
     * @param tag - Тег користувача
     * @param page - Номер сторінки
     * @param mode - Режим фотографій (0 - всі, 1 - публічні, 2 - приватні)
     * @returns Список фотографій
     */
    getPhotos(tag: string, page: number, mode?: number): Promise<PhotoModel[]>;
    /**
     * Отримати друзів користувача
     * @param tag - Тег користувача
     * @param page - Номер сторінки
     * @returns Список друзів
     */
    getFriends(tag: string, page: number): Promise<UserModel[]>;
    /**
     * Отримати вхідні запити в друзі
     * @param page - Номер сторінки
     * @returns Список запитів
     */
    getIncomingRequests(page: number): Promise<UserModel[]>;
    /**
     * Отримати вихідні запити в друзі
     * @param page - Номер сторінки
     * @returns Список запитів
     */
    getOutgoingRequests(page: number): Promise<UserModel[]>;
    /**
     * Відхилити вхідний запит в друзі
     * @param userId - ID користувача
     * @returns Результат операції
     */
    ignoreIncomingRequest(userId: number): Promise<boolean>;
    /**
     * Отримати відносини з користувачем
     * @param tag - Тег користувача
     * @returns Дані про відносини
     */
    getRelationships(tag: string): Promise<any>;
    /**
     * Підписатися на друзів користувача
     * @param tag - Тег користувача
     * @returns Результат операції
     */
    subscribeFriends(tag: string): Promise<any>;
    /**
     * Видалити поточний акаунт
     * @returns Результат операції
     */
    deleteAccount(): Promise<any>;
    /**
     * Відновити поточний акаунт
     * @returns Результат операції
     */
    restoreAccount(): Promise<any>;
}
//# sourceMappingURL=UserResource.d.ts.map