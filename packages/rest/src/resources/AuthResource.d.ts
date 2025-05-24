import { RestClient } from '../RestClient';
/**
 * Ресурс для роботи з автентифікацією
 */
export declare class AuthResource {
    private client;
    constructor(client: RestClient);
    /**
     * Увійти за допомогою email та пароля
     * @param email - Email користувача
     * @param password - Пароль користувача
     * @returns Результат входу
     */
    login(email: string, password: string): Promise<any>;
    /**
     * Зареєструвати нового користувача
     * @param name - Ім'я користувача
     * @param email - Email користувача
     * @param password - Пароль користувача
     * @param surname - Прізвище користувача
     * @returns Результат реєстрації
     */
    register(name: string, email: string, password: string, surname?: string): Promise<any>;
    /**
     * Підтвердити реєстрацію кодом та капчею
     * @param code - Код підтвердження
     * @param hCaptchaResponse - Відповідь hCaptcha
     * @returns Результат підтвердження
     */
    confirm(code: string, hCaptchaResponse: string): Promise<any>;
    /**
     * Скинути пароль за email
     * @param email - Email користувача
     * @returns Результат скидання
     */
    resetPassword(email: string): Promise<any>;
    /**
     * Активувати промокод
     * @param promo - Промокод
     * @returns Результат активації
     */
    activatePromo(promo: string): Promise<any>;
    /**
     * Отримати токени користувача
     * @returns Список токенів
     */
    getTokens(): Promise<any>;
    /**
     * Вийти з системи (видалити сесію)
     * @returns Результат виходу
     */
    logout(): Promise<any>;
}
//# sourceMappingURL=AuthResource.d.ts.map