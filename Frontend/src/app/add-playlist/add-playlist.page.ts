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
    if (!playlistId) {
      console.error('El ID de la playlist es inválido:', playlistId);
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

    this.musicService.addSongToPlaylist(playlistId, song).subscribe({
      next: async (response) => {
        console.log(`Canción agregada a la playlist con ID: ${playlistId}`, response);

        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La canción se agregó correctamente a la playlist.',
          buttons: ['Aceptar'],
        });

        await alert.present();
      },
      error: (error) => {
        console.error('Error al agregar la canción a la playlist:', error);
      },
    });
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