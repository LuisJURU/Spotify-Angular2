import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router'; // Importa NavigationEnd
import { Subscription } from 'rxjs'; // Importa Subscription
import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service'; // Importa MusicService
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
  IonIcon, } from '@ionic/angular/standalone';
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
    IonHeader,
    IonToolbar,
    IonContent,
    CommonModule,
  ],
})
export class HomePage implements OnInit, OnDestroy {
  isSidebarOpen = false; // Estado de la sidebar
  viewedTracks: any[] = []; // Canciones vistas
  popularAlbums: any[] = []; // Álbumes populares
  private navigationSubscription!: Subscription; // Suscripción al evento de navegación
  private touchStartX = 0; // Coordenada inicial del toque
  username: string = ''; // Propiedad para almacenar el nombre de usuario


  constructor(
    private router: Router,
    private trackService: TrackService, // Inyecta el servicio
    private musicService: MusicService, // Usa MusicService
    private http: HttpClient // Inyecta HttpClient
  ) {}

  ngOnInit() {
    this.resetViewedTracks(); // Limpia las canciones vistas al cargar la página
    this.loadViewedTracks(); // Carga las canciones recientes del usuario actual
    this.loadPopularAlbums(); // Cargar álbumes populares

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = currentUser.username || 'Usuario'; // Mostrar "Usuario" si no hay un nombre

    // Suscríbete al evento de navegación
    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.loadViewedTracks(); // Carga las canciones recientes al navegar a HomePage
        this.loadPopularAlbums(); // Recargar álbumes populares
      }
    });
  }

  ngOnDestroy() {
    // Cancela la suscripción al evento de navegación para evitar fugas de memoria
    if (this.navigationSubscription) {
      this.navigationSubscription.unsubscribe();
    }
  }

  resetViewedTracks() {
    this.viewedTracks = []; // Reinicia la lista de canciones vistas
  }

  loadViewedTracks() {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    const username = currentUser.username; // Obtén el username del usuario actual
  
    if (!username) {
      console.error('No se encontró el usuario actual.');
      this.viewedTracks = [];
      return;
    }
  
    // Reinicia las canciones vistas antes de cargar las nuevas
    this.resetViewedTracks();
  
    // Usar el servicio para obtener las canciones recientes
    this.trackService.getViewedTracks(username).subscribe({
      next: (response) => {
        this.viewedTracks = response; // Asigna las canciones obtenidas a la variable
        console.log('Canciones vistas cargadas:', this.viewedTracks);
      },
      error: (error) => {
        console.error('Error al cargar las canciones recientes:', error);
      },
    });
  }

  loadPopularAlbums() {
    this.musicService.getPopularAlbums().subscribe({
      next: (response) => {
        this.popularAlbums = response;
        console.log('Álbumes populares cargados:', this.popularAlbums);
      },
      error: (error) => {
        console.error('Error al cargar los álbumes populares:', error);
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
    localStorage.removeItem('jwtToken'); // Elimina el token
    localStorage.removeItem('currentUser'); // Elimina el usuario actual
  
    // Limpia las canciones vistas
    this.resetViewedTracks();
  
    // Redirige al usuario a la página de inicio de sesión
    this.router.navigate(['/login']);
  }
}