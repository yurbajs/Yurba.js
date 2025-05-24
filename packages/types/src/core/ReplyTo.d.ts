import { ShortUserModel } from '../users';
import { Dialog, Repost } from './';
export interface ReplyTo {
    ID: number;
    Author: ShortUserModel;
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
//# sourceMappingURL=ReplyTo.d.ts.map