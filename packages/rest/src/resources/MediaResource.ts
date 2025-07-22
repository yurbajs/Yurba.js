import { REST } from '../RestClient';
import {
  Photo,
  Track,
  Playlist,
} from '@yurbajs/types';

/**
 * Ресурс для роботи з медіа
 */
export class MediaResource {
  private client: REST;

  /**
   * Створює новий ресурс для роботи з медіа
   * @param client REST клієнт
   */
  constructor(client: REST) {
    this.client = client;
  }

  /**
   * Отримати фото за ID
   * @param photoId ID фото
   * @returns Дані фото
   */
  async getPhoto(photoId: string): Promise<Photo> {
    return this.client.get<Photo>(`/photos/${photoId}`);
  }

  /**
   * Видалити фото
   * @param photoId ID фото
   * @returns Результат видалення
   */
  async deletePhoto(photoId: number): Promise<any> {
    return this.client.delete<any>(`/photos/${photoId}`);
  }

  /**
   * Отримати трек за ID
   * @param trackId ID треку
   * @returns Дані треку
   */
  async getTrack(trackId: number): Promise<Track> {
    return this.client.get<Track>(`/musebase/${trackId}`);
  }

  /**
   * Створити плейлист
   * @param name Назва плейлиста
   * @param release Дата релізу
   * @param description Опис плейлиста
   * @param cover ID обкладинки
   * @returns Створений плейлист
   */
  async createPlaylist(name: string, release: string, description: string, cover: number): Promise<any> {
    const playlistData: Playlist = { name, release, description, cover };
    return this.client.post<any>('/musebase/playlists', playlistData);
  }

  /**
   * Видалити плейлист
   * @param playlistId ID плейлиста
   * @returns Результат видалення
   */
  async deletePlaylist(playlistId: number): Promise<any> {
    return this.client.delete<any>(`/musebase/playlists/${playlistId}`);
  }

  /**
   * Оновити плейлист
   * @param playlistId ID плейлиста
   * @param name Назва плейлиста
   * @param release Дата релізу
   * @param description Опис плейлиста
   * @param cover ID обкладинки
   * @returns Оновлений плейлист
   */
  async updatePlaylist(
    playlistId: number,
    name: string,
    release: string,
    description: string,
    cover: number
  ): Promise<any> {
    const playlistData: Playlist = { name, release, description, cover };
    return this.client.patch<any>(`/musebase/playlists/${playlistId}`, playlistData);
  }

  /**
   * Додати трек до плейлиста
   * @param playlistId ID плейлиста
   * @param trackId ID треку
   * @returns Результат додавання
   */
  async addTrackToPlaylist(playlistId: number, trackId: number): Promise<any> {
    return this.client.post<any>(`/musebase/playlists/${playlistId}/tracks/${trackId}`, {});
  }

  /**
   * Видалити трек з плейлиста
   * @param playlistId ID плейлиста
   * @param trackId ID треку
   * @returns Результат видалення
   */
  async removeTrackFromPlaylist(playlistId: number, trackId: number): Promise<any> {
    return this.client.delete<any>(`/musebase/playlists/${playlistId}/tracks/${trackId}`);
  }

  /**
   * Отримати плейлист за ID
   * @param playlistId ID плейлиста
   * @returns Дані плейлиста
   */
  async getPlaylist(playlistId: number): Promise<any> {
    return this.client.get<any>(`/musebase/playlists/${playlistId}`);
  }

  /**
   * Отримати плейлисти користувача
   * @param tag Тег користувача
   * @returns Список плейлистів
   */
  async getUserPlaylists(tag: string): Promise<any[]> {
    return this.client.get<any[]>(`/user/${tag}/playlists`);
  }
}
