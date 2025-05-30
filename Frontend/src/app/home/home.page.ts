import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs';
import { CommonModule } from '@angular/common';
import { MusicService } from '../services/music.service';
import { TrackService } from '../services/track.service';
import { IonicModule, AlertController } from '@ionic/angular';
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
  selectedPlaylistToDelete: any = null; // Nueva propiedad para manejar la playlist seleccionada

  constructor(
    private router: Router,
    private trackService: TrackService, // Inyecta el servicio
    private musicService: MusicService, // Usa MusicService
    private alertController: AlertController
  ) {}

  ngOnInit() {
    this.resetViewedTracks();
    this.loadViewedTracks();
    this.loadPopularAlbums();
    this.loadPlaylists();

    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    this.username = currentUser.username || 'Usuario';

    // Suscríbete al evento de actualización de playlists
    this.musicService.playlistUpdated$.subscribe((updatedPlaylist) => {
      if (updatedPlaylist) {
        const index = this.playlists.findIndex((p) => p.id === updatedPlaylist.id);
        if (index !== -1) {
          // Si la playlist ya existe, actualiza sus datos
          this.playlists[index] = { ...this.playlists[index], ...updatedPlaylist };
        } else {
          // Si no existe, agrégala al arreglo
          this.playlists.push(updatedPlaylist);
        }
        console.log('Playlist actualizada:', updatedPlaylist);
      }
    });

    // Suscríbete al evento de creación de playlists
    this.musicService.playlistCreated$.subscribe((newPlaylist) => {
      if (newPlaylist) {
        // Verifica si la playlist ya existe antes de agregarla
        const exists = this.playlists.some((playlist) => playlist.id === newPlaylist.id);
        if (!exists) {
          this.playlists.push(newPlaylist);
          console.log('Nueva playlist añadida:', newPlaylist);
        }
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
        this.playlists = this.playlists.filter(
          (playlist, index, self) =>
            index === self.findIndex((p) => p.id === playlist.id)
        );
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

        // Verifica si la playlist ya existe antes de agregarla
        const exists = this.playlists.some((playlist) => playlist.id === response.id);
        if (!exists) {
          this.playlists.push(response); // Agrega la nueva playlist solo si no existe
        }
      },
      error: (error) => {
        console.error('Error al guardar la playlist:', error);
      },
    });
  }

  toggleOptions(playlist: any): void {
    // Alterna la visibilidad del menú de opciones
    playlist.showOptions = !playlist.showOptions;

    // Cierra los menús de otras playlists
    this.playlists.forEach((p) => {
      if (p !== playlist) {
        p.showOptions = false;
      }
    });
  }

  confirmDeletePlaylist(playlist: any) {
    if (!playlist || !playlist.id) {
      console.error('El objeto playlist no tiene un ID válido:', playlist);
      return;
    }
    this.selectedPlaylistToDelete = playlist; // Asigna la playlist seleccionada
  }

  deletePlaylist() {
    if (!this.selectedPlaylistToDelete || !this.selectedPlaylistToDelete.id) {
      console.error('No hay una playlist válida para eliminar.');
      return;
    }
  
    const playlist = this.selectedPlaylistToDelete;
    console.log('ID de la playlist a eliminar:', playlist.id); // Depuración
  
    this.musicService.deletePlaylist(playlist.id).subscribe({
      next: (response) => {
        console.log('Playlist eliminada:', response);
        this.playlists = this.playlists.filter((p) => p.id !== playlist.id);
        this.selectedPlaylistToDelete = null; // Limpia la selección
      },
      error: (error) => {
        console.error('Error al eliminar la playlist:', error);
      },
    });
  }

  cancelDelete() {
    this.selectedPlaylistToDelete = null; // Cancela la eliminación
  }

  goToPlaylistDetail(playlist: any) {
    this.router.navigate(['/playlist-list'], {
      queryParams: {
        playlistId: playlist.id, // ID de la playlist
        playlistName: playlist.name, // Nombre de la playlist
      },
    });
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: Event): void {
    const target = event.target as HTMLElement;

    // Si el clic no es en un botón de opciones o en el menú flotante, cierra todos los menús
    if (!target.closest('.three-dots-btn') && !target.closest('.floating-menu')) {
      this.playlists.forEach((playlist) => (playlist.showOptions = false));
    }
  }
}