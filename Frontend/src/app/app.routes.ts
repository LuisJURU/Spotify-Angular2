import { Routes } from '@angular/router';
import { AuthGuard } from './guards/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'home',
    loadComponent: () => import('./home/home.page').then((m) => m.HomePage),
    canActivate: [AuthGuard], // Protege la ruta con el AuthGuard
  },
  {
    path: 'song-detail/:id', // Ruta con parámetro para identificar la canción
    loadComponent: () =>
      import('./song-detail/song-detail.page').then((m) => m.SongDetailPage),
  },
];