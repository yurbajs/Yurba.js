import { REST } from '../RestClient';
import { PostCreate, PostModel, PostEdit, PostDeleteRespone, Language } from '@yurbajs/types';

export class PostResource {
  constructor(private client: REST) {}

  async get(tag: string, lastId: number = 0, lang: Language = 0, feed: boolean = false): Promise<PostModel[]> {
    const language = lang ? `&lang=${lang}` : '';
    return this.client.get<PostModel[]>(`/user/${tag}/posts?last_id=${lastId}${language}&feed=${feed}`);
  }

  async create(tag: string, data: PostCreate): Promise<PostModel> {
    return this.client.post<PostModel>(`/user/${tag}/post`, data);
  }

  async delete(postId: number): Promise<PostDeleteRespone> {
    return this.client.delete<PostDeleteRespone>(`/posts/${postId}`);
  }

  async edit(postId: number, data: PostEdit): Promise<PostModel> {
    return this.client.patch<PostModel>(`/posts/${postId}`, data);
  }

  comments = {
    get: async (postId: number, lastId: number = 0) => 
      this.client.get(`/posts/${postId}/comments?last_id=${lastId}`),

    add: async (postId: number, content: string, photos: number[] = []) => 
      this.client.post(`/posts/${postId}/comment`, { content, photos_list: photos }),

    delete: async (commentId: number) => 
      this.client.delete(`/comments/${commentId}`)
  };
}