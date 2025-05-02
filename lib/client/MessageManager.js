"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class MessageManager {
    constructor(api) {
        this.api = api;
    }
    enhanceMessage(message) {
        message.reply = async (text, photos_list = null, attachments = null) => {
            return await this.api.sendMessage(message.Dialog?.ID, text, message.ID, photos_list, attachments);
        };
        message.response = async (text, photos_list = null, attachments = null, edit = null) => {
            const response = await this.api.sendMessage(message.Dialog?.ID, text, message.ID, photos_list, attachments, edit);
            response.edit = async (newText, newPhotosList = photos_list, newAttachments = attachments) => {
                return await this.api.sendMessage(message.Dialog?.ID, newText, message.ID, newPhotosList, newAttachments, response.ID);
            };
            return response;
        };
        message.delete = async () => {
            return await this.api.deleteMessage(message.ID);
        };
        message.edit = async (text, replyToId, photos_list, attachments) => {
            return await this.api.sendMessage(message.Dialog?.ID, text || message.Text, replyToId || message.ReplyTo?.ID || null, photos_list || message.Photos, attachments || message.Attachments, message.ID);
        };
    }
}
exports.default = MessageManager;
