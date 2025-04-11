import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MusicService } from '../services/music.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { NavbarComponent } from '../navbar/navbar.component';


@Component({
  selector: 'app-playlist-list',
  templateUrl: './playlist-list.page.html',
  styleUrls: ['./playlist-list.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule, NavbarComponent], // Importa los módulos necesarios
})
export class PlaylistListPage implements OnInit {
  playlistId: string | null = null;
  playlistName: string = '';
  songs: any[] = []; // Lista de canciones de la playlist

  constructor(private route: ActivatedRoute, private musicService: MusicService) {}

  ngOnInit() {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.playlistId = params['playlistId'];
      this.playlistName = params['playlistName'] || 'Nueva Playlist';

      if (this.playlistId) {
        this.loadPlaylist(this.playlistId);
      }
    });
  }

  loadPlaylist(playlistId: string) {
    this.musicService.getPlaylists(playlistId).subscribe({
      next: (playlist) => {
        console.log('Respuesta del backend:', playlist); // Depuración
        if (playlist && playlist.songs) {
          // Mapea `_id` a `id` en las canciones si es necesario
          this.songs = playlist.songs.map((song: any) => ({
            ...song,
            id: song._id, // Mapea `_id` a `id`
          }));
          console.log('Canciones de la playlist cargadas:', this.songs);
        } else {
          console.warn('No se encontraron canciones en la playlist.');
          this.songs = [];
        }
      },
      error: (error) => {
        console.error('Error al cargar la playlist:', error);
      },
    });
  }

  removeSong(songId: string) {
    if (!this.playlistId) {
      console.error('No se encontró el ID de la playlist.');
      return;
    }

    console.log('Eliminando canción con ID:', songId, 'de la playlist con ID:', this.playlistId);

    this.musicService.deleteSongFromPlaylist(this.playlistId, songId).subscribe({
      next: (response) => {
        console.log('Canción eliminada del backend:', response);
        // Actualiza la lista de canciones en el frontend
        this.songs = this.songs.filter((song) => song.id !== songId);
      },
      error: (error) => {
        console.error('Error al eliminar la canción:', error);
      },
    });
  }
}