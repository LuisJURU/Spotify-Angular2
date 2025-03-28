import { Component } from '@angular/core';
import { MusicService } from '../services/music.service';
import { Router } from '@angular/router'; // Importa el Router
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSearchbar,
  IonList,
  IonItem,
  IonLabel,
  IonThumbnail, IonImg, IonGrid, IonRow, IonCol, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent, IonButtons, IonButton, IonIcon, 
  IonMenu} from '@ionic/angular/standalone';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [IonIcon, IonButton, IonButtons, IonCardContent, IonCardSubtitle, IonCardTitle, IonCardHeader, IonCard, IonCol, IonRow, IonGrid, IonImg, 
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonSearchbar,
    IonList,
    IonItem,
    IonLabel,
    IonThumbnail,
    CommonModule,
    IonMenu
  ],
})
export class HomePage {
  musicResults: any[] = []; // Canciones obtenidas de la búsqueda
  artistResults: any[] = []; // Artistas obtenidos de la búsqueda
  isSidebarOpen = false; // Estado de la sidebar
  private touchStartX = 0; // Coordenada inicial del toque

  constructor(private musicService: MusicService, private router: Router) {} // Inyecta el Router

  search(query: string) {
    if (!query.trim()) {
      this.musicResults = [];
      this.artistResults = [];
      return;
    }

    this.musicService.searchMusic(query).subscribe((response) => {
      this.musicResults = response.tracks; // Canciones
      this.artistResults = response.artists; // Artistas
      console.log(this.musicResults);
      
    });
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  goToSettings() {
    console.log('Navegando a Configuración...');
    // Aquí puedes redirigir a la página de configuración
  }

  logout() {
    console.log('Cerrando sesión...');
    // Aquí puedes implementar la lógica para cerrar sesión
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen; // Cambia el estado de la sidebar
  }

  onTouchStart(event: TouchEvent) {
    this.touchStartX = event.touches[0].clientX; // Guarda la posición inicial del toque
  }

  onTouchEnd(event: TouchEvent) {
    const touchEndX = event.changedTouches[0].clientX; // Obtén la posición final del toque
    const swipeDistance = this.touchStartX - touchEndX;

    // Si el deslizamiento es hacia la izquierda y supera un umbral, cierra la sidebar
    if (swipeDistance > 50) {
      this.isSidebarOpen = false;
    }
  }

  goToSongDetail(songId: string) {
    this.router.navigate(['/song-detail', songId]); // Navega a la página de detalles de la canción
  }
}