import { ShortUserModel } from '../users';
import { Language } from '../core';

export interface PostLikes {
  IsLikedByYou: boolean;
  Likes: number;
}

export interface PostModel {
  ID: number;
  Author: ShortUserModel;
  Target: ShortUserModel | null;
  Content: string;
  Photos: number[];
  Attachments: number[];
  Timestamp: number;
  EditTimestamp: number | null;
  Likes: PostLikes;
  Comments: number;
  Reposts: number;
  Views: number;
  IsAd: boolean;
  Language: Language;
  Repost: number | null;
  Nsfw: boolean;
}

interface BasePostData {
  content: string;
  photos_list: number[];
  language: Language;
  nsfw: boolean;
  attachments: number[];
}

export interface PostCreate extends BasePostData {
  edit?: PostModel["ID"];
  repost?: PostModel["ID"];
  timestamp?: number;
}

export interface PostEdit extends BasePostData {
  edit: PostModel["ID"];
  repost?: PostModel["ID"];
  timestamp?: number;
}

export type PostResponse = PostModel;

export interface PostDeleteRespone {
    ok: boolean
}

