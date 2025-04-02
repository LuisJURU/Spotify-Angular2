import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router'; // Importa el servicio Router
import { FormsModule } from '@angular/forms';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from '@ionic/angular/standalone';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
  standalone: true, // Indica que este componente es standalone
  imports: [
    FormsModule, // Para usar [(ngModel)]
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
  ],
})
export class LoginPage {
  username = ''; // Cambiado de email a username
  password = '';

  constructor(private authService: AuthService, private router: Router) {} // Inyecta el servicio Router

  login() {
    this.authService.login(this.username, this.password).subscribe(
      (response) => {
        this.authService.saveToken(response.token);
        console.log('Inicio de sesión exitoso, token guardado');
        this.router.navigate(['/home']); // Redirige a la página Home
      },
      (error) => {
        console.error('Error al iniciar sesión:', error);
      }
    );
  }
}