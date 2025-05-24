import { RestClient } from '../RestClient';
import { PhotoModel, TrackData } from '@yurbajs/types';
/**
 * Ресурс для роботи з медіа (фото, аудіо, плейлисти)
 */
export declare class MediaResource {
    private client;
    constructor(client: RestClient);
    /**
     * Отримати фото за ID
     * @param photoId - ID фото
     * @returns Дані фото
     */
    getPhoto(photoId: string | number): Promise<PhotoModel>;
    /**
     * Завантажити фото
     * @param caption - Підпис до фото
     * @param photo - Файл фото
     * @param mode - Режим доступу (public, private)
     * @returns Завантажене фото
     */
    uploadPhoto(photo: File, caption: string, mode?: string): Promise<any>;
    /**
     * Видалити фото
     * @param photoId - ID фото
     * @returns Результат видалення
     */
    deletePhoto(photoId: number): Promise<any>;
    /**
     * Отримати трек за ID
     * @param trackId - ID треку
     * @returns Дані треку
     */
    getTrack(trackId: number): Promise<TrackData>;
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
    uploadTrack(audio: File, name: string, authorName: string, release: string, cover?: number, mode?: string): Promise<any>;
    /**
     * Отримати плейлист за ID
     * @param playlistId - ID плейлиста
     * @returns Дані плейлиста
     */
    getPlaylist(playlistId: number): Promise<any>;
    /**
     * Створити плейлист
     * @param name - Назва плейлиста
     * @param release - Дата релізу
     * @param description - Опис плейлиста
     * @param cover - ID обкладинки
     * @returns Створений плейлист
     */
    createPlaylist(name: string, release: string, description: string, cover: number): Promise<any>;
    /**
     * Оновити плейлист
     * @param playlistId - ID плейлиста
     * @param name - Назва плейлиста
     * @param release - Дата релізу
     * @param description - Опис плейлиста
     * @param cover - ID обкладинки
     * @returns Оновлений плейлист
     */
    updatePlaylist(playlistId: number, name: string, release: string, description: string, cover: number): Promise<any>;
    /**
     * Видалити плейлист
     * @param playlistId - ID плейлиста
     * @returns Результат видалення
     */
    deletePlaylist(playlistId: number): Promise<any>;
    /**
     * Додати трек до плейлиста
     * @param playlistId - ID плейлиста
     * @param trackId - ID треку
     * @returns Результат операції
     */
    addTrackToPlaylist(playlistId: number, trackId: number): Promise<any>;
    /**
     * Видалити трек з плейлиста
     * @param playlistId - ID плейлиста
     * @param trackId - ID треку
     * @returns Результат операції
     */
    removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<any>;
}
//# sourceMappingURL=MediaResource.d.ts.map