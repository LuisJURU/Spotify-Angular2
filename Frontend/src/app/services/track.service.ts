import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { BehaviorSubject } from 'rxjs'; 
@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private viewedTracksSubject = new BehaviorSubject<any[]>([]); // Observable para las canciones recientes
  viewedTracks$ = this.viewedTracksSubject.asObservable(); // Observable público

  constructor(private http: HttpClient) {}

  // Método para actualizar las canciones recientes
  updateViewedTracks(tracks: any[]) {
    this.viewedTracksSubject.next(tracks);
  }

  // Método para obtener las canciones recientes actuales
  getViewedTracks(): any[] {
    return this.viewedTracksSubject.getValue();
  }

  // Nuevo método para guardar una canción vista
  saveViewedTrack(email: string, track: any): Observable<any> {
    return this.http.post('http://localhost:5000/api/user/viewed-tracks', { email, track });
  }
}