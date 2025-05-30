import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MusicService } from '../services/music.service';
import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import ColorThief from 'color-thief-browser';
import { Location } from '@angular/common'; // Importa el servicio Location

@Component({
  selector: 'app-song-detail',
  templateUrl: './song-detail.page.html',
  styleUrls: ['./song-detail.page.scss'],
  standalone: true,
  imports: [
    IonicModule, // Incluye todos los componentes de Ionic
    CommonModule,
    FormsModule,
  ],
})
export class SongDetailPage implements OnInit {
  song: any; // Detalles de la canción
  artistNames: string = ''; // Nombres de los artistas como cadena
  backgroundColor: string = 'black'; // Color de fondo por defecto

  @ViewChild('albumImage', { static: false }) albumImage!: ElementRef; // Referencia a la imagen del álbum
  @ViewChild('audioPlayer', { static: false }) audioPlayer!: ElementRef;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private musicService: MusicService,
    private location: Location // Inyecta el servicio Location
  ) {}

  ngOnInit() {
    const songId = this.route.snapshot.paramMap.get('id'); // Obtén el ID de la canción
    if (songId) {
      this.loadSongDetail(songId);
    } else {
      console.error('Song ID is null');
    }
  }

  loadSongDetail(songId: string) {
    this.musicService.getSongById(songId).subscribe({
      next: (response) => {
        this.song = response;

        // Verifica si 'artists' es un arreglo de cadenas
        if (this.song.artists && Array.isArray(this.song.artists)) {
          this.artistNames = this.song.artists.join(', '); // Une los nombres de los artistas
        } else {
          this.artistNames = 'Artista desconocido';
        }
      },
      error: (error) => {
        console.error('Error al cargar los detalles de la canción:', error);
      },
    });
  }

  openAddToPlaylistPage() {
    this.router.navigate(['/add-playlist'], {
      queryParams: { selectedSong: JSON.stringify(this.song) },
    });
  }

  onImageLoad() {
    if (this.albumImage && this.albumImage.nativeElement) {
      const img = this.albumImage.nativeElement as HTMLImageElement;

      const colorThief = new ColorThief();
      const dominantColor = colorThief.getColor(img); // Obtén el color predominante
      this.backgroundColor = `rgb(${dominantColor[0]}, ${dominantColor[1]}, ${dominantColor[2]})`;
    } else {
      console.error('La referencia a la imagen no está disponible.');
    }
  }

  formatDuration(durationMs: number): string {
    const minutes = Math.floor(durationMs / 60000);
    const seconds = Math.floor((durationMs % 60000) / 1000);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }

  playPreview() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.play();
  }

  pausePreview() {
    const audio: HTMLAudioElement = this.audioPlayer.nativeElement;
    audio.pause();
  }

  goBack() {
    this.location.back(); // Navega hacia la ventana anterior
  }
}
