import { RestClient } from '../RestClient';
/**
 * Ресурс для роботи з постами
 */
export declare class PostResource {
    private client;
    constructor(client: RestClient);
    /**
     * Отримати пости користувача
     * @param tag - Тег користувача
     * @param lastId - ID останнього поста для пагінації
     * @param lang - Код мови
     * @param feed - Чи отримувати пости з стрічки
     * @returns Список постів
     */
    getPosts(tag: string, lastId: number, lang?: string, feed?: boolean): Promise<any>;
    /**
     * Створити новий пост
     * @param tag - Тег користувача
     * @param content - Вміст поста
     * @param options - Додаткові опції поста
     * @returns Створений пост
     */
    create(tag: string, content: string, options?: {
        lang?: number;
        photos?: number[];
        nsfw?: number;
        repost?: number;
    }): Promise<any>;
    /**
     * Редагувати пост
     * @param postId - ID поста
     * @param content - Новий вміст поста
     * @returns Оновлений пост
     */
    update(postId: number, content: string): Promise<any>;
    /**
     * Видалити пост
     * @param postId - ID поста
     * @returns Результат видалення
     */
    delete(postId: number): Promise<any>;
    /**
     * Отримати коментарі до поста
     * @param postId - ID поста
     * @param lastId - ID останнього коментаря для пагінації
     * @returns Список коментарів
     */
    getComments(postId: number, lastId: number): Promise<any>;
    /**
     * Додати коментар до поста
     * @param postId - ID поста
     * @param content - Вміст коментаря
     * @param photos - Список ID фотографій
     * @returns Створений коментар
     */
    addComment(postId: number, content: string, photos?: number[]): Promise<any>;
    /**
     * Видалити коментар
     * @param commentId - ID коментаря
     * @returns Результат видалення
     */
    deleteComment(commentId: number): Promise<any>;
}
//# sourceMappingURL=PostResource.d.ts.map