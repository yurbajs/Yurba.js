"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const axios_1 = __importDefault(require("axios"));
class Apis {
    /**
     * Creates an instance of the API client.
     * @param token - The token used for authentication.
     */
    constructor(token) {
        this.token = token;
        this.baseURL = 'https://api.yurba.one';
        this.headers = {
            Accept: 'application/json',
            token: this.token,
        };
    }
    /**
     * Get information about the current user.
     * @returns User data.
     */
    async getMe() {
        const response = await axios_1.default.get(`${this.baseURL}/get_me`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get user information by tag.
     * @param tag - User tag.
     * @returns User data.
     */
    async getUser(tag) {
        const response = await axios_1.default.get(`${this.baseURL}/user/${tag}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get photo by ID.
     * @param photoId - Photo ID.
     * @returns Photo data.
     */
    async getPhoto(photoId) {
        const response = await axios_1.default.get(`${this.baseURL}/photos/${photoId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Send a message to a dialog.
     * @param dialogId - Dialog ID.
     * @param text - Message text.
     * @param replyToId - ID of the message to reply to (optional).
     * @param photos_list - List of photo IDs (optional).
     * @param attachments - List of attachment IDs (optional).
     * @param edit - ID of the message to edit (optional).
     * @param repost - ID of the repost (optional).
     * @returns Sent message data.
     */
    async sendMessage(dialogId, text, replyToId = null, photos_list = null, attachments = null, edit = null, repost = null) {
        const messageData = {
            text,
            photos_list: photos_list || [],
            replyTo: replyToId || null,
            edit: edit || null,
            attachments: attachments || [],
            repost: repost || null,
        };
        const response = await axios_1.default.post(`${this.baseURL}/dialogs/${dialogId}/messages`, messageData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a message by ID.
     * @param ID - Message ID.
     * @returns Deletion result.
     */
    async deleteMessage(ID) {
        const response = await axios_1.default.delete(`${this.baseURL}/dialogs/messages/${ID}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Subscribe to events.
     * @param category - Event category.
     * @param thing_id - Object ID.
     * @returns Subscription result.
     */
    async subscribeToEvents(category, thing_id) {
        const subscribeData = {
            command: 'subscribe',
            category: category,
            thing_id: thing_id,
        };
        const response = await axios_1.default.post(`${this.baseURL}/subscribe`, subscribeData, { headers: this.headers });
        return response.data;
    }
    /**
     * Log in with email and password.
     * @param email - User email.
     * @param password - User password.
     * @returns Login result.
     */
    async login(email, password) {
        const response = await axios_1.default.post(`${this.baseURL}/login`, { email, password }, { headers: this.headers });
        return response.data;
    }
    /**
     * Register a new user.
     * @param name - User name.
     * @param email - User email.
     * @param password - User password.
     * @param surname - User surname (optional).
     * @returns Registration result.
     */
    async register(name, email, password, surname = '') {
        const response = await axios_1.default.post(`${this.baseURL}/register`, { name, surname, email, password }, { headers: this.headers });
        return response.data;
    }
    /**
     * Confirm registration with code and captcha.
     * @param code - Confirmation code.
     * @param h_captcha_response - hCaptcha response.
     * @returns Confirmation result.
     */
    async confirm(code, h_captcha_response) {
        const response = await axios_1.default.post(`${this.baseURL}/confirm`, { code, h_captcha_response }, { headers: this.headers });
        return response.data;
    }
    /**
     * Reset password by email.
     * @param email - User email.
     * @returns Reset result.
     */
    async resetPassword(email) {
        const response = await axios_1.default.post(`${this.baseURL}/reset`, { email }, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete the current account.
     * @returns Deletion result.
     */
    async deleteAccount() {
        const response = await axios_1.default.delete(`${this.baseURL}/`, { headers: this.headers });
        return response.data;
    }
    /**
     * Restore the current account.
     * @returns Restore result.
     */
    async restoreAccount() {
        const response = await axios_1.default.post(`${this.baseURL}/`, { headers: this.headers });
        return response.data;
    }
    /**
     * Activate a promo code.
     * @param promo - Promo code.
     * @returns Activation result.
     */
    async activatePromo(promo) {
        const response = await axios_1.default.get(`${this.baseURL}/promo/${promo}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get user tokens.
     * @returns List of tokens.
     */
    async getUserTokens() {
        const response = await axios_1.default.get(`${this.baseURL}/tokens`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get messages from a dialog.
     * @param dialogId - Dialog ID.
     * @param last_id - Last message ID for pagination.
     * @returns List of messages.
     */
    async getMessages(dialogId, last_id) {
        let response;
        if (last_id) {
            response = await axios_1.default.get(`${this.baseURL}/dialogs/${dialogId}/messages?last_id=${last_id}`, { headers: this.headers });
        }
        else {
            response = await axios_1.default.get(`${this.baseURL}/dialogs/${dialogId}/messages`, { headers: this.headers });
        }
        return response.data;
    }
    /**
     * Get all dialogs for the user.
     * @returns List of dialogs.
     */
    async getDialogs() {
        const response = await axios_1.default.get(`${this.baseURL}/dialogs`, { headers: this.headers });
        return response.data;
    }
    /**
     * Create a new dialog.
     * @param name - Dialog name.
     * @param description - Dialog description.
     * @param type - Dialog type.
     * @returns Created dialog data.
     */
    async createDialog(name, description, type) {
        const response = await axios_1.default.post(`${this.baseURL}/dialogs`, { name, description, type }, { headers: this.headers });
        return response.data;
    }
    /**
     * Get members of a dialog.
     * @param dialogId - Dialog ID.
     * @param last_id - Last member ID for pagination (optional).
     * @returns List of members.
     */
    async getDialogMembers(dialogId, last_id = 0) {
        const response = await axios_1.default.get(`${this.baseURL}/dialogs/${dialogId}/members?last_id=${last_id}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Join a dialog.
     * @param dialogId - Dialog ID.
     * @param userId - User ID.
     * @returns Join result.
     */
    async joinDialog(dialogId, userId) {
        const response = await axios_1.default.post(`${this.baseURL}/dialogs/${dialogId}/join/${userId}`, {}, { headers: this.headers });
        return response.data;
    }
    /**
     * Leave a dialog.
     * @param dialogId - Dialog ID.
     * @param userId - User ID.
     * @returns Leave result.
     */
    async leaveDialog(dialogId, userId) {
        const response = await axios_1.default.delete(`${this.baseURL}/dialogs/${dialogId}/leave/${userId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Upload a photo.
     * @param caption - Photo caption.
     * @param photo - Photo file.
     * @param mode - Photo mode (default: 'public').
     * @returns Uploaded photo data.
     */
    async uploadPhoto(caption, photo, mode = 'public') {
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('caption', caption);
        formData.append('mode', mode);
        const response = await axios_1.default.post(`${this.baseURL}/photos`, formData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a photo by ID.
     * @param photoId - Photo ID.
     * @returns Deletion result.
     */
    async deletePhoto(photoId) {
        const response = await axios_1.default.delete(`${this.baseURL}/photos/${photoId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get user photos.
     * @param tag - User tag.
     * @param page - Page number.
     * @param mode - Photo mode (default: 0).
     * @returns List of photos.
     */
    async getUserPhotos(tag, page, mode = 0) {
        const response = await axios_1.default.get(`${this.baseURL}/user/${tag}/photos?page=${page}&mode=${mode}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get a track by ID.
     * @param trackId - Track ID.
     * @returns Track data.
     */
    async getTrack(trackId) {
        const response = await axios_1.default.get(`${this.baseURL}/musebase/${trackId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Upload a track.
     * @param name - Track name.
     * @param authorName - Author name.
     * @param release - Release date.
     * @param audio - Audio file.
     * @param cover - Cover photo ID (default: 0).
     * @param mode - Track mode (default: 'public').
     * @returns Uploaded track data.
     */
    async uploadTrack(name, authorName, release, audio, cover = 0, mode = 'public') {
        const formData = new FormData();
        formData.append('audio', audio);
        formData.append('name', name);
        formData.append('author', authorName);
        formData.append('release', release);
        formData.append('cover', cover.toString());
        formData.append('mode', mode);
        const response = await axios_1.default.post(`${this.baseURL}/musebase/upload`, formData, { headers: this.headers });
        return response.data;
    }
    /**
     * Create a playlist.
     * @param name - Playlist name.
     * @param release - Release date.
     * @param description - Playlist description.
     * @param cover - Cover photo ID.
     * @returns Created playlist data.
     */
    async createPlaylist(name, release, description, cover) {
        const playlistData = { name, release, description, cover };
        const response = await axios_1.default.post(`${this.baseURL}/musebase/playlists`, playlistData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a playlist by ID.
     * @param playlistId - Playlist ID.
     * @returns Deletion result.
     */
    async deletePlaylist(playlistId) {
        const response = await axios_1.default.delete(`${this.baseURL}/musebase/playlists/${playlistId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Update a playlist.
     * @param playlistId - Playlist ID.
     * @param name - Playlist name.
     * @param release - Release date.
     * @param description - Playlist description.
     * @param cover - Cover photo ID.
     * @returns Updated playlist data.
     */
    async updatePlaylist(playlistId, name, release, description, cover) {
        const playlistData = { name, release, description, cover };
        const response = await axios_1.default.patch(`${this.baseURL}/musebase/playlists/${playlistId}`, playlistData, { headers: this.headers });
        return response.data;
    }
    /**
     * Add a track to a playlist.
     * @param playlistId - Playlist ID.
     * @param trackId - Track ID.
     * @returns Result of adding the track.
     */
    async addPlaylistTrack(playlistId, trackId) {
        const response = await axios_1.default.post(`${this.baseURL}/musebase/playlists/${playlistId}/tracks/${trackId}`, {}, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a track from a playlist.
     * @param playlistId - Playlist ID.
     * @param trackId - Track ID.
     * @returns Deletion result.
     */
    async deletePlaylistTrack(playlistId, trackId) {
        const response = await axios_1.default.delete(`${this.baseURL}/musebase/playlists/${playlistId}/tracks/${trackId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get a playlist by ID.
     * @param playlistId - Playlist ID.
     * @returns Playlist data.
     */
    async getPlaylist(playlistId) {
        const response = await axios_1.default.get(`${this.baseURL}/musebase/playlists/${playlistId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get playlists of a user.
     * @param tag - User tag.
     * @returns List of playlists.
     */
    async getUserPlaylists(tag) {
        const response = await axios_1.default.get(`${this.baseURL}/user/${tag}/playlists`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get posts of a user.
     * @param tag - User tag.
     * @param lastId - Last post ID for pagination.
     * @param lang - Language code (optional).
     * @param feed - Whether to get feed posts (default: false).
     * @returns List of posts.
     */
    async getPosts(tag, lastId, lang, feed = false) {
        const language = lang ? `&lang=${lang}` : '';
        const response = await axios_1.default.get(`${this.baseURL}/user/${tag}/posts?last_id=${lastId}${language}&feed=${feed}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Upload a post.
     * @param tag - User tag.
     * @param content - Post content.
     * @param lang - Language code (default: 0).
     * @param photos - List of photo IDs (default: []).
     * @param nsfw - NSFW flag (default: 0).
     * @param edit - Post ID to edit (default: 0).
     * @param repost - Repost ID (default: 0).
     * @returns Uploaded post data.
     */
    async uploadPost(tag, content, lang = 0, photos = [], nsfw = 0, edit = 0, repost = 0) {
        const postData = { content, photos_list: photos, language: lang, nsfw, edit, repost };
        const response = await axios_1.default.post(`${this.baseURL}/user/${tag}/post`, postData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a post by ID.
     * @param postId - Post ID.
     * @returns Deletion result.
     */
    async deletePost(postId) {
        const response = await axios_1.default.delete(`${this.baseURL}/posts/${postId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Edit a post.
     * @param postId - Post ID.
     * @param content - New content.
     * @returns Edited post data.
     */
    async editPost(postId, content) {
        const response = await axios_1.default.patch(`${this.baseURL}/posts/${postId}`, { content }, { headers: this.headers });
        return response.data;
    }
    /**
     * Get comments for a post.
     * @param postId - Post ID.
     * @param lastId - Last comment ID for pagination.
     * @returns List of comments.
     */
    async getComments(postId, lastId) {
        const response = await axios_1.default.get(`${this.baseURL}/posts/${postId}/comments?last_id=${lastId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Upload a comment to a post.
     * @param postId - Post ID.
     * @param content - Comment content.
     * @param photos - List of photo IDs (default: []).
     * @returns Uploaded comment data.
     */
    async uploadComment(postId, content, photos = []) {
        const commentData = { content, photos_list: photos };
        const response = await axios_1.default.post(`${this.baseURL}/posts/${postId}/comment`, commentData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a comment by ID.
     * @param commentId - Comment ID.
     * @returns Deletion result.
     */
    async deleteComment(commentId) {
        const response = await axios_1.default.delete(`${this.baseURL}/comments/${commentId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get notifications for the user.
     * @param page - Page number (default: 0).
     * @returns List of notifications.
     */
    async getNotifications(page = 0) {
        const response = await axios_1.default.get(`${this.baseURL}/notifications?page=${page}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get a notification by ID.
     * @param notificationId - Notification ID.
     * @returns Notification data.
     */
    async getNotification(notificationId) {
        const response = await axios_1.default.get(`${this.baseURL}/notifications/${notificationId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get the list of countries.
     * @returns List of countries.
     */
    async getCountries() {
        const response = await axios_1.default.get(`${this.baseURL}/countries`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get regions for a country.
     * @param countryId - Country ID.
     * @returns List of regions.
     */
    async getRegions(countryId) {
        const response = await axios_1.default.get(`${this.baseURL}/countries/${countryId}/regions`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get cities for a region.
     * @param countryId - Country ID.
     * @param regionId - Region ID.
     * @returns List of cities.
     */
    async getCities(countryId, regionId) {
        const response = await axios_1.default.get(`${this.baseURL}/countries/${countryId}/regions/${regionId}/cities`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get the list of supported languages.
     * @returns List of languages.
     */
    async getLanguages() {
        const response = await axios_1.default.get(`${this.baseURL}/languages`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get user pages (GoLinks).
     * @returns List of user pages.
     */
    async getUserPages() {
        const response = await axios_1.default.get(`${this.baseURL}/golink`, { headers: this.headers });
        return response.data;
    }
    /**
     * Create a new page (GoLink).
     * @param name - Page name.
     * @param url - Page URL.
     * @param icon - Page icon.
     * @returns Created page data.
     */
    async createPage(name, url, icon) {
        const pageData = { name, url, icon };
        const response = await axios_1.default.post(`${this.baseURL}/golink`, pageData, { headers: this.headers });
        return response.data;
    }
    /**
     * Update a page (GoLink).
     * @param pageTag - Page tag.
     * @param name - Page name.
     * @param url - Page URL.
     * @param icon - Page icon.
     * @returns Updated page data.
     */
    async updatePage(pageTag, name, url, icon) {
        const pageData = { name, url, icon };
        const response = await axios_1.default.patch(`${this.baseURL}/golink/${pageTag}`, pageData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a page (GoLink) by tag.
     * @param pageTag - Page tag.
     * @returns Deletion result.
     */
    async deletePage(pageTag) {
        const response = await axios_1.default.delete(`${this.baseURL}/golink/${pageTag}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get GDVS accounts.
     * @returns List of GDVS accounts.
     */
    async getGdvsAccounts() {
        const response = await axios_1.default.get(`https://gdvs.yurba.one/api/accounts`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get an article by ID.
     * @param articleId - Article ID.
     * @returns Article data.
     */
    async getArticle(articleId) {
        const response = await axios_1.default.get(`${this.baseURL}/articles/${articleId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get an article revision by ID.
     * @param revisionId - Revision ID.
     * @returns Article revision data.
     */
    async getArticleRevision(revisionId) {
        const response = await axios_1.default.get(`${this.baseURL}/articles/revisions/${revisionId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get friends of a user.
     * @param tag - User tag.
     * @param page - Page number.
     * @returns List of friends.
     */
    async getFriends(tag, page) {
        const response = await axios_1.default.get(`${this.baseURL}/user/${tag}/friends?page=${page}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get incoming friend requests.
     * @param page - Page number.
     * @returns List of incoming requests.
     */
    async getIncomingRequests(page) {
        const response = await axios_1.default.get(`${this.baseURL}/incoming_requests?page=${page}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get outgoing friend requests.
     * @param page - Page number.
     * @returns List of outgoing requests.
     */
    async getOutcomingRequests(page) {
        const response = await axios_1.default.get(`${this.baseURL}/outcoming_requests?page=${page}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Ignore an incoming friend request.
     * @param userId - User ID.
     * @returns Ignore result.
     */
    async ignoreIncomingRequest(userId) {
        const response = await axios_1.default.delete(`${this.baseURL}/incoming_requests/${userId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get relationships of a user.
     * @param tag - User tag.
     * @returns Relationship data.
     */
    async getRelationships(tag) {
        const response = await axios_1.default.get(`${this.baseURL}/user/${tag}/relationships`, { headers: this.headers });
        return response.data;
    }
    /**
     * Subscribe to a user's friends.
     * @param tag - User tag.
     * @returns Subscription result.
     */
    async subscribeFriends(tag) {
        const response = await axios_1.default.patch(`${this.baseURL}/user/${tag}/subscribe`, {}, { headers: this.headers });
        return response.data;
    }
    /**
     * Get user applications.
     * @returns List of user apps.
     */
    async getUserApps() {
        const response = await axios_1.default.get(`${this.baseURL}/apps`, { headers: this.headers });
        return response.data;
    }
    /**
     * Create a new application.
     * @param name - App name.
     * @param redirectUrl - Redirect URL.
     * @returns Created app data.
     */
    async createApp(name, redirectUrl) {
        const appData = { name, redirectUrl };
        const response = await axios_1.default.post(`${this.baseURL}/apps`, appData, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete an application by ID.
     * @param appId - App ID.
     * @returns Deletion result.
     */
    async deleteApp(appId) {
        const response = await axios_1.default.delete(`${this.baseURL}/apps/${appId}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get user app tokens.
     * @returns List of app tokens.
     */
    async getUserAppTokens() {
        const response = await axios_1.default.get(`${this.baseURL}/apps/tokens`, { headers: this.headers });
        return response.data;
    }
    /**
     * Create a user app token.
     * @param publicKey - App public key.
     * @param redirectUrl - Redirect URL.
     * @returns Created token data.
     */
    async createUserAppToken(publicKey, redirectUrl) {
        const response = await axios_1.default.post(`${this.baseURL}/apps/${publicKey}/token?redirectUrl=${redirectUrl}`, {}, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete a user app token.
     * @param appToken - App token.
     * @param publicKey - App public key.
     * @param redirectUrl - Redirect URL.
     * @returns Deletion result.
     */
    async deleteUserAppToken(appToken, publicKey, redirectUrl) {
        const response = await axios_1.default.delete(`${this.baseURL}/apps/tokens/${appToken}?publicKey=${publicKey}&redirectUrl=${redirectUrl}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get an application by public key.
     * @param publicKey - App public key.
     * @param redirectUrl - Redirect URL.
     * @returns App data.
     */
    async getApp(publicKey, redirectUrl) {
        const response = await axios_1.default.get(`${this.baseURL}/apps/${publicKey}?redirectUrl=${redirectUrl}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Get a user app token by public key.
     * @param publicKey - App public key.
     * @param redirectUrl - Redirect URL.
     * @returns Token data.
     */
    async getUserAppToken(publicKey, redirectUrl) {
        const response = await axios_1.default.get(`${this.baseURL}/apps/${publicKey}/token?redirectUrl=${redirectUrl}`, { headers: this.headers });
        return response.data;
    }
    /**
     * Delete user session.
     * @returns Logout result.
     */
    async logout() {
        const response = await axios_1.default.delete(`${this.baseURL}/logout`, { headers: this.headers });
        return response.data;
    }
}
exports.default = Apis;
