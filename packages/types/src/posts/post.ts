import { ShortUserModel } from '../users';

export interface PostModel {
    ID: number;
    Author: ShortUserModel;
    Target: ShortUserModel;
    Content: string;
    Photos: number[];
    Timestamp: number;
    Likes: {
        IsLikedByYou: boolean;
        Likes: number;
    };
    Comments: number;
    Reposts: number;
    IsAd: number;
    Language: number;
    RepostID: number;
}
