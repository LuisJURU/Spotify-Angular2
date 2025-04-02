import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private apiUrl = 'https://spotify-angular2-yoli.vercel.app/api/user'; // Cambia la URL base al backend en Vercel

  constructor(private http: HttpClient) {}

  // Método para obtener las canciones recientes
  getViewedTracks(username: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}/viewed-tracks/${username}`);
  }

  // Método para guardar una canción vista
  saveViewedTrack(username: string, track: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/viewed-tracks`, { username, track });
  }

}