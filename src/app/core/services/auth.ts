import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';

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

  register(
    data: RegisterRequest
  ): Observable<void> {

    console.log('Frontend registration:', data);

    return of(void 0).pipe(
      delay(800)
    );
  }

  login(
    data: LoginRequest
  ): Observable<AuthResponse> {

    console.log('Frontend login:', data);

    return throwError(() =>
      new Error('Backend authentication is not connected yet.')
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