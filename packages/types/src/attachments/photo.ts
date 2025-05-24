import { UserModel } from '../users';

export interface PhotoModel {
    ID: number;
    Author: UserModel['ID']; 
    Caption: string;
    Timestamp: number;
    Url: string;
}
