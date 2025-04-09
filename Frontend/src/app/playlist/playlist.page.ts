import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // Importa Router
import { IonicModule } from '@ionic/angular';
import { MusicService } from '../services/music.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../navbar/navbar.component';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule, NavbarComponent],
})
export class PlaylistPage implements OnInit {
  playlistName: string = '';
  selectedSongs: { id: string; name: string }[] = [];
  isEditMode: boolean = false;
  playlistId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router, // Inyecta Router
    private musicService: MusicService
  ) {}

  ngOnInit() {
    // Obtener los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.playlistId = params['playlistId'] || null;
  
      // Solo asignar el nombre de la playlist si no está definido
      if (!this.playlistName) {
        this.playlistName = params['playlistName'] || 'Nueva Playlist';
      }
  
      this.isEditMode = !!this.playlistId; // Si hay un ID, estamos en modo edición
  
      // Si se pasa una canción desde la búsqueda, agregarla a la playlist
      const trackId = params['trackId'];
      const trackName = params['trackName'];
      if (trackId && trackName) {
        this.addSong({ id: trackId, name: trackName });
      }
    });
  
    if (this.isEditMode && this.playlistId) {
      this.loadPlaylist(this.playlistId);
    }
  }

  loadPlaylist(playlistId: string) {
    if (!playlistId) {
      console.error('El ID de la playlist es inválido.');
      return;
    }
  
    this.musicService.getPlaylists(playlistId).subscribe({
      next: (playlist) => {
        this.playlistName = playlist.name; // Asigna el nombre de la playlist
        this.selectedSongs = playlist.songs; // Carga las canciones en la lista
        console.log('Playlist cargada:', this.selectedSongs);
      },
      error: (error) => {
        console.error('Error al cargar la playlist:', error);
      },
    });
  }

  savePlaylist() {
    if (!this.playlistName.trim()) {
      console.error('El nombre de la playlist no puede estar vacío.');
      return;
    }
  
    if (this.selectedSongs.length === 0) {
      console.error('No hay canciones en la playlist.');
      return;
    }
  
    const payload = {
      name: this.playlistName,
      songs: this.selectedSongs,
    };
  
    if (this.isEditMode && this.playlistId) {
      // Actualizar playlist existente
      this.musicService.updatePlaylist(this.playlistId, payload).subscribe({
        next: (response) => {
          console.log('Playlist actualizada:', response);
          this.router.navigate(['/home']); // Redirige al home después de guardar
        },
        error: (error) => {
          console.error('Error al actualizar la playlist:', error);
        },
      });
    } else {
      // Crear nueva playlist
      this.musicService.createPlaylist(this.playlistName, this.selectedSongs).subscribe({
        next: (response) => {
          console.log('Playlist creada:', response);
          this.musicService.notifyPlaylistCreated(response); // Notifica la creación
          this.router.navigate(['/home']); // Redirige al home después de guardar
        },
        error: (error) => {
          console.error('Error al crear la playlist:', error);
        },
      });
    }
  }

  addSong(song: { id: string; name: string }) {
    // Verifica si la canción ya está en la lista antes de agregarla
    if (!this.selectedSongs.some((s) => s.id === song.id)) {
      this.selectedSongs.push(song);
      console.log('Canción agregada:', song);
    } else {
      console.log('La canción ya está en la playlist.');
    }
  }

  removeSong(songId: string) {
    this.selectedSongs = this.selectedSongs.filter((song) => song.id !== songId);
    console.log('Canción eliminada. Lista actualizada:', this.selectedSongs);
  }

  openAddSongModal() {
    // Redirige a la página de búsqueda con parámetros
    this.router.navigate(['/search'], {
      queryParams: {
        playlistId: this.playlistId,
      },
    });
  }
}