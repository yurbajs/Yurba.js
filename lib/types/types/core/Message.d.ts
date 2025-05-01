import { ShortUserModel } from "../users";
import { Dialog, Repost, ReplyTo } from "./";
export interface Message {
  Type: string;
  Message: {
    ID: number;
    Author: ShortUserModel;
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
    response?: (
      text: string,
      photos_list?: any[] | null,
      attachments?: any[] | null,
      edit?: number | null,
    ) => Promise<void>;
    reply?: (
      text: string,
      photos_list?: any[] | null,
      attachments?: any[] | null,
      edit?: number | null,
    ) => Promise<void>;
    delete?: () => Promise<void>;
    edit?: (
      text?: string,
      replyToId?: number | null,
      photos_list?: any[] | null,
      attachments?: any[] | null,
    ) => Promise<void>;
  };
}
//# sourceMappingURL=Message.d.ts.map
