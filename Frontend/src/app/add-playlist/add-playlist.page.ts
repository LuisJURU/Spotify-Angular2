import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { AlertController, IonicModule } from '@ionic/angular';
import { MusicService } from '../services/music.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-playlist',
  templateUrl: './add-playlist.page.html',
  styleUrls: ['./add-playlist.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule],
})
export class AddPlaylistPage implements OnInit {
  playlists: any[] = [];
  newPlaylistName: string = '';
  selectedSong: any;
  selectedPlaylistToAdd: any = null; // Playlist seleccionada para agregar la canción

  constructor(
    private musicService: MusicService,
    private alertController: AlertController,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const selectedSongParam = this.route.snapshot.queryParamMap.get('selectedSong');
    if (selectedSongParam) {
      this.selectedSong = JSON.parse(selectedSongParam);
      console.log('Canción seleccionada:', this.selectedSong);
    } else {
      console.error('No se pasó ninguna canción seleccionada.');
    }

    this.loadPlaylists();

    // Suscríbete a los eventos de actualización de playlists
    this.musicService.playlistUpdated$.subscribe((updatedPlaylist) => {
      if (updatedPlaylist) {
        const index = this.playlists.findIndex((p) => p.id === updatedPlaylist.id || p._id === updatedPlaylist._id);
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
  }

  loadPlaylists() {
    this.musicService.getPlaylists().subscribe({
      next: (response) => {
        this.playlists = response.map((playlist: any) => ({
          ...playlist,
          id: playlist._id || playlist.id,
        }));
        console.log('Playlists cargadas:', this.playlists);
      },
      error: (error) => {
        console.error('Error al cargar las playlists:', error);
      },
    });
  }

  addToPlaylist(playlistId: string) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (!playlist) {
      console.error('No se encontró la playlist con el ID:', playlistId);
      return;
    }
    this.selectedPlaylistToAdd = playlist; // Asigna la playlist seleccionada
  }

  confirmAddToPlaylist() {
    if (!this.selectedPlaylistToAdd || !this.selectedPlaylistToAdd.id) {
      console.error('No hay una playlist válida seleccionada.');
      return;
    }

    const song = {
      id: this.selectedSong.id,
      name: this.selectedSong.name,
      artists: this.selectedSong.artists.join(', '),
      album: this.selectedSong.album.name,
      releaseDate: this.selectedSong.album.release_date,
      imageUrl: this.selectedSong.album.images[0]?.url,
    };

    this.musicService.addSongToPlaylist(this.selectedPlaylistToAdd.id, song).subscribe({
      next: (response) => {
        console.log(`Canción agregada a la playlist con ID: ${this.selectedPlaylistToAdd.id}`, response);

        // Actualiza la playlist en el arreglo
        const index = this.playlists.findIndex((p) => p.id === response.id || p._id === response._id);
        if (index !== -1) {
          this.playlists[index] = { ...this.playlists[index], ...response };
        }

        this.selectedPlaylistToAdd = null; // Limpia la selección
        this.router.navigate(['/home']); // Redirige al usuario al home
      },
      error: (error) => {
        console.error('Error al agregar la canción a la playlist:', error);
      },
    });
  }

  cancelAddToPlaylist() {
    this.selectedPlaylistToAdd = null; // Cancela la acción
  }

  createPlaylist() {
    if (!this.newPlaylistName.trim()) {
      console.error('El nombre de la playlist no puede estar vacío.');
      return;
    }

    const payload = {
      name: this.newPlaylistName,
      songs: [this.selectedSong],
    };

    this.musicService.createPlaylist(payload.name, payload.songs).subscribe({
      next: (playlist) => {
        console.log('Nueva playlist creada:', playlist);
        this.playlists.push({
          ...playlist,
          id: playlist._id || playlist.id,
        });
        this.newPlaylistName = '';
      },
      error: (error) => {
        console.error('Error al crear la playlist:', error);
      },
    });
  }

  goBack() {
    this.router.navigate(['/home']);
  }
}