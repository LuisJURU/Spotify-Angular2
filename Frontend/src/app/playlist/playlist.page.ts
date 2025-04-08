import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ModalController } from '@ionic/angular';
import { MusicService } from '../services/music.service';
import { SearchPage } from '../search/search.page';

@Component({
  selector: 'app-playlist',
  templateUrl: './playlist.page.html',
  styleUrls: ['./playlist.page.scss'],
  standalone: true,
  imports: [
    FormsModule,
    IonicModule,
    CommonModule,
  ],
})
export class PlaylistPage implements OnInit {
  playlistName: string = '';
  availableSongs: { id: string; name: string }[] = [];
  selectedSongs: { id: string; name: string }[] = [];
  isEditMode: boolean = false;
  playlistId: string | null = null;

  constructor(private modalController: ModalController, private musicService: MusicService) {}

  ngOnInit() {
    if (this.playlistId) {
      this.loadPlaylist(this.playlistId); // Carga la playlist existente si se está editando
    }
  }

  loadPlaylist(playlistId: string) {
      this.musicService.getPlaylists(playlistId).subscribe({
        next: (playlists: any[]) => {
          const playlist = playlists.find(p => p.id === playlistId);
          if (playlist) {
            this.playlistName = playlist.name;
            this.selectedSongs = playlist.songs; // Carga las canciones existentes
          }
        },
        error: (error) => {
          console.error('Error al cargar la playlist:', error);
        },
      });
    }

  toggleSongSelection(song: { id: string; name: string }) {
    const index = this.selectedSongs.findIndex((s) => s.id === song.id);
    if (index > -1) {
      this.selectedSongs.splice(index, 1); // Elimina la canción si ya está seleccionada
    } else {
      this.selectedSongs.push(song); // Agrega la canción si no está seleccionada
    }
  }

  async openAddSongModal() {
    const modal = await this.modalController.create({
      component: SearchPage, // Página de búsqueda para seleccionar canciones
      componentProps: {
        isAddingToPlaylist: true, // Propiedad para diferenciar el uso
        isModal: true, // Indica que el componente se está usando como modal
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        // Asegúrate de que las canciones seleccionadas incluyan id y name
        this.selectedSongs.push(...result.data.songs);
      }
    });

    return await modal.present();
  }

  editPlaylist() {
    console.log('Editar playlist');
    // Aquí puedes agregar lógica adicional para editar la playlist
  }

  savePlaylist() {
    if (!this.playlistName.trim()) {
      console.error('El nombre de la playlist no puede estar vacío.');
      return;
    }

    if (this.isEditMode && this.playlistId) {
      // Editar una playlist existente
      this.musicService.updatePlaylist(this.playlistId, this.selectedSongs.map(song => song.id)).subscribe({
        next: (response) => {
          console.log('Playlist actualizada:', response);
          this.modalController.dismiss(response);
        },
        error: (error) => {
          console.error('Error al actualizar la playlist:', error);
        },
      });
    } else {
      // Crear una nueva playlist
      this.musicService.createPlaylist(this.playlistName, this.selectedSongs.map(song => song.id)).subscribe({
        next: (response) => {
          console.log('Playlist creada:', response);
          this.modalController.dismiss(response);
        },
        error: (error) => {
          console.error('Error al crear la playlist:', error);
        },
      });
    }
  }

  closeModal() {
    this.modalController.dismiss();
  }
}
