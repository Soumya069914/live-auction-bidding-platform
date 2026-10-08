import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login {

  private authService = inject(Auth);

  private router = inject(Router);

  email = '';

  password = '';

  showPassword = false;

  isLoading = signal(false);

  errorMessage = '';

  togglePassword(): void {

    this.showPassword = !this.showPassword;

  }

  onLogin(): void {

    if (this.isLoading()) {
      return;
    }

    this.errorMessage = '';

    const trimmedEmail = this.email.trim();

    const trimmedPassword = this.password.trim();

    if (!trimmedEmail) {

      this.errorMessage =
        'Please enter your email address.';

      return;
    }

    if (!this.isValidEmail(trimmedEmail)) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }

    if (!trimmedPassword) {

      this.errorMessage =
        'Please enter your password.';

      return;
    }

    if (trimmedPassword.length < 6) {

      this.errorMessage =
        'Password must contain at least 6 characters.';

      return;
    }

    this.isLoading.set(true);

    this.authService.login({
      email: trimmedEmail,
      password: trimmedPassword
    }).subscribe({

      next: (response) => {

        console.log(
          'Login successful:',
          response
        );

        this.isLoading.set(false);

        this.router.navigate(['/dashboard']);

      },

      error: (error) => {

        console.error(
          'Login failed:',
          error
        );

        this.errorMessage =
          'Login failed. Please try again.';

        this.isLoading.set(false);

      }

    });

  }

  private isValidEmail(
    email: string
  ): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);

  }

}