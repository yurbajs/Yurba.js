"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MediaResource = void 0;
/**
 * Ресурс для роботи з медіа (фото, аудіо, плейлисти)
 */
class MediaResource {
    constructor(client) {
        this.client = client;
    }
    /**
     * Отримати фото за ID
     * @param photoId - ID фото
     * @returns Дані фото
     */
    async getPhoto(photoId) {
        return this.client.get(`/photos/${photoId}`);
    }
    /**
     * Завантажити фото
     * @param caption - Підпис до фото
     * @param photo - Файл фото
     * @param mode - Режим доступу (public, private)
     * @returns Завантажене фото
     */
    async uploadPhoto(photo, caption, mode = 'public') {
        const formData = new FormData();
        formData.append('photo', photo);
        formData.append('caption', caption);
        formData.append('mode', mode);
        return this.client.uploadFile('/photos', formData);
    }
    /**
     * Видалити фото
     * @param photoId - ID фото
     * @returns Результат видалення
     */
    async deletePhoto(photoId) {
        return this.client.delete(`/photos/${photoId}`);
    }
    /**
     * Отримати трек за ID
     * @param trackId - ID треку
     * @returns Дані треку
     */
    async getTrack(trackId) {
        return this.client.get(`/musebase/${trackId}`);
    }
    /**
     * Завантажити трек
     * @param audio - Аудіо файл
     * @param name - Назва треку
     * @param authorName - Ім'я автора
     * @param release - Дата релізу
     * @param cover - ID обкладинки
     * @param mode - Режим доступу
     * @returns Завантажений трек
     */
    async uploadTrack(audio, name, authorName, release, cover = 0, mode = 'public') {
        const formData = new FormData();
        formData.append('audio', audio);
        formData.append('name', name);
        formData.append('author', authorName);
        formData.append('release', release);
        formData.append('cover', cover.toString());
        formData.append('mode', mode);
        return this.client.uploadFile('/musebase/upload', formData);
    }
    /**
     * Отримати плейлист за ID
     * @param playlistId - ID плейлиста
     * @returns Дані плейлиста
     */
    async getPlaylist(playlistId) {
        return this.client.get(`/musebase/playlists/${playlistId}`);
    }
    /**
     * Створити плейлист
     * @param name - Назва плейлиста
     * @param release - Дата релізу
     * @param description - Опис плейлиста
     * @param cover - ID обкладинки
     * @returns Створений плейлист
     */
    async createPlaylist(name, release, description, cover) {
        const playlistData = { name, release, description, cover };
        return this.client.post('/musebase/playlists', playlistData);
    }
    /**
     * Оновити плейлист
     * @param playlistId - ID плейлиста
     * @param name - Назва плейлиста
     * @param release - Дата релізу
     * @param description - Опис плейлиста
     * @param cover - ID обкладинки
     * @returns Оновлений плейлист
     */
    async updatePlaylist(playlistId, name, release, description, cover) {
        const playlistData = { name, release, description, cover };
        return this.client.patch(`/musebase/playlists/${playlistId}`, playlistData);
    }
    /**
     * Видалити плейлист
     * @param playlistId - ID плейлиста
     * @returns Результат видалення
     */
    async deletePlaylist(playlistId) {
        return this.client.delete(`/musebase/playlists/${playlistId}`);
    }
    /**
     * Додати трек до плейлиста
     * @param playlistId - ID плейлиста
     * @param trackId - ID треку
     * @returns Результат операції
     */
    async addTrackToPlaylist(playlistId, trackId) {
        return this.client.post(`/musebase/playlists/${playlistId}/tracks/${trackId}`, {});
    }
    /**
     * Видалити трек з плейлиста
     * @param playlistId - ID плейлиста
     * @param trackId - ID треку
     * @returns Результат операції
     */
    async removeTrackFromPlaylist(playlistId, trackId) {
        return this.client.delete(`/musebase/playlists/${playlistId}/tracks/${trackId}`);
    }
}
exports.MediaResource = MediaResource;
//# sourceMappingURL=MediaResource.js.map