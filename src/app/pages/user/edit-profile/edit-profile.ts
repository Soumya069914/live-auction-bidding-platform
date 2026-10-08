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

interface EditableUser {
  id?: number;
  fullName: string;
  email: string;
  phone: string;
  role: string;
}

@Component({
  selector: 'app-edit-profile',
  imports: [
    FormsModule,
    RouterLink
  ],
  templateUrl: './edit-profile.html',
  styleUrl: './edit-profile.css'
})
export class EditProfile {

  private router = inject(Router);

  user: EditableUser = {
    fullName: '',
    email: '',
    phone: '',
    role: 'BUYER'
  };

  successMessage = '';
  errorMessage = '';
  isSaving = false;

  constructor() {
    this.loadUser();
  }

  private loadUser(): void {

    const storedUser =
      localStorage.getItem(
        'auction_user'
      );

    if (!storedUser) {

      this.router.navigate([
        '/profile'
      ]);

      return;
    }

    try {

      const parsedUser =
        JSON.parse(
          storedUser
        ) as Partial<EditableUser>;

      this.user = {
        id: parsedUser.id,

        fullName:
          parsedUser.fullName || '',

        email:
          parsedUser.email || '',

        phone:
          parsedUser.phone || '',

        role:
          parsedUser.role || 'BUYER'
      };

    } catch (error) {

      console.error(
        'Unable to load user profile:',
        error
      );

      this.errorMessage =
        'Unable to load your profile.';
    }
  }

  saveProfile(): void {

    console.log(
      'SAVE PROFILE CLICKED'
    );

    if (this.isSaving) {
      return;
    }

    this.successMessage = '';
    this.errorMessage = '';

    const fullName =
      this.user.fullName.trim();

    const email =
      this.user.email.trim();

    const phone =
      this.user.phone.trim();

    if (!fullName) {

      this.errorMessage =
        'Please enter your full name.';

      return;
    }

    if (fullName.length < 2) {

      this.errorMessage =
        'Full name must contain at least 2 characters.';

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

    if (
      phone &&
      !this.isValidPhone(phone)
    ) {

      this.errorMessage =
        'Please enter a valid phone number.';

      return;
    }

    this.isSaving = true;

    const updatedUser: EditableUser = {
      id: this.user.id,
      fullName,
      email,
      phone,
      role: this.user.role
    };

    try {

      localStorage.setItem(
        'auction_user',
        JSON.stringify(updatedUser)
      );

      this.user = {
        ...updatedUser
      };

      this.isSaving = false;

      this.successMessage =
        'Profile updated successfully.';

      console.log(
        'PROFILE SAVED:',
        updatedUser
      );

    } catch (error) {

      console.error(
        'Unable to save profile:',
        error
      );

      this.isSaving = false;

      this.errorMessage =
        'Unable to save your profile. Please try again.';
    }
  }

  cancel(): void {

    this.router.navigate([
      '/profile'
    ]);
  }

  private isValidEmail(
    email: string
  ): boolean {

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emailPattern.test(
      email
    );
  }

  private isValidPhone(
    phone: string
  ): boolean {

    const phonePattern =
      /^[0-9+\-\s()]{7,15}$/;

    return phonePattern.test(
      phone
    );
  }

}