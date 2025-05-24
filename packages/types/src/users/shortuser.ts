import { UserModel } from './';

export type ShortUserModel = Pick<
  UserModel,
  'ID' | 'Name' | 'Surname' | 'Link' | 'Avatar' | 'Sub' | 'Creative' | 'Verify' | 'Ban' | 'Deleted' | 'Reports' | 'Emoji' | 'CosmeticAvatar' | 'Online' | 'CommentsState' | 'ViewAvatarState' | 'RelationshipState'
>;
