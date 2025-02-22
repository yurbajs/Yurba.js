"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Apis {
    /**
     * @param token - The token that is used for authentication.
     */
    constructor(token) {
        this.token = token;
        this.baseURL = 'https://api.yurba.one';
        this.headers = {
            Accept: 'application/json',
            token: this.token,
        };
    }
    getMe() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/get_me`, { headers: this.headers });
            return response.data;
        });
    }
    getUser(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/user/${tag}`, { headers: this.headers });
            return response.data;
        });
    }
    getPhoto(photoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/photos/${photoId}`, { headers: this.headers });
            return response.data;
        });
    }
    sendMessage(dialogId_1, text_1) {
        return __awaiter(this, arguments, void 0, function* (dialogId, text, replyToId = null, photos_list = null, attachments = null, edit = null, repost = null) {
            const messageData = {
                text,
                photos_list: photos_list || [],
                replyTo: replyToId || null,
                edit: edit || null,
                attachments: attachments || [],
                repost: repost || null,
            };
            const response = yield axios_1.default.post(`${this.baseURL}/dialogs/${dialogId}/messages`, messageData, { headers: this.headers });
            return response.data;
        });
    }
    deleteMessage(ID) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/dialogs/messages/${ID}`, { headers: this.headers });
            return response.data;
        });
    }
    subscribeToEvents(category, thing_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const subscribeData = {
                command: 'subscribe',
                category: category,
                thing_id: thing_id,
            };
            const response = yield axios_1.default.post(`${this.baseURL}/subscribe`, subscribeData, { headers: this.headers });
            return response.data;
        });
    }
    login(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/login`, { email, password }, { headers: this.headers });
            return response.data;
        });
    }
    register(name_1, email_1, password_1) {
        return __awaiter(this, arguments, void 0, function* (name, email, password, surname = '') {
            const response = yield axios_1.default.post(`${this.baseURL}/register`, { name, surname, email, password }, { headers: this.headers });
            return response.data;
        });
    }
    confirm(code, h_captcha_response) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/confirm`, { code, h_captcha_response }, { headers: this.headers });
            return response.data;
        });
    }
    resetPassword(email) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/reset`, { email }, { headers: this.headers });
            return response.data;
        });
    }
    deleteAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/`, { headers: this.headers });
            return response.data;
        });
    }
    restoreAccount() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/`, { headers: this.headers });
            return response.data;
        });
    }
    activatePromo(promo) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/promo/${promo}`, { headers: this.headers });
            return response.data;
        });
    }
    getUserTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/tokens`, { headers: this.headers });
            return response.data;
        });
    }
    getMessages(dialogId, last_id) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/dialogs/${dialogId}/messages?last_id=${last_id}`, { headers: this.headers });
            return response.data;
        });
    }
    getDialogs() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/dialogs`, { headers: this.headers });
            return response.data;
        });
    }
    createDialog(name, description, type) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/dialogs`, { name, description, type }, { headers: this.headers });
            return response.data;
        });
    }
    getDialogMembers(dialogId_1) {
        return __awaiter(this, arguments, void 0, function* (dialogId, last_id = 0) {
            const response = yield axios_1.default.get(`${this.baseURL}/dialogs/${dialogId}/members?last_id=${last_id}`, { headers: this.headers });
            return response.data;
        });
    }
    joinDialog(dialogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/dialogs/${dialogId}/join/${userId}`, {}, { headers: this.headers });
            return response.data;
        });
    }
    leaveDialog(dialogId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/dialogs/${dialogId}/leave/${userId}`, { headers: this.headers });
            return response.data;
        });
    }
    uploadPhoto(caption_1, photo_1) {
        return __awaiter(this, arguments, void 0, function* (caption, photo, mode = 'public') {
            const formData = new FormData();
            formData.append('photo', photo);
            formData.append('caption', caption);
            formData.append('mode', mode);
            const response = yield axios_1.default.post(`${this.baseURL}/photos`, formData, { headers: this.headers });
            return response.data;
        });
    }
    deletePhoto(photoId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/photos/${photoId}`, { headers: this.headers });
            return response.data;
        });
    }
    getUserPhotos(tag_1, page_1) {
        return __awaiter(this, arguments, void 0, function* (tag, page, mode = 0) {
            const response = yield axios_1.default.get(`${this.baseURL}/user/${tag}/photos?page=${page}&mode=${mode}`, { headers: this.headers });
            return response.data;
        });
    }
    getTrack(trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/musebase/${trackId}`, { headers: this.headers });
            return response.data;
        });
    }
    uploadTrack(name_1, authorName_1, release_1, audio_1) {
        return __awaiter(this, arguments, void 0, function* (name, authorName, release, audio, cover = 0, mode = 'public') {
            const formData = new FormData();
            formData.append('audio', audio);
            formData.append('name', name);
            formData.append('author', authorName);
            formData.append('release', release);
            formData.append('cover', cover.toString());
            formData.append('mode', mode);
            const response = yield axios_1.default.post(`${this.baseURL}/musebase/upload`, formData, { headers: this.headers });
            return response.data;
        });
    }
    createPlaylist(name, release, description, cover) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlistData = { name, release, description, cover };
            const response = yield axios_1.default.post(`${this.baseURL}/musebase/playlists`, playlistData, { headers: this.headers });
            return response.data;
        });
    }
    deletePlaylist(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/musebase/playlists/${playlistId}`, { headers: this.headers });
            return response.data;
        });
    }
    updatePlaylist(playlistId, name, release, description, cover) {
        return __awaiter(this, void 0, void 0, function* () {
            const playlistData = { name, release, description, cover };
            const response = yield axios_1.default.patch(`${this.baseURL}/musebase/playlists/${playlistId}`, playlistData, { headers: this.headers });
            return response.data;
        });
    }
    addPlaylistTrack(playlistId, trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/musebase/playlists/${playlistId}/tracks/${trackId}`, {}, { headers: this.headers });
            return response.data;
        });
    }
    deletePlaylistTrack(playlistId, trackId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/musebase/playlists/${playlistId}/tracks/${trackId}`, { headers: this.headers });
            return response.data;
        });
    }
    getPlaylist(playlistId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/musebase/playlists/${playlistId}`, { headers: this.headers });
            return response.data;
        });
    }
    getUserPlaylists(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/user/${tag}/playlists`, { headers: this.headers });
            return response.data;
        });
    }
    getPosts(tag_1, lastId_1, lang_1) {
        return __awaiter(this, arguments, void 0, function* (tag, lastId, lang, feed = false) {
            const language = lang ? `&lang=${lang}` : '';
            const response = yield axios_1.default.get(`${this.baseURL}/user/${tag}/posts?last_id=${lastId}${language}&feed=${feed}`, { headers: this.headers });
            return response.data;
        });
    }
    uploadPost(tag_1, content_1) {
        return __awaiter(this, arguments, void 0, function* (tag, content, lang = 0, photos = [], nsfw = 0, edit = 0, repost = 0) {
            const postData = { content, photos_list: photos, language: lang, nsfw, edit, repost };
            const response = yield axios_1.default.post(`${this.baseURL}/user/${tag}/post`, postData, { headers: this.headers });
            return response.data;
        });
    }
    deletePost(postId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/posts/${postId}`, { headers: this.headers });
            return response.data;
        });
    }
    editPost(postId, content) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.patch(`${this.baseURL}/posts/${postId}`, { content }, { headers: this.headers });
            return response.data;
        });
    }
    getComments(postId, lastId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/posts/${postId}/comments?last_id=${lastId}`, { headers: this.headers });
            return response.data;
        });
    }
    uploadComment(postId_1, content_1) {
        return __awaiter(this, arguments, void 0, function* (postId, content, photos = []) {
            const commentData = { content, photos_list: photos };
            const response = yield axios_1.default.post(`${this.baseURL}/posts/${postId}/comment`, commentData, { headers: this.headers });
            return response.data;
        });
    }
    deleteComment(commentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/comments/${commentId}`, { headers: this.headers });
            return response.data;
        });
    }
    getNotifications() {
        return __awaiter(this, arguments, void 0, function* (page = 0) {
            const response = yield axios_1.default.get(`${this.baseURL}/notifications?page=${page}`, { headers: this.headers });
            return response.data;
        });
    }
    getNotification(notificationId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/notifications/${notificationId}`, { headers: this.headers });
            return response.data;
        });
    }
    getCountries() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/countries`, { headers: this.headers });
            return response.data;
        });
    }
    getRegions(countryId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/countries/${countryId}/regions`, { headers: this.headers });
            return response.data;
        });
    }
    getCities(countryId, regionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/countries/${countryId}/regions/${regionId}/cities`, { headers: this.headers });
            return response.data;
        });
    }
    getLanguages() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/languages`, { headers: this.headers });
            return response.data;
        });
    }
    getUserPages() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/golink`, { headers: this.headers });
            return response.data;
        });
    }
    createPage(name, url, icon) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageData = { name, url, icon };
            const response = yield axios_1.default.post(`${this.baseURL}/golink`, pageData, { headers: this.headers });
            return response.data;
        });
    }
    updatePage(pageTag, name, url, icon) {
        return __awaiter(this, void 0, void 0, function* () {
            const pageData = { name, url, icon };
            const response = yield axios_1.default.patch(`${this.baseURL}/golink/${pageTag}`, pageData, { headers: this.headers });
            return response.data;
        });
    }
    deletePage(pageTag) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/golink/${pageTag}`, { headers: this.headers });
            return response.data;
        });
    }
    getGdvsAccounts() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`https://gdvs.yurba.one/api/accounts`, { headers: this.headers });
            return response.data;
        });
    }
    getArticle(articleId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/articles/${articleId}`, { headers: this.headers });
            return response.data;
        });
    }
    getArticleRevision(revisionId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/articles/revisions/${revisionId}`, { headers: this.headers });
            return response.data;
        });
    }
    getFriends(tag, page) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/user/${tag}/friends?page=${page}`, { headers: this.headers });
            return response.data;
        });
    }
    getIncomingRequests(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/incoming_requests?page=${page}`, { headers: this.headers });
            return response.data;
        });
    }
    getOutcomingRequests(page) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/outcoming_requests?page=${page}`, { headers: this.headers });
            return response.data;
        });
    }
    ignoreIncomingRequest(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/incoming_requests/${userId}`, { headers: this.headers });
            return response.data;
        });
    }
    getRelationships(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/user/${tag}/relationships`, { headers: this.headers });
            return response.data;
        });
    }
    subscribeFriends(tag) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.patch(`${this.baseURL}/user/${tag}/subscribe`, {}, { headers: this.headers });
            return response.data;
        });
    }
    getUserApps() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/apps`, { headers: this.headers });
            return response.data;
        });
    }
    createApp(name, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const appData = { name, redirectUrl };
            const response = yield axios_1.default.post(`${this.baseURL}/apps`, appData, { headers: this.headers });
            return response.data;
        });
    }
    deleteApp(appId) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/apps/${appId}`, { headers: this.headers });
            return response.data;
        });
    }
    getUserAppTokens() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/apps/tokens`, { headers: this.headers });
            return response.data;
        });
    }
    createUserAppToken(publicKey, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.post(`${this.baseURL}/apps/${publicKey}/token?redirectUrl=${redirectUrl}`, {}, { headers: this.headers });
            return response.data;
        });
    }
    deleteUserAppToken(appToken, publicKey, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/apps/tokens/${appToken}?publicKey=${publicKey}&redirectUrl=${redirectUrl}`, { headers: this.headers });
            return response.data;
        });
    }
    getApp(publicKey, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/apps/${publicKey}?redirectUrl=${redirectUrl}`, { headers: this.headers });
            return response.data;
        });
    }
    getUserAppToken(publicKey, redirectUrl) {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.get(`${this.baseURL}/apps/${publicKey}/token?redirectUrl=${redirectUrl}`, { headers: this.headers });
            return response.data;
        });
    }
    logout() {
        return __awaiter(this, void 0, void 0, function* () {
            const response = yield axios_1.default.delete(`${this.baseURL}/logout`, { headers: this.headers });
            return response.data;
        });
    }
}
exports.default = Apis;
