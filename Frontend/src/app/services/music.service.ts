import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private apiUrl = 'https://spotify-angular2-yoli.vercel.app/api/music'; // URL del backend
  private playlistCreatedSubject = new BehaviorSubject<any>(null); // Emisor de eventos para playlists
  playlistCreated$ = this.playlistCreatedSubject.asObservable(); // Observable para escuchar eventos
  private playlistUpdatedSubject = new BehaviorSubject<any>(null); // Emisor de eventos para actualizaciones de playlists
  playlistUpdated$ = this.playlistUpdatedSubject.asObservable(); // Observable para escuchar eventos

  constructor(private http: HttpClient) {}

  getSongById(songId: string) {
    return this.http.get(`${this.apiUrl}/track/${songId}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
      },
    });
  }

  searchMusic(query: string) {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    return this.http.get<{ tracks: any[]; artists: any[] }>(`${this.apiUrl}/search`, { headers, params: { query } });
  }

  getPopularAlbums(): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    return this.http.get<any[]>(`${this.apiUrl}/popular`, { headers });
  }

  createPlaylist(name: string, songs: any[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    const payload = { name, songs };
    console.log('Payload enviado al backend:', payload); // Depuración

    return this.http.post(`${this.apiUrl}/playlists`, payload, { headers }).pipe(
      tap((response) => {
        this.notifyPlaylistUpdated(response); // Notifica la creación
      })
    );
  }

  getPlaylists(playlistId?: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });
  
    const url = playlistId ? `${this.apiUrl}/playlists/${playlistId}` : `${this.apiUrl}/playlists`;
    return this.http.get<any>(url, { headers });
  }

  updatePlaylist(id: string, data: { name: string; songs: any[] }): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });
  
    return this.http.put(`${this.apiUrl}/playlists/${id}`, data, { headers });
  }

  deletePlaylist(playlistId: string): Observable<any> {
    console.log('Eliminando playlist con ID:', playlistId); // Depuración
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    const url = `${this.apiUrl}/playlists/${playlistId}`;
    console.log('URL generada para eliminar la playlist:', url); // Depuración

    return this.http.delete(url, { headers });
  }

  deleteSongFromPlaylist(playlistId: string, songId: string): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });
  
    return this.http.delete(`${this.apiUrl}/playlists/${playlistId}/songs/${songId}`, { headers });
  }

  addSongToPlaylist(playlistId: string, song: any): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`,
    });

    return this.http.post(`${this.apiUrl}/playlists/${playlistId}/songs`, song, { headers }).pipe(
      tap((response) => {
        this.notifyPlaylistUpdated(response); // Notifica que la playlist fue actualizada
      })
    );
  }

  notifyPlaylistCreated(playlist: any) {
    this.playlistCreatedSubject.next(playlist); // Notifica que se creó una nueva playlist
  }

  notifyPlaylistUpdated(updatedPlaylist: any) {
    this.playlistUpdatedSubject.next(updatedPlaylist); // Emite el evento de actualización
  }
}