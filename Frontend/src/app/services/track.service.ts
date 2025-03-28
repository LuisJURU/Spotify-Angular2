import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TrackService {
  private viewedTracksSubject = new BehaviorSubject<any[]>([]); // Observable para las canciones recientes
  viewedTracks$ = this.viewedTracksSubject.asObservable(); // Observable público

  // Método para actualizar las canciones recientes
  updateViewedTracks(tracks: any[]) {
    this.viewedTracksSubject.next(tracks);
  }

  // Método para obtener las canciones recientes actuales
  getViewedTracks(): any[] {
    return this.viewedTracksSubject.getValue();
  }
}