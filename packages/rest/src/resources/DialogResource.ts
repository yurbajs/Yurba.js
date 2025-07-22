import { REST } from '../RestClient';
import { Dialog, DialogTypeInt } from '@yurbajs/types';


/**
 * Ресурс для роботи з діалогами
 */
export class DialogResource {
  private client: REST;
  
  constructor(client: REST) {
    this.client = client;
  }
  
  /**
   * Отримати всі діалоги
   * @since 0.1.7
   * @category Dialogs
   * @returns {Promise<Dialog[]} Список діалогів
   * 
   */
  async getAll(): Promise<Dialog[]> {
    return this.client.get<Dialog[]>('/dialogs');
  }
  
  /**
   * Створити новий діалог
   * @param {string} name - Назва діалогу
   * @param {string} description - Опис діалогу
   * @param {DialogTypeInt} type - Тип діалогу
   * @returns Створений діалог
   */
  async create(name: string, description: string, type: DialogTypeInt): Promise<any> {
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