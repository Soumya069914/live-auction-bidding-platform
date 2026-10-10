import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.css'
})
export class ForgotPassword {

  email = '';

  isLoading = signal(false);

  errorMessage = '';

  successMessage = '';

  onSubmit(): void {

    if (this.isLoading()) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const email = this.email.trim();

    if (!email) {

      this.errorMessage =
        'Please enter your email address.';

      return;
    }

    if (!this.isValidEmail(email)) {

      this.errorMessage =
        'Please enter a valid email address.';

      return;
    }

    this.isLoading.set(true);

    console.log(
      'Password reset requested for:',
      email
    );

    setTimeout(() => {

      this.isLoading.set(false);

      this.successMessage =
        'If an account exists with this email, a password reset link will be sent shortly.';

    }, 1200);
  }

  private isValidEmail(email: string): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }

}