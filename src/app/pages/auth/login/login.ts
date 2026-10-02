import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

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

    console.log('Login clicked');

    console.log(
      'Email:',
      trimmedEmail
    );

    console.log(
      'Password:',
      trimmedPassword
    );

    setTimeout(() => {

      console.log(
        'Login test completed'
      );

      this.isLoading.set(false);

    }, 1500);
  }

  private isValidEmail(
    email: string
  ): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }

}