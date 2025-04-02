// filepath: Frontend/src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'https://spotify-angular2-yoli.vercel.app/api/auth'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) {}

  login(username: string, password: string) {
    return this.http.post<{ token: string; user: { username: string } }>(
      `${this.apiUrl}/login`,
      { username, password }
    ).pipe(
      tap((response) => {
        this.saveToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify({ username: response.user.username })); // Guarda el username del usuario
      })
    );
  }
  
  register(username: string, email: string, password: string) {
    return this.http.post<{ token: string; user: { id: string; email: string; username: string } }>(
      `${this.apiUrl}/register`,
      { username, email, password }
    );
  }
  saveToken(token: string) {
    localStorage.setItem('jwtToken', token);
  }

  getToken() {
    return localStorage.getItem('jwtToken');
  }

  logout() {
    localStorage.removeItem('jwtToken');
  }
}