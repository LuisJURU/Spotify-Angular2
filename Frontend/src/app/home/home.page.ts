import { Component } from '@angular/core';
import { Router } from '@angular/router'; // Importa el Router
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../navbar/navbar.component';
import { TrackService } from '../services/track.service'; // Importa el servicio
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonGrid,
  IonRow,
  IonCol,
  IonCard,
  IonCardContent,
  IonCardTitle,
  IonImg,
  IonButtons,
  IonButton,
  IonIcon,
  IonMenu, IonSearchbar } from '@ionic/angular/standalone';
import { HttpClient } from '@angular/common/http'; // Importa HttpClient

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [ 
    NavbarComponent,
    IonIcon,
    IonButtons,
    IonCardContent,
    IonCardTitle,
    IonCard,
    IonCol,
    IonRow,
    IonGrid,
    IonImg,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    CommonModule,
  ],
})
export class HomePage {
  isSidebarOpen = false; // Estado de la sidebar
  private touchStartX = 0; // Coordenada inicial del toque
  viewedTracks: any[] = []; // Canciones vistas

  constructor(
    private router: Router,
    private trackService: TrackService, // Inyecta el servicio
    private http: HttpClient // Inyecta HttpClient
  ) {}

  ngOnInit() {
    this.loadViewedTracks(); // Carga las canciones recientes al inicializarse
  }

  loadViewedTracks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const email = currentUser.email; // Obtén el email del usuario actual

    if (!email) {
      console.error('No se encontró el usuario actual.');
      this.viewedTracks = [];
      return;
    }

    // Obtener las canciones recientes del backend
    this.http.get(`/api/music/viewed-tracks/${email}`).subscribe({
      next: (response: any) => {
        this.viewedTracks = response;
        console.log('Canciones vistas cargadas:', this.viewedTracks);
      },
      error: (error) => {
        console.error('Error al cargar las canciones recientes:', error);
      },
    });
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

  goToSongDetail(trackId: string) {
    this.router.navigate(['/song-detail', trackId]);
  }

  goToSettings() {
    console.log('Navegando a Configuración...');
    // Aquí puedes redirigir a la página de configuración
  }

  logout() {
    // Elimina los datos de sesión almacenados
    localStorage.removeItem('jwtToken'); // Cambia 'authToken' por la clave que uses para almacenar el token
    // localStorage.removeItem('viewedTracks'); // Opcional: limpiar canciones vistas
  
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
    console.log('Sesión cerrada y redirigido al inicio de sesión.');
  }
}