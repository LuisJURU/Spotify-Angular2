import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Toast } from '@awesome-cordova-plugins/toast/ngx'; // Importa el servicio Toast
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
  standalone: true,
  imports: [
    FormsModule,
    IonContent,
    IonItem,
    IonLabel,
    IonInput,
  ],
  providers: [Toast], // Agrega el servicio Toast aquí
})
export class LoginPage {
  username = '';
  password = '';
  isSubmitting = false; // Para evitar múltiples envíos

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: Toast // Inyecta el servicio Toast
  ) {}

  async login() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // Validar campos vacíos
    if (!this.username.trim() || !this.password.trim()) {
      this.showNativeToast('❌ Todos los campos son obligatorios.', 'danger');
      this.isSubmitting = false;
      return;
    }

    try {
      this.authService.login(this.username, this.password).subscribe(
        async (response) => {
          this.authService.saveToken(response.token);
          console.log('Inicio de sesión exitoso, token guardado');
          this.showNativeToast('Inicio de sesión exitoso', 'success');
          this.router.navigate(['/home']);
        },
        async (error) => {
          console.error('Error al iniciar sesión:', error);
          this.showNativeToast('Error al iniciar sesión: Verifica tus credenciales', 'danger');
        }
      );
    } catch (error) {
      console.error('Error inesperado:', error);
      this.showNativeToast('Error inesperado. Inténtalo de nuevo.', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  showNativeToast(message: string, color: string) {
    const emoji = color === 'success' ? '✅' : color === 'danger' ? '❌' : '⚠️';
    const fullMessage = `${emoji} ${message}`;

    this.toast.show(fullMessage, '3000', 'center').subscribe(
      () => console.log('Toast displayed'),
      (error) => console.error('Error mostrando el toast:', error)
    );
  }

  navigateToRegister() {
    this.router.navigate(['/register']);
  }
}