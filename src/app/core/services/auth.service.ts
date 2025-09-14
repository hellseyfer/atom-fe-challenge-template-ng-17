import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { API_CONFIG } from '../config/app.config';

interface User {
  id: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

interface AuthResponse {
  status: string;
  data: {
    user: User;
    token: string;
  };
}

interface AuthData {
  user: User;
  token: string;
}

interface UserData {
  email: string;
  userId: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly AUTH_KEY = 'auth_data';
  private readonly API_URL = API_CONFIG.baseUrl;

  constructor(
    private router: Router,
    private http: HttpClient
  ) {}

  login(email: string, password: string): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/login`, { email, password })
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            this.setAuthData(response.data);
          }
        })
      );
  }

  register(userData: { email: string; password: string }): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.API_URL}/auth/register`, userData)
      .pipe(
        tap(response => {
          if (response.status === 'success') {
            this.setAuthData(response.data);
          }
        })
      );
  }

  private setAuthData(authData: AuthData): void {
    localStorage.setItem(this.AUTH_KEY, JSON.stringify({
      user: authData.user,
      token: authData.token
    }));
  }

  private getAuthData(): AuthData | null {
    const data = localStorage.getItem(this.AUTH_KEY);
    return data ? JSON.parse(data) : null;
  }

  logout(): void {
    localStorage.removeItem(this.AUTH_KEY);
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  getToken(): string | null {
    const authData = this.getAuthData();
    return authData?.token || null;
  }

  getCurrentUser(): User | null {
    const authData = this.getAuthData();
    return authData?.user || null;
  }

  getCurrentUserId(): string | null {
    return this.getCurrentUser()?.id || null;
  }

  getCurrentUserEmail(): string | null {
    const user = this.getCurrentUser();
    return user?.email || null;
  }
}
