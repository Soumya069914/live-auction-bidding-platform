import {
  Component,
  inject
} from '@angular/core';

import {
  FormsModule
} from '@angular/forms';

import {
  Router,
  RouterLink
} from '@angular/router';

@Component({
  selector: 'app-change-password',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './change-password.html',
  styleUrl: './change-password.css'
})
export class ChangePassword {

  private router = inject(Router);

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  showCurrentPassword = false;
  showNewPassword = false;
  showConfirmPassword = false;

  isSaving = false;

  successMessage = '';
  errorMessage = '';

  changePassword(): void {

    if (this.isSaving) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    const currentPassword =
      this.currentPassword.trim();

    const newPassword =
      this.newPassword.trim();

    const confirmPassword =
      this.confirmPassword.trim();

    if (!currentPassword) {

      this.errorMessage =
        'Please enter your current password.';

      return;
    }

    if (!newPassword) {

      this.errorMessage =
        'Please enter your new password.';

      return;
    }

    if (newPassword.length < 6) {

      this.errorMessage =
        'New password must contain at least 6 characters.';

      return;
    }

    if (!confirmPassword) {

      this.errorMessage =
        'Please confirm your new password.';

      return;
    }

    if (newPassword !== confirmPassword) {

      this.errorMessage =
        'New password and confirmation password do not match.';

      return;
    }

    if (
      currentPassword === newPassword
    ) {

      this.errorMessage =
        'New password must be different from your current password.';

      return;
    }

    this.isSaving = true;

    /*
     * Temporary frontend implementation.
     *
     * The real password update will later
     * call the backend authentication API.
     */

    try {

      this.isSaving = false;

      this.successMessage =
        'Password changed successfully.';

      this.currentPassword = '';
      this.newPassword = '';
      this.confirmPassword = '';

    } catch (error) {

      console.error(
        'Unable to change password:',
        error
      );

      this.isSaving = false;

      this.errorMessage =
        'Unable to change your password. Please try again.';
    }
  }

  toggleCurrentPassword(): void {

    this.showCurrentPassword =
      !this.showCurrentPassword;
  }

  toggleNewPassword(): void {

    this.showNewPassword =
      !this.showNewPassword;
  }

  toggleConfirmPassword(): void {

    this.showConfirmPassword =
      !this.showConfirmPassword;
  }

  cancel(): void {

    this.router.navigate([
      '/profile'
    ]);
  }

}