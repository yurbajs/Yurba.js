import { OnlineModel } from './';

export interface UserModel {
  ID: number;
  Name: string;
  Surname: string;
  Link: string;
  RegisterDate: number;
  Avatar: number;
  Banner: number;
  Status: string;
  About: string;
  Creative: boolean;
  Country: number;
  Region: number;
  City: number;
  CityNative: string;
  WorksAt: string;
  Birthday: string;
  Website: string;
  Languages: number[];
  Sub: number; // 0 - None, 1 - Yurba Plus, 2 - Yurba Premium
  Verify: string;
  Ban: boolean;
  Deleted: boolean;
  Reports: number;
  Emoji: string;

  Online: OnlineModel;

  OriginalAccount: number;
  CosmeticAvatar: number;
  Coins: number;

  Posts: number; // count of posts
  Friends: number; // count of friends
  Followers: number; // count of followers

  RelationshipState: string; // "strangers", "me_subscribed", "he_subscribed", "friends"
  PostState: number; // who can post on the wall (0 - all, 1 - friends, 2 - nobody)
  CommentsState: number; // who can comments the user's posts (0 - all, 1 - friends, 2 - nobody)
  AddFriendState: number; // who can send a friend request to user (1 - all, 0 - nobody)
  ViewFriendsState: number; // who can see the user's friends (0 - all, 1 - friends, 2 - nobody)
  SendMessageState: number; // who can send a message to the user (0 - all, 1 - friends, 2 - nobody)
  ViewAvatarState: number; // who can see the user's avatar (0 - all, 1 - friends, 2 - nobody)
  ViewBirthdayState: number; // who can see the user's birthday (0 - all, 1 - friends, 2 - nobody)
  SearchState: number; // display in search (1 - allow, 0 - disallow)
  OnlineType: number; // online display type (0 - default, 1 - approximate, 2 - invisible, the last one will get 0 to other people)

  Password?: string;
  Email?: string;
  EmailReserve?: string;
  TrackList?: number;
  
  NewMessages?: number;
  NewNotifications?: number;
  FriendsRequests?: number;
  Relationships?: number;
}

