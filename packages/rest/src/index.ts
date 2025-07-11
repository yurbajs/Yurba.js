import { REST, ApiError } from './RestClient';
import { UserResource } from './resources/UserResource';
import { MessageResource } from './resources/MessageResource';
import { DialogResource } from './resources/DialogResource';
import { PostResource } from './resources/PostResource';
import { MediaResource } from './resources/MediaResource';
import { AuthResource } from './resources/AuthResource';

// Розширюємо RestClient з ресурсами
class RestClient extends REST {
  public users: UserResource;
  public messages: MessageResource;
  public dialogs: DialogResource;
  public posts: PostResource;
  public media: MediaResource;
  public auth: AuthResource;

  constructor(token: string, baseURL: string = 'https://api.yurba.one') {
    super(token, baseURL);
    
    this.users = new UserResource(this);
    this.messages = new MessageResource(this);
    this.dialogs = new DialogResource(this);
    this.posts = new PostResource(this);
    this.media = new MediaResource(this);
    this.auth = new AuthResource(this);
  }
}

export {
  RestClient as REST,
  ApiError,
};

export default RestClient;