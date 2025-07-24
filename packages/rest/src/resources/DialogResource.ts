import { REST } from '../RestClient';
import { Dialog, DialogMember, CreateDialogPayload, Dtype } from '@yurbajs/types';


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
   * @param {string} name - Назва діалогу (макс. 330 символів)
   * @param {Dtype} type - Тип діалогу (тільки Channel або Group)
   * @param {Object} [options] - Додаткові опції
   * @param {string} [options.description] - Опис діалогу (макс. 330 символів)
   * @returns {Promise<Dialog>} Створений діалог
   * @throws {Error} Може кинути: auth_failed, invalid_type, upload_error або інші
   */
  async create(
    name: string,
    type: Dtype,
    options?: { description?: string }
  ): Promise<Dialog> {
    // Перевірка довжини
    if (name.length > 330) throw new Error('Name exceeds 330 characters');
    if (options?.description && options.description.length > 330)
      throw new Error('Description exceeds 330 characters');

    // Перевірка типу
    if (!Object.values(Dtype).includes(type))
      throw new Error('Invalid dialog type: only Channel and Group allowed');

    const payload: CreateDialogPayload = {
      name,
      type,
      ...options,
    };

    try {
      return await this.client.post<Dialog>('/dialogs', payload);
    } catch (err: any) {
      const detail = err?.response?.data?.detail;

      switch (detail) {
        case 'auth_failed':
          throw new Error('Authorization failed: invalid token');
        case 'invalid_type':
          throw new Error('Invalid dialog type');
        case 'upload_error':
          throw new Error('Failed to insert dialog into database');
        default:
          throw new Error(`Unexpected error: ${detail || err.message}`);
      }
    }
  }


  
  /**
 * Отримати учасників діалогу
 * @param {number} dialogId - ID діалогу (≥1)
 * @param {number} [page=0] - Номер сторінки для пагінації (≥0)
 * @returns {Promise<DialogMember[]>} Список учасників
 * @throws {Error} Може кинути: not_found, auth_failed, invalid_page або інші
 */
async getMembers(dialogId: number, page: number = 0): Promise<DialogMember[]> {
  // Перевірка аргументів
  if (dialogId < 1) throw new Error('Invalid dialogId');
  if (page < 0) throw new Error('Page number must be >= 0');

  try {
    return await this.client.get<DialogMember[]>(
      `/dialogs/${dialogId}/members?page=${page}`
    );
  } catch (err: any) {
    const detail = err?.response?.data?.detail;

    switch (detail) {
      case 'auth_failed':
        throw new Error('Authorization failed');
      case 'access_denied':
        throw new Error('Access denied or the dialog does not exist');
      default:
        throw new Error(`Unexpected error: ${detail || err.message}`);
    }
  }
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