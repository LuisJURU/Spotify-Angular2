import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private apiUrl = 'https://spotify-angular2-yoli.vercel.app/api/music'; // URL del backend

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

  createPlaylist(name: string, songs: string[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    return this.http.post(`${this.apiUrl}/playlists`, { name, songs }, { headers });
  }

  getPlaylists(playlistId: string): Observable<any[]> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    return this.http.get<any[]>(`${this.apiUrl}/playlists`, { headers });
  }

  updatePlaylist(id: string, songs: string[]): Observable<any> {
    const headers = new HttpHeaders({
      Authorization: `Bearer ${localStorage.getItem('jwtToken')}`, // Envía el token JWT
    });

    return this.http.put(`${this.apiUrl}/playlists/${id}`, { songs }, { headers });
  }
}