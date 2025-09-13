import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../core/services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent {
  email: string = '';
  error: string = '';

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit() {
    if (!this.email) {
      this.error = 'Por favor ingresa tu correo';
      return;
    }

    if (!this.isValidEmail(this.email)) {
      this.error = 'Por favor ingresa un correo válido';
      return;
    }

    this.authService.login(this.email);
    this.router.navigate(['/tasks']);
  }

  private isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }
}
