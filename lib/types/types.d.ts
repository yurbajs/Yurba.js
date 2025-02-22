export interface OnlineStatus {
    Online: boolean;
    LastBeen: number;
    Degree: string;
    Status: string;
}
export interface Author {
    ID: number;
    Name: string;
    Surname: string;
    Link: string;
    Avatar: number;
    Sub: number;
    Creative: number;
    Verify: string;
    Ban: number;
    Deleted: number;
    Emoji: string;
    CosmeticAvatar: number;
    Online: OnlineStatus;
    CommentsState: number;
    ViewAvatarState: number;
    RelationshipState: string;
}
export interface Dialog {
    ID: number;
    Type: string;
    Name: string;
    Avatar: number;
}
export interface ReplyTo {
    ID: number;
    Author: Author;
    Dialog: Dialog;
    Type: string;
    Text: string;
    Photos: any[] | null;
    ReplyTo: ReplyTo | null;
    Repost: Repost | null;
    Attachments: any[] | null;
    Timestamp: number;
    EditTimestamp: number;
    Read: boolean;
}
export interface Repost {
    ID: number;
    Author: Author;
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
export interface Message {
    Type: string;
    Message: {
        ID: number;
        Author: Author;
        Dialog: Dialog;
        Type: string;
        Text: string;
        Photos: any[];
        ReplyTo: ReplyTo;
        Repost: Repost;
        Attachments: any[];
        Timestamp: number;
        EditTimestamp: number;
        Read: boolean;
        response?: (text: string, photos_list?: any[] | null, attachments?: any[] | null, edit?: number | null) => Promise<void>;
        reply?: (text: string, photos_list?: any[] | null, attachments?: any[] | null, edit?: number | null) => Promise<void>;
        delete?: () => Promise<void>;
        edit?: (text?: string, replyToId?: number | null, photos_list?: any[] | null, attachments?: any[] | null) => Promise<void>;
    };
}
export interface BotData {
    ID: number;
    Name: string;
    Surname: string;
    Link: string;
    RegisterDate: number;
    Avatar: number;
    Banner: number;
    Status: string;
    About: string;
    Country: string;
    City: string;
    CityNative: string;
    WorksAt: string;
    Birthday: string;
    Relationships: number;
    Website: string;
    Languages: string[];
    Sub: number;
    Verify: 'None' | 'Default' | 'Organisation' | 'Goverment';
    Ban: number;
    Emoji: string;
    OriginalAccount: number;
    CosmeticAvatar: number;
    Coins: number;
    Posts: number;
    Friends: number;
    Followers: number;
    NewMessages: number;
    NewNotifications: number;
    FriendsRequests: number;
}
export interface CommandArgsSchema {
    [key: string]: string | [string, any] | [string, any, 'rest'];
}
export interface CommandHandler {
    handler: (message: Message['Message'], args: any) => Promise<void>;
    argsSchema: CommandArgsSchema;
}
export interface YurbaClientInfo {
    version: string;
    author: string;
    description: string;
    repository: string;
}
export type OptionType = "string" | "boolean" | "int" | "user" | "repost";
export type CommandArgsSchemaEntry = string | string[] | {
    [key: string]: any;
};
export interface CommandOption {
    name: string;
    type: OptionType;
    required: boolean;
    description: string;
    default?: any;
    rest?: boolean;
}
export interface CommandDefinition {
    name: string;
    description: string;
    options: CommandOption[];
    handler: (message: Message, args: any) => Promise<void>;
}
export interface ApiHeaders {
    [key: string]: string;
    Accept: string;
    token: string;
}
export interface MessageData {
    text: string;
    photos_list?: any[];
    replyTo?: number | null;
    edit?: number | null;
    attachments?: any[];
    repost?: any | null;
}
export interface PostData {
    content: string;
    photos_list?: any[];
    language?: number;
    nsfw?: number;
    edit?: number;
    repost?: number;
}
export interface CommentData {
    content: string;
    photos_list?: any[];
}
export interface PlaylistData {
    name: string;
    release: string;
    description: string;
    cover: number;
}
export interface TrackData {
    name: string;
    author: string;
    release: string;
    cover?: number;
    mode?: string;
}
export interface PageData {
    name: string;
    url: string;
    icon: string;
}
export interface AppData {
    name: string;
    redirectUrl: string;
}
