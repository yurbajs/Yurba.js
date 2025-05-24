"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthResource = void 0;
/**
 * Ресурс для роботи з автентифікацією
 */
class AuthResource {
    constructor(client) {
        this.client = client;
    }
    /**
     * Увійти за допомогою email та пароля
     * @param email - Email користувача
     * @param password - Пароль користувача
     * @returns Результат входу
     */
    async login(email, password) {
        return this.client.post('/login', { email, password });
    }
    /**
     * Зареєструвати нового користувача
     * @param name - Ім'я користувача
     * @param email - Email користувача
     * @param password - Пароль користувача
     * @param surname - Прізвище користувача
     * @returns Результат реєстрації
     */
    async register(name, email, password, surname = '') {
        return this.client.post('/register', { name, surname, email, password });
    }
    /**
     * Підтвердити реєстрацію кодом та капчею
     * @param code - Код підтвердження
     * @param hCaptchaResponse - Відповідь hCaptcha
     * @returns Результат підтвердження
     */
    async confirm(code, hCaptchaResponse) {
        return this.client.post('/confirm', { code, h_captcha_response: hCaptchaResponse });
    }
    /**
     * Скинути пароль за email
     * @param email - Email користувача
     * @returns Результат скидання
     */
    async resetPassword(email) {
        return this.client.post('/reset', { email });
    }
    /**
     * Активувати промокод
     * @param promo - Промокод
     * @returns Результат активації
     */
    async activatePromo(promo) {
        return this.client.get(`/promo/${promo}`);
    }
    /**
     * Отримати токени користувача
     * @returns Список токенів
     */
    async getTokens() {
        return this.client.get('/tokens');
    }
    /**
     * Вийти з системи (видалити сесію)
     * @returns Результат виходу
     */
    async logout() {
        return this.client.delete('/logout');
    }
}
exports.AuthResource = AuthResource;
//# sourceMappingURL=AuthResource.js.map