import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonModule } from '@angular/common';
import { IonInput, IonItem, IonContent, IonLabel } from "@ionic/angular/standalone";
import { FormsModule } from '@angular/forms';
import { Toast } from '@awesome-cordova-plugins/toast/ngx'; // Importa el servicio Toast

@Component({
  selector: 'app-register',
  templateUrl: './register.page.html',
  styleUrls: ['./register.page.scss'],
  standalone: true,
  imports: [FormsModule, IonLabel, IonContent, IonItem, IonInput, CommonModule],
  providers: [Toast] // Agrega el servicio Toast aquí
})
export class RegisterPage {
  username = ''; // Nuevo campo
  email = '';
  password = '';
  confirmPassword = '';
  errorMessage = ''; // Para mostrar errores en el formulario
  isSubmitting = false; // Para evitar múltiples envíos

  constructor(
    private authService: AuthService,
    private router: Router,
    private toast: Toast // Inyecta el servicio Toast
  ) {}

  async register() {
    if (this.isSubmitting) {
      return;
    }

    this.isSubmitting = true;

    // Validar email
    if (!this.validateEmail(this.email)) {
      this.showNativeToast('Email inválido. Por favor, verifica tu correo.', 'danger');
      this.isSubmitting = false;
      return;
    }

    // Validar contraseña
    if (this.password.length < 8) {
      this.showNativeToast('La contraseña debe tener al menos 8 caracteres.', 'danger');
      this.isSubmitting = false;
      return;
    }

    // Validar coincidencia de contraseñas
    if (this.password !== this.confirmPassword) {
      this.showNativeToast('Las contraseñas no coinciden.', 'danger');
      this.isSubmitting = false;
      return;
    }

    try {
      // Intentar registrar al usuario
      const response = await this.authService.register(this.username, this.email, this.password).toPromise();
      console.log('Usuario registrado exitosamente:', response);
      this.showNativeToast('Registro exitoso. Por favor, inicia sesión.', 'success');
      this.router.navigate(['/login']); // Redirige al login después del registro
    } catch (error) {
      console.error('Error al registrar el usuario:', error);
      this.showNativeToast('Error al registrar el usuario. Inténtalo de nuevo.', 'danger');
    } finally {
      this.isSubmitting = false;
    }
  }

  validateEmail(email: string): boolean {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  showNativeToast(message: string, color: string) {
    const emoji = color === 'success' ? '✅' : color === 'danger' ? '❌' : '⚠️';
    const fullMessage = `${emoji} ${message}`;

    this.toast.show(fullMessage, '3000', 'center').subscribe(
      () => console.log('Toast displayed'),
      (error) => console.error('Error mostrando el toast:', error)
    );
  }

  navigateToLogin() {
    this.router.navigate(['/login']);
  }
}