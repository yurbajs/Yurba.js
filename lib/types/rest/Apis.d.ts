import { UserModel, ShortUserModel } from "../types";
declare class Apis {
  private token;
  private baseURL;
  private headers;
  /**
   * Creates an instance of the API client.
   * @param token - The token used for authentication.
   */
  constructor(token: string);
  /**
   * Get information about the current user.
   * @returns User data.
   */
  getMe(): Promise<UserModel>;
  /**
   * Get user information by tag.
   * @param tag - User tag.
   * @returns User data.
   */
  getUser(tag: string): Promise<ShortUserModel>;
  /**
   * Get photo by ID.
   * @param photoId - Photo ID.
   * @returns Photo data.
   */
  getPhoto(photoId: string): Promise<any>;
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
  sendMessage(
    dialogId: number,
    text: string,
    replyToId?: number | null,
    photos_list?: number[] | null,
    attachments?: number[] | null,
    edit?: number | null,
    repost?: number | null,
  ): Promise<any>;
  /**
   * Delete a message by ID.
   * @param ID - Message ID.
   * @returns Deletion result.
   */
  deleteMessage(ID: number): Promise<any>;
  /**
   * Subscribe to events.
   * @param category - Event category.
   * @param thing_id - Object ID.
   * @returns Subscription result.
   */
  subscribeToEvents(category: string, thing_id: number): Promise<any>;
  /**
   * Log in with email and password.
   * @param email - User email.
   * @param password - User password.
   * @returns Login result.
   */
  login(email: string, password: string): Promise<any>;
  /**
   * Register a new user.
   * @param name - User name.
   * @param email - User email.
   * @param password - User password.
   * @param surname - User surname (optional).
   * @returns Registration result.
   */
  register(
    name: string,
    email: string,
    password: string,
    surname?: string,
  ): Promise<any>;
  /**
   * Confirm registration with code and captcha.
   * @param code - Confirmation code.
   * @param h_captcha_response - hCaptcha response.
   * @returns Confirmation result.
   */
  confirm(code: string, h_captcha_response: string): Promise<any>;
  /**
   * Reset password by email.
   * @param email - User email.
   * @returns Reset result.
   */
  resetPassword(email: string): Promise<any>;
  /**
   * Delete the current account.
   * @returns Deletion result.
   */
  deleteAccount(): Promise<any>;
  /**
   * Restore the current account.
   * @returns Restore result.
   */
  restoreAccount(): Promise<any>;
  /**
   * Activate a promo code.
   * @param promo - Promo code.
   * @returns Activation result.
   */
  activatePromo(promo: string): Promise<any>;
  /**
   * Get user tokens.
   * @returns List of tokens.
   */
  getUserTokens(): Promise<any>;
  /**
   * Get messages from a dialog.
   * @param dialogId - Dialog ID.
   * @param last_id - Last message ID for pagination.
   * @returns List of messages.
   */
  getMessages(dialogId: number, last_id: number): Promise<any>;
  /**
   * Get all dialogs for the user.
   * @returns List of dialogs.
   */
  getDialogs(): Promise<any>;
  /**
   * Create a new dialog.
   * @param name - Dialog name.
   * @param description - Dialog description.
   * @param type - Dialog type.
   * @returns Created dialog data.
   */
  createDialog(name: string, description: string, type: string): Promise<any>;
  /**
   * Get members of a dialog.
   * @param dialogId - Dialog ID.
   * @param last_id - Last member ID for pagination (optional).
   * @returns List of members.
   */
  getDialogMembers(dialogId: number, last_id?: number): Promise<any>;
  /**
   * Join a dialog.
   * @param dialogId - Dialog ID.
   * @param userId - User ID.
   * @returns Join result.
   */
  joinDialog(dialogId: number, userId: number): Promise<any>;
  /**
   * Leave a dialog.
   * @param dialogId - Dialog ID.
   * @param userId - User ID.
   * @returns Leave result.
   */
  leaveDialog(dialogId: number, userId: number): Promise<any>;
  /**
   * Upload a photo.
   * @param caption - Photo caption.
   * @param photo - Photo file.
   * @param mode - Photo mode (default: 'public').
   * @returns Uploaded photo data.
   */
  uploadPhoto(caption: string, photo: File, mode?: string): Promise<any>;
  /**
   * Delete a photo by ID.
   * @param photoId - Photo ID.
   * @returns Deletion result.
   */
  deletePhoto(photoId: number): Promise<any>;
  /**
   * Get user photos.
   * @param tag - User tag.
   * @param page - Page number.
   * @param mode - Photo mode (default: 0).
   * @returns List of photos.
   */
  getUserPhotos(tag: string, page: number, mode?: number): Promise<any>;
  /**
   * Get a track by ID.
   * @param trackId - Track ID.
   * @returns Track data.
   */
  getTrack(trackId: number): Promise<any>;
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
  uploadTrack(
    name: string,
    authorName: string,
    release: string,
    audio: File,
    cover?: number,
    mode?: string,
  ): Promise<any>;
  /**
   * Create a playlist.
   * @param name - Playlist name.
   * @param release - Release date.
   * @param description - Playlist description.
   * @param cover - Cover photo ID.
   * @returns Created playlist data.
   */
  createPlaylist(
    name: string,
    release: string,
    description: string,
    cover: number,
  ): Promise<any>;
  /**
   * Delete a playlist by ID.
   * @param playlistId - Playlist ID.
   * @returns Deletion result.
   */
  deletePlaylist(playlistId: number): Promise<any>;
  /**
   * Update a playlist.
   * @param playlistId - Playlist ID.
   * @param name - Playlist name.
   * @param release - Release date.
   * @param description - Playlist description.
   * @param cover - Cover photo ID.
   * @returns Updated playlist data.
   */
  updatePlaylist(
    playlistId: number,
    name: string,
    release: string,
    description: string,
    cover: number,
  ): Promise<any>;
  /**
   * Add a track to a playlist.
   * @param playlistId - Playlist ID.
   * @param trackId - Track ID.
   * @returns Result of adding the track.
   */
  addPlaylistTrack(playlistId: number, trackId: number): Promise<any>;
  /**
   * Delete a track from a playlist.
   * @param playlistId - Playlist ID.
   * @param trackId - Track ID.
   * @returns Deletion result.
   */
  deletePlaylistTrack(playlistId: number, trackId: number): Promise<any>;
  /**
   * Get a playlist by ID.
   * @param playlistId - Playlist ID.
   * @returns Playlist data.
   */
  getPlaylist(playlistId: number): Promise<any>;
  /**
   * Get playlists of a user.
   * @param tag - User tag.
   * @returns List of playlists.
   */
  getUserPlaylists(tag: string): Promise<any>;
  /**
   * Get posts of a user.
   * @param tag - User tag.
   * @param lastId - Last post ID for pagination.
   * @param lang - Language code (optional).
   * @param feed - Whether to get feed posts (default: false).
   * @returns List of posts.
   */
  getPosts(
    tag: string,
    lastId: number,
    lang?: string,
    feed?: boolean,
  ): Promise<any>;
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
  uploadPost(
    tag: string,
    content: string,
    lang?: number,
    photos?: any[],
    nsfw?: number,
    edit?: number,
    repost?: number,
  ): Promise<any>;
  /**
   * Delete a post by ID.
   * @param postId - Post ID.
   * @returns Deletion result.
   */
  deletePost(postId: number): Promise<any>;
  /**
   * Edit a post.
   * @param postId - Post ID.
   * @param content - New content.
   * @returns Edited post data.
   */
  editPost(postId: number, content: string): Promise<any>;
  /**
   * Get comments for a post.
   * @param postId - Post ID.
   * @param lastId - Last comment ID for pagination.
   * @returns List of comments.
   */
  getComments(postId: number, lastId: number): Promise<any>;
  /**
   * Upload a comment to a post.
   * @param postId - Post ID.
   * @param content - Comment content.
   * @param photos - List of photo IDs (default: []).
   * @returns Uploaded comment data.
   */
  uploadComment(postId: number, content: string, photos?: any[]): Promise<any>;
  /**
   * Delete a comment by ID.
   * @param commentId - Comment ID.
   * @returns Deletion result.
   */
  deleteComment(commentId: number): Promise<any>;
  /**
   * Get notifications for the user.
   * @param page - Page number (default: 0).
   * @returns List of notifications.
   */
  getNotifications(page?: number): Promise<any>;
  /**
   * Get a notification by ID.
   * @param notificationId - Notification ID.
   * @returns Notification data.
   */
  getNotification(notificationId: number): Promise<any>;
  /**
   * Get the list of countries.
   * @returns List of countries.
   */
  getCountries(): Promise<any>;
  /**
   * Get regions for a country.
   * @param countryId - Country ID.
   * @returns List of regions.
   */
  getRegions(countryId: number): Promise<any>;
  /**
   * Get cities for a region.
   * @param countryId - Country ID.
   * @param regionId - Region ID.
   * @returns List of cities.
   */
  getCities(countryId: number, regionId: number): Promise<any>;
  /**
   * Get the list of supported languages.
   * @returns List of languages.
   */
  getLanguages(): Promise<any>;
  /**
   * Get user pages (GoLinks).
   * @returns List of user pages.
   */
  getUserPages(): Promise<any>;
  /**
   * Create a new page (GoLink).
   * @param name - Page name.
   * @param url - Page URL.
   * @param icon - Page icon.
   * @returns Created page data.
   */
  createPage(name: string, url: string, icon: string): Promise<any>;
  /**
   * Update a page (GoLink).
   * @param pageTag - Page tag.
   * @param name - Page name.
   * @param url - Page URL.
   * @param icon - Page icon.
   * @returns Updated page data.
   */
  updatePage(
    pageTag: string,
    name: string,
    url: string,
    icon: string,
  ): Promise<any>;
  /**
   * Delete a page (GoLink) by tag.
   * @param pageTag - Page tag.
   * @returns Deletion result.
   */
  deletePage(pageTag: string): Promise<any>;
  /**
   * Get GDVS accounts.
   * @returns List of GDVS accounts.
   */
  getGdvsAccounts(): Promise<any>;
  /**
   * Get an article by ID.
   * @param articleId - Article ID.
   * @returns Article data.
   */
  getArticle(articleId: number): Promise<any>;
  /**
   * Get an article revision by ID.
   * @param revisionId - Revision ID.
   * @returns Article revision data.
   */
  getArticleRevision(revisionId: number): Promise<any>;
  /**
   * Get friends of a user.
   * @param tag - User tag.
   * @param page - Page number.
   * @returns List of friends.
   */
  getFriends(tag: string, page: number): Promise<any>;
  /**
   * Get incoming friend requests.
   * @param page - Page number.
   * @returns List of incoming requests.
   */
  getIncomingRequests(page: number): Promise<any>;
  /**
   * Get outgoing friend requests.
   * @param page - Page number.
   * @returns List of outgoing requests.
   */
  getOutcomingRequests(page: number): Promise<any>;
  /**
   * Ignore an incoming friend request.
   * @param userId - User ID.
   * @returns Ignore result.
   */
  ignoreIncomingRequest(userId: number): Promise<any>;
  /**
   * Get relationships of a user.
   * @param tag - User tag.
   * @returns Relationship data.
   */
  getRelationships(tag: string): Promise<any>;
  /**
   * Subscribe to a user's friends.
   * @param tag - User tag.
   * @returns Subscription result.
   */
  subscribeFriends(tag: string): Promise<any>;
  /**
   * Get user applications.
   * @returns List of user apps.
   */
  getUserApps(): Promise<any>;
  /**
   * Create a new application.
   * @param name - App name.
   * @param redirectUrl - Redirect URL.
   * @returns Created app data.
   */
  createApp(name: string, redirectUrl: string): Promise<any>;
  /**
   * Delete an application by ID.
   * @param appId - App ID.
   * @returns Deletion result.
   */
  deleteApp(appId: number): Promise<any>;
  /**
   * Get user app tokens.
   * @returns List of app tokens.
   */
  getUserAppTokens(): Promise<any>;
  /**
   * Create a user app token.
   * @param publicKey - App public key.
   * @param redirectUrl - Redirect URL.
   * @returns Created token data.
   */
  createUserAppToken(publicKey: string, redirectUrl: string): Promise<any>;
  /**
   * Delete a user app token.
   * @param appToken - App token.
   * @param publicKey - App public key.
   * @param redirectUrl - Redirect URL.
   * @returns Deletion result.
   */
  deleteUserAppToken(
    appToken: string,
    publicKey: string,
    redirectUrl: string,
  ): Promise<any>;
  /**
   * Get an application by public key.
   * @param publicKey - App public key.
   * @param redirectUrl - Redirect URL.
   * @returns App data.
   */
  getApp(publicKey: string, redirectUrl: string): Promise<any>;
  /**
   * Get a user app token by public key.
   * @param publicKey - App public key.
   * @param redirectUrl - Redirect URL.
   * @returns Token data.
   */
  getUserAppToken(publicKey: string, redirectUrl: string): Promise<any>;
  /**
   * Delete user session.
   * @returns Logout result.
   */
  logout(): Promise<any>;
}
export default Apis;
//# sourceMappingURL=Apis.d.ts.map
