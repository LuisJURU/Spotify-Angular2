// filepath: Frontend/src/app/services/auth.service.ts
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private apiUrl = 'http://localhost:5000/api/auth'; // Cambia esto según tu configuración

  constructor(private http: HttpClient) {}

  login(email: string, password: string) {
    return this.http.post<{ token: string; user: { email: string } }>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap((response: { token: string; user: { email: any; }; }) => {
        this.saveToken(response.token);
        localStorage.setItem('currentUser', JSON.stringify({ email: response.user.email })); // Guarda el email del usuario
      })
    );
  }
  
  register(email: string, password: string) {
    return this.http.post<{ token: string; user: { id: string; email: string } }>(
      `${this.apiUrl}/register`,
      { email, password }
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