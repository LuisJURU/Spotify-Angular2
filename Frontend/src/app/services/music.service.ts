import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MusicService {
  private apiUrl = 'http://localhost:5000/api/music'; // URL del backend

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
}