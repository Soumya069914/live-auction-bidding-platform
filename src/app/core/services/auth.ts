import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface RegisterRequest {
  fullName: string;
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  user?: {
    id?: number;
    fullName?: string;
    email?: string;
    role?: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class Auth {

  private readonly apiUrl =
    'http://localhost:8080/api/auth';

  constructor(
    private http: HttpClient
  ) {}

  register(
    data: RegisterRequest
  ): Observable<void> {

    return this.http.post<void>(
      `${this.apiUrl}/register`,
      data
    );
  }

  login(
    data: LoginRequest
  ): Observable<AuthResponse> {

    return this.http.post<AuthResponse>(
      `${this.apiUrl}/login`,
      data
    );
  }

  logout(): void {

    localStorage.removeItem(
      'auction_access_token'
    );

    localStorage.removeItem(
      'auction_user'
    );
  }

  getToken(): string | null {

    return localStorage.getItem(
      'auction_access_token'
    );
  }

  isLoggedIn(): boolean {

    return !!this.getToken();
  }

}