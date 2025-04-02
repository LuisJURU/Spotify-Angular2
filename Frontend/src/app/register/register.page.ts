import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonHeader, IonInput, IonItem, IonToolbar, IonTitle, IonContent, IonLabel, IonButton } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormsModule, IonLabel, IonContent, IonTitle, IonToolbar, IonItem, IonInput, IonHeader, CommonModule]
})
export class RegisterPage {
  username = ''; // Nuevo campo
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = ''; // Para mostrar errores en el formulario

  constructor(private authService: AuthService, private router: Router) {}

  register() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage = 'Las contraseñas no coinciden';
      return;
    }

    this.authService.register(this.username, this.email, this.password).subscribe(
      (response) => {
        console.log('Usuario registrado exitosamente:', response);
        this.router.navigate(['/login']); // Redirige al login después del registro
      },
      (error) => {
        console.error('Error al registrar el usuario:', error);
        this.errorMessage = error.error?.error || 'Error al registrar el usuario';
      }
    );
  }
}