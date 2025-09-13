import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_token';

  constructor(private router: Router) {}

  login(email: string): void {
    localStorage.setItem(this.AUTH_KEY, email);
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!localStorage.getItem(this.AUTH_KEY);
  }

  getCurrentUser(): string | null {
    return localStorage.getItem(this.AUTH_KEY);
  }
}
