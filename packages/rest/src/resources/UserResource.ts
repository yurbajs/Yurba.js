import { REST } from '../RestClient';
import { User, Photo } from '@yurbajs/types';

/**
 * Ресурс для роботи з користувачами
 */
export class UserResource {
  private client: REST;

  /**
   * Створює новий ресурс для роботи з користувачами
   * @param client REST клієнт
   */
  constructor(client: REST) {
    this.client = client;
  }

  /**
   * Отримати інформацію про поточного користувача
   * @returns Дані користувача
   */
  async getMe(): Promise<User> {
    return this.client.get<User>('/get_me');
  }

  /**
   * Отримати інформацію про користувача за тегом
   * @param tag Тег користувача
   * @returns Дані користувача
   */
  async getByTag(tag: string): Promise<User> {
    return this.client.get<User>(`/user/${tag}`);
  }

  /**
   * Отримати фотографії користувача
   * @param tag Тег користувача
   * @param page Номер сторінки
   * @param mode Режим (0 - всі, 1 - публічні, 2 - приватні)
   * @returns Список фотографій
   */
  async getPhotos(tag: string, page: number, mode: number = 0): Promise<Photo[]> {
    return this.client.get<Photo[]>(`/user/${tag}/photos?page=${page}&mode=${mode}`);
  }

  /**
   * Отримати друзів користувача
   * @param tag Тег користувача
   * @param page Номер сторінки
   * @returns Список друзів
   */
  async getFriends(tag: string, page: number): Promise<User[]> {
    return this.client.get<User[]>(`/user/${tag}/friends?page=${page}`);
  }

  /**
   * Отримати вхідні запити на дружбу
   * @param page Номер сторінки
   * @returns Список запитів
   */
  async getIncomingRequests(page: number): Promise<User[]> {
    return this.client.get<User[]>(`/incoming_requests?page=${page}`);
  }

  /**
   * Отримати вихідні запити на дружбу
   * @param page Номер сторінки
   * @returns Список запитів
   */
  async getOutgoingRequests(page: number): Promise<User[]> {
    return this.client.get<User[]>(`/outcoming_requests?page=${page}`);
  }

  /**
   * Ігнорувати вхідний запит на дружбу
   * @param userId ID користувача
   * @returns Результат операції
   */
  async ignoreIncomingRequest(userId: number): Promise<any> {
    return this.client.delete<any>(`/incoming_requests/${userId}`);
  }

  /**
   * Отримати відносини з користувачем
   * @param tag Тег користувача
   * @returns Дані про відносини
   */
  async getRelationships(tag: string): Promise<any> {
    return this.client.get<any>(`/user/${tag}/relationships`);
  }

  /**
   * Підписатися на друзів користувача
   * @param tag Тег користувача
   * @returns Результат підписки
   */
  async subscribeFriends(tag: string): Promise<any> {
    return this.client.patch<any>(`/user/${tag}/subscribe`, {});
  }
}
