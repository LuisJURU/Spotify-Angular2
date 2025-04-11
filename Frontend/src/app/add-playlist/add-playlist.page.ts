import { Component, OnInit, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule, ModalController, AlertController } from '@ionic/angular';
import { Router } from '@angular/router';
import { MusicService } from '../services/music.service';

@Component({
  selector: 'app-add-playlist',
  templateUrl: './add-playlist.page.html',
  styleUrls: ['./add-playlist.page.scss'],
  standalone: true,
  imports: [IonicModule, CommonModule, FormsModule],
})
export class AddPlaylistPage implements OnInit {
  @Input() isModal: boolean = false; // Determina si el componente se usa como modal
  @Input() selectedSong: any; // Recibe la canción seleccionada como entrada
  playlists: any[] = []; // Lista de playlists
  newPlaylistName: string = ''; // Nombre de la nueva playlist
  selectedSongs: { id: string; name: string }[] = []; // Canciones seleccionadas para la playlist

  constructor(
    private musicService: MusicService,
    private modalController: ModalController, // Inyecta ModalController
    private alertController: AlertController, // Inyecta AlertController
    private router: Router // Inyecta Router
  ) {}

  ngOnInit() {
    if (!this.selectedSong) {
      console.error('No se pasó ninguna canción seleccionada al modal.');
      this.loadPlaylists();
      return;
    }

    console.log('Canción seleccionada en el modal:', this.selectedSong); // Depuración
    this.selectedSongs.push(this.selectedSong); // Agrega la canción seleccionada a la lista
    this.loadPlaylists();
  }

  loadPlaylists() {
    this.musicService.getPlaylists().subscribe({
      next: (response) => {
        this.playlists = response.map((playlist: any) => ({
          ...playlist,
          id: playlist._id || playlist.id, // Asegúrate de mapear `_id` o `id` correctamente
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
      artists: this.selectedSong.artists.join(', '), // Convierte el arreglo a una cadena
      album: this.selectedSong.album.name, // Envía solo el nombre del álbum
      releaseDate: this.selectedSong.album.release_date,
      imageUrl: this.selectedSong.album.images[0]?.url,
    };

    console.log('Agregando canción a la playlist:', song); // Depuración

    this.musicService.addSongToPlaylist(playlistId, song).subscribe({
      next: async (response) => {
        console.log(`Canción agregada a la playlist con ID: ${playlistId}`, response);

        // Notifica que la playlist ha sido actualizada
        this.musicService.notifyPlaylistUpdated({
          ...response,
          id: response._id || response.id, // Asegúrate de usar el ID correcto
        });

        // Muestra un mensaje de confirmación
        const alert = await this.alertController.create({
          header: 'Éxito',
          message: 'La canción se agregó correctamente a la playlist.',
          buttons: [
            {
              text: 'Aceptar',
              handler: () => {
                this.modalController.dismiss(); // Cierra el modal
                this.router.navigate(['/home']); // Redirige a la página de inicio
              },
            },
          ],
        });

        await alert.present();
      },
      error: (error) => {
        console.error('Error al agregar la canción a la playlist:', error); // Depuración
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
      songs: this.selectedSongs, // Incluye las canciones seleccionadas
    };

    this.musicService.createPlaylist(payload.name, payload.songs).subscribe({
      next: (playlist) => {
        console.log('Nueva playlist creada:', playlist);
        this.playlists.push({
          ...playlist,
          id: playlist._id || playlist.id, 
        }); 
        this.newPlaylistName = ''; // Limpia el campo de entrada
        this.selectedSongs = []; // Limpia las canciones seleccionadas
      },
      error: (error) => {
        console.error('Error al crear la playlist:', error);
      },
    });
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

  closeModal() {
    this.modalController.dismiss(); // Cierra el modal
  }

  private updateLocalPlaylist(playlistId: string, song: any) {
    const playlist = this.playlists.find((p) => p.id === playlistId);
    if (playlist) {
      if (!playlist.songs) {
        playlist.songs = [];
      }
      playlist.songs.push(song); // Agrega la canción a la lista local
      console.log('Lista local actualizada:', playlist);
    }
  }
}