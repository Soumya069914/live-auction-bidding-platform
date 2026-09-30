import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../../core/services/auth';

@Component({
  selector: 'app-register',
  imports: [FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.css'
})
export class Register {

  fullName = '';
  email = '';
  password = '';
  confirmPassword = '';

  acceptedTerms = false;

  showPassword = signal(false);
  showConfirmPassword = signal(false);
  isLoading = signal(false);

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: Auth,
    private router: Router
  ) {}

  togglePassword(): void {
    this.showPassword.update(value => !value);
  }

  toggleConfirmPassword(): void {
    this.showConfirmPassword.update(value => !value);
  }

  onRegister(): void {

    if (this.isLoading()) {
      return;
    }

    this.errorMessage = '';
    this.successMessage = '';

    const name = this.fullName.trim();
    const email = this.email.trim();
    const password = this.password.trim();
    const confirmPassword = this.confirmPassword.trim();

    if (!name) {
      this.errorMessage = 'Please enter your full name.';
      return;
    }

    if (name.length < 3) {
      this.errorMessage =
        'Full name must contain at least 3 characters.';
      return;
    }

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

    if (!password) {
      this.errorMessage =
        'Please create a password.';
      return;
    }

    if (password.length < 6) {
      this.errorMessage =
        'Password must contain at least 6 characters.';
      return;
    }

    if (password !== confirmPassword) {
      this.errorMessage =
        'Passwords do not match.';
      return;
    }

    if (!this.acceptedTerms) {
      this.errorMessage =
        'Please accept the Terms & Conditions.';
      return;
    }

    this.isLoading.set(true);

    this.authService.register({
      fullName: name,
      email,
      password
    }).subscribe({

      next: () => {

        this.isLoading.set(false);

        this.successMessage =
          'Account created successfully. Redirecting to login...';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1200);

      },

      error: (error) => {

        this.isLoading.set(false);

        this.errorMessage =
          error?.error?.message ||
          'Registration failed. Please try again.';

      }

    });
  }

  private isValidEmail(email: string): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(email);
  }

}