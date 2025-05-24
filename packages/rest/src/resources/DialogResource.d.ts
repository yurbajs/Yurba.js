import { RestClient } from '../RestClient';
/**
 * Ресурс для роботи з діалогами
 */
export declare class DialogResource {
    private client;
    constructor(client: RestClient);
    /**
     * Отримати всі діалоги користувача
     * @returns Список діалогів
     */
    getAll(): Promise<any>;
    /**
     * Створити новий діалог
     * @param name - Назва діалогу
     * @param description - Опис діалогу
     * @param type - Тип діалогу
     * @returns Створений діалог
     */
    create(name: string, description: string, type: string): Promise<any>;
    /**
     * Отримати учасників діалогу
     * @param dialogId - ID діалогу
     * @param lastId - ID останнього учасника для пагінації
     * @returns Список учасників
     */
    getMembers(dialogId: number, lastId?: number): Promise<any>;
    /**
     * Додати користувача до діалогу
     * @param dialogId - ID діалогу
     * @param userId - ID користувача
     * @returns Результат операції
     */
    addMember(dialogId: number, userId: number): Promise<any>;
    /**
     * Видалити користувача з діалогу
     * @param dialogId - ID діалогу
     * @param userId - ID користувача
     * @returns Результат операції
     */
    removeMember(dialogId: number, userId: number): Promise<any>;
}
//# sourceMappingURL=DialogResource.d.ts.map