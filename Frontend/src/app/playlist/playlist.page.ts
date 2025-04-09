import { Component, OnInit } from '@angular/core';
import { IonicModule, ModalController } from '@ionic/angular';
import { MusicService } from '../services/music.service';
import { SearchPage } from '../search/search.page';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { i } from '@angular/core/weak_ref.d-Bp6cSy-X';
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
    private modalController: ModalController,
    private musicService: MusicService,
    private router: Router
  ) {}

  ngOnInit() {
    if (this.playlistId) {
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
        this.playlistName = playlist.name;
        this.selectedSongs = playlist.songs;
      },
      error: (error) => {
        console.error('Error al cargar la playlist:', error);
      },
    });
  }

  async openAddSongModal() {
    const modal = await this.modalController.create({
      component: SearchPage,
      componentProps: {
        isAddingToPlaylist: true,
      },
    });

    modal.onDidDismiss().then((result) => {
      if (result.data) {
        const newSongs = result.data.songs.filter(
          (newSong: { id: string }) => !this.selectedSongs.some((song) => song.id === newSong.id)
        );
        this.selectedSongs.push(...newSongs);
      }
    });

    return await modal.present();
  }

  savePlaylist() {
    if (!this.playlistName.trim()) {
      console.error('El nombre de la playlist no puede estar vacío.');
      return;
    }

    if (this.isEditMode && this.playlistId) {
      this.musicService.updatePlaylist(this.playlistId, this.selectedSongs).subscribe({
        next: (response) => {
          console.log('Playlist actualizada:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al actualizar la playlist:', error);
        },
      });
    } else {
      this.musicService.createPlaylist(this.playlistName, this.selectedSongs).subscribe({
        next: (response) => {
          console.log('Playlist creada:', response);
          this.router.navigate(['/home']);
        },
        error: (error) => {
          console.error('Error al crear la playlist:', error);
        },
      });
    }
  }
}