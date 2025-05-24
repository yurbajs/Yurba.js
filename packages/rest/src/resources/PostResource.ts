import { RestClient } from '../RestClient';
import { PostData, CommentData } from '@yurbajs/types';

/**
 * Ресурс для роботи з постами
 */
export class PostResource {
  private client: RestClient;

  /**
   * Створює новий ресурс для роботи з постами
   * @param client REST клієнт
   */
  constructor(client: RestClient) {
    this.client = client;
  }

  /**
   * Отримати пости користувача
   * @param tag Тег користувача
   * @param lastId ID останнього поста для пагінації
   * @param lang Код мови (опціонально)
   * @param feed Чи отримувати пости з стрічки (за замовчуванням false)
   * @returns Список постів
   */
  async getPosts(tag: string, lastId: number, lang?: string, feed: boolean = false): Promise<any[]> {
    const language = lang ? `&lang=${lang}` : '';
    return this.client.get<any[]>(`/user/${tag}/posts?last_id=${lastId}${language}&feed=${feed}`);
  }

  /**
   * Створити пост
   * @param tag Тег користувача
   * @param content Вміст поста
   * @param lang Код мови (за замовчуванням 0)
   * @param photos Список ID фото (за замовчуванням [])
   * @param nsfw Прапорець NSFW (за замовчуванням 0)
   * @param edit ID поста для редагування (за замовчуванням 0)
   * @param repost ID репоста (за замовчуванням 0)
   * @returns Створений пост
   */
  async create(
    tag: string,
    content: string,
    lang: number = 0,
    photos: any[] = [],
    nsfw: number = 0,
    edit: number = 0,
    repost: number = 0
  ): Promise<any> {
    const postData: PostData = {
      content,
      photos_list: photos,
      language: lang,
      nsfw,
      edit,
      repost,
    };
    return this.client.post<any>(`/user/${tag}/post`, postData);
  }

  /**
   * Видалити пост
   * @param postId ID поста
   * @returns Результат видалення
   */
  async delete(postId: number): Promise<any> {
    return this.client.delete<any>(`/posts/${postId}`);
  }

  /**
   * Редагувати пост
   * @param postId ID поста
   * @param content Новий вміст
   * @returns Відредагований пост
   */
  async edit(postId: number, content: string): Promise<any> {
    return this.client.patch<any>(`/posts/${postId}`, { content });
  }

  /**
   * Отримати коментарі до поста
   * @param postId ID поста
   * @param lastId ID останнього коментаря для пагінації
   * @returns Список коментарів
   */
  async getComments(postId: number, lastId: number): Promise<any[]> {
    return this.client.get<any[]>(`/posts/${postId}/comments?last_id=${lastId}`);
  }

  /**
   * Додати коментар до поста
   * @param postId ID поста
   * @param content Вміст коментаря
   * @param photos Список ID фото (за замовчуванням [])
   * @returns Доданий коментар
   */
  async addComment(postId: number, content: string, photos: any[] = []): Promise<any> {
    const commentData: CommentData = {
      content,
      photos_list: photos,
    };
    return this.client.post<any>(`/posts/${postId}/comment`, commentData);
  }

  /**
   * Видалити коментар
   * @param commentId ID коментаря
   * @returns Результат видалення
   */
  async deleteComment(commentId: number): Promise<any> {
    return this.client.delete<any>(`/comments/${commentId}`);
  }
}