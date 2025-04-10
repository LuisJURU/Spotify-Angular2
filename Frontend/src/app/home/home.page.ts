import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service';
import { TrackService } from '../services/track.service';
import { IonicModule, AlertController, ActionSheetController } from '@ionic/angular';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
  standalone: true,
  imports: [
    NavbarComponent,
    CommonModule,
    IonicModule, // Esto incluye todos los componentes de Ionic
  ],
})
export class HomePage implements OnInit, OnDestroy {
  isSidebarOpen = false; // Estado de la sidebar
  viewedTracks: any[] = []; // Canciones vistas
  popularAlbums: any[] = []; // Álbumes populares
  playlists: any[] = []; // Lista de playlists
  private navigationSubscription!: Subscription; // Suscripción al evento de navegación
  private touchStartX = 0; // Coordenada inicial del toque
  username: string = ''; // Propiedad para almacenar el nombre de usuario

  constructor(
    private router: Router,
    private trackService: TrackService, // Inyecta el servicio
    private musicService: MusicService, // Usa MusicService
    private alertController: AlertController,
    private actionSheetController: ActionSheetController
  ) {}

  ngOnInit() {
    this.resetViewedTracks();
    this.loadViewedTracks();
    this.loadPopularAlbums();
    this.loadPlaylists();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = currentUser.username || 'Usuario';

    // Suscríbete al evento de creación de playlists
    this.musicService.playlistCreated$.subscribe((newPlaylist) => {
      if (newPlaylist) {
        this.playlists.push(newPlaylist); // Agrega la nueva playlist a la lista
        console.log('Nueva playlist añadida:', newPlaylist);
      }
    });

    this.navigationSubscription = this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd && event.url === '/home') {
        this.loadViewedTracks();
        this.loadPopularAlbums();
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

  loadPlaylists() {
    this.musicService.getPlaylists().subscribe({
      next: (response) => {
        console.log('Playlists cargadas desde el backend:', response); // Depuración
        this.playlists = response.map((playlist: any) => ({
          ...playlist,
          id: playlist._id, // Mapea `_id` a `id` si es necesario
        }));
      },
      error: (error) => {
        console.error('Error al cargar las playlists:', error);
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

  editPlaylist(playlist: any) {
    this.router.navigate(['/playlist-list'], {
      queryParams: {
        playlistId: playlist.id, // ID de la playlist
        playlistName: playlist.name, // Nombre de la playlist
      },
    });
  }

  savePlaylist(playlistName: string, songs: string[]) {
    this.musicService.createPlaylist(playlistName, songs).subscribe({
      next: (response) => {
        console.log('Playlist guardada:', response);
        this.playlists.push(response); // Agrega la nueva playlist a la lista local
      },
      error: (error) => {
        console.error('Error al guardar la playlist:', error);
      },
    });
  }
  async openOptions(playlist: any) {
    const actionSheet = await this.actionSheetController.create({
      header: 'Opciones',
      buttons: [
        {
          text: 'Editar',
          handler: () => {
            this.editPlaylist(playlist);
          },
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {
            this.confirmDeletePlaylist(playlist);
          },
        },
        {
          text: 'Cancelar',
          role: 'cancel',
        },
      ],
    });
  
    await actionSheet.present();
  }
  
  async confirmDeletePlaylist(playlist: any) {
    console.log('Objeto playlist recibido:', playlist); // Depuración
    if (!playlist || !playlist.id) {
      console.error('El objeto playlist no tiene un ID válido:', playlist);
      return;
    }

    const alert = await this.alertController.create({
      header: 'Confirmar eliminación',
      message: `¿Estás seguro de que deseas eliminar la playlist "${playlist.name}"?`,
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
        },
        {
          text: 'Eliminar',
          role: 'destructive',
          handler: () => {  
            this.musicService.deletePlaylist(playlist.id).subscribe({
              next: (response) => {
                console.log('Playlist eliminada:', response);
                this.playlists = this.playlists.filter((p) => p.id !== playlist.id);
              },
              error: (error) => {
                console.error('Error al eliminar la playlist:', error);
              },
            });
          },
        },
      ],
    });

    await alert.present();
  }
  
}