import { RestClient } from './RestClient';
import { UserResource } from './resources/UserResource';
import { MessageResource } from './resources/MessageResource';
import { DialogResource } from './resources/DialogResource';
import { PostResource } from './resources/PostResource';
import { MediaResource } from './resources/MediaResource';
import { AuthResource } from './resources/AuthResource';

/**
 * Головний клієнт для роботи з REST API Yurba.one
 */
export class YurbaRestClient {
  private client: RestClient;
  
  /**
   * Ресурс для роботи з користувачами
   */
  public users: UserResource;
  
  /**
   * Ресурс для роботи з повідомленнями
   */
  public messages: MessageResource;
  
  /**
   * Ресурс для роботи з діалогами
   */
  public dialogs: DialogResource;
  
  /**
   * Ресурс для роботи з постами
   */
  public posts: PostResource;
  
  /**
   * Ресурс для роботи з медіа
   */
  public media: MediaResource;
  
  /**
   * Ресурс для роботи з автентифікацією
   */
  public auth: AuthResource;
  
  /**
   * Створює новий клієнт для роботи з REST API Yurba.one
   * @param token - Токен авторизації
   * @param baseURL - Базовий URL API (за замовчуванням https://api.yurba.one)
   */
  constructor(token: string, baseURL: string = 'https://api.yurba.one') {
    this.client = new RestClient(token, baseURL);
    
    this.users = new UserResource(this.client);
    this.messages = new MessageResource(this.client);
    this.dialogs = new DialogResource(this.client);
    this.posts = new PostResource(this.client);
    this.media = new MediaResource(this.client);
    this.auth = new AuthResource(this.client);
  }
  
  /**
   * Підписатися на події
   * @param category - Категорія події
   * @param thingId - ID об'єкта
   * @returns Результат підписки
   */
  async subscribeToEvents(category: string, thingId: number): Promise<any> {
    const subscribeData = {
      command: 'subscribe',
      category: category,
      thing_id: thingId,
    };
    return this.client.post<any>('/subscribe', subscribeData);
  }
}