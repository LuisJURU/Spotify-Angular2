import { Component } from '@angular/core';
import { MusicService } from '../services/music.service';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail, IonImg, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCol, IonRow, IonGrid, IonImg, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    CommonModule
  ],
})
export class HomePage {
  musicResults: any[] = []; // Almacena los resultados de la búsqueda

  constructor(private musicService: MusicService) {}

  search(query: string) {
    if (!query) {
      this.musicResults = []; // Limpia los resultados si no hay búsqueda
      return;
    }

    this.musicService.searchMusic(query).subscribe(
      (response: any) => {
        this.musicResults = response; // Los datos ya están estructurados desde el backend
        console.log('Resultados de música:', this.musicResults);
      },
      (error) => {
        console.error('Error al buscar música:', error);
      }
    );
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
}