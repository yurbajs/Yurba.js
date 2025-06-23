import { RestClient } from '../RestClient';

/**
 * Ресурс для роботи з діалогами
 */
export class DialogResource {
  private client: RestClient;
  
  constructor(client: RestClient) {
    this.client = client;
  }
  
  /**
   * Отримати всі діалоги користувача
   * @returns Список діалогів
   */
  async getAll(): Promise<any> {
    return this.client.get<any>('/dialogs');
  }
  
  /**
   * Створити новий діалог
   * @param name - Назва діалогу
   * @param description - Опис діалогу
   * @param type - Тип діалогу
   * @returns Створений діалог
   */
  async create(name: string, description: string, type: string): Promise<any> {
    return this.client.post<any>('/dialogs', { name, description, type });
  }
  
  /**
   * Отримати учасників діалогу
   * @param dialogId - ID діалогу
   * @param lastId - ID останнього учасника для пагінації
   * @returns Список учасників
   */
  async getMembers(dialogId: number, page: number = 0): Promise<any> {
    
    return this.client.get<any>(`/dialogs/${dialogId}/members?page=${page}`);
  }
  
  /**
   * Додати користувача до діалогу
   * @param dialogId - ID діалогу
   * @param userId - ID користувача
   * @returns Результат операції
   */
  async addMember(dialogId: number, userId: number): Promise<any> {
    return this.client.post<any>(`/dialogs/${dialogId}/join/${userId}`, {});
  }
  
  /**
   * Видалити користувача з діалогу
   * @param dialogId - ID діалогу
   * @param userId - ID користувача
   * @returns Результат операції
   */
  async removeMember(dialogId: number, userId: number): Promise<any> {
    return this.client.delete<any>(`/dialogs/${dialogId}/leave/${userId}`);
  }
}