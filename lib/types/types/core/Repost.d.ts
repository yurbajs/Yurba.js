import { ShortUserModel } from '../users';
export interface Repost {
    ID: number;
    Author: ShortUserModel;
    Target: any | null;
    Content: string;
    Photos: any[] | null;
    Timestamp: number;
    EditTimestamp: number;
    Likes: {
        IsLikedByYou: boolean;
        Likes: number;
    };
    Comments: number;
    Reposts: number;
    Views: number;
    IsAd: number;
    Language: number;
    Repost: Repost | null;
    Nsfw: number;
}
//# sourceMappingURL=Repost.d.ts.map