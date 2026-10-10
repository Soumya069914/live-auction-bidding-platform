import {
  Component,
  inject,
  OnInit
} from '@angular/core';

import {
  Router,
  RouterLink
} from '@angular/router';

interface ProfileUser {
  id?: number;
  fullName?: string;
  email?: string;
  phone?: string;
  role?: string;
}

@Component({
  selector: 'app-profile',
  imports: [
    RouterLink
  ],
  templateUrl: './profile.html',
  styleUrl: './profile.css'
})
export class Profile implements OnInit {

  private router = inject(Router);

  user = {
    fullName: 'Auction User',
    email: 'user@example.com',
    phone: '',
    role: 'BUYER',
    memberSince: 'October 2026',
    auctionsWon: 0,
    activeBids: 0
  };

  ngOnInit(): void {
    this.loadUser();
  }

  private loadUser(): void {
    const storedUser = localStorage.getItem('auction_user');

    if (!storedUser) {
      return;
    }

    try {
      const parsedUser =
        JSON.parse(storedUser) as ProfileUser;

      this.user = {
        fullName:
          parsedUser.fullName || 'Auction User',

        email:
          parsedUser.email || 'user@example.com',

        phone:
          parsedUser.phone || '',

        role:
          parsedUser.role || 'BUYER',

        memberSince:
          'October 2026',

        auctionsWon:
          0,

        activeBids:
          0
      };

    } catch (error) {

      console.error(
        'Unable to load profile:',
        error
      );

    }
  }

  editProfile(): void {
    this.router.navigate([
      '/edit-profile'
    ]);
  }

  changePassword(): void {
    this.router.navigate([
      '/change-password'
    ]);
  }

  logout(): void {

    localStorage.removeItem(
      'auction_access_token'
    );

    localStorage.removeItem(
      'auction_user'
    );

    this.router.navigate([
      '/login'
    ]);
  }
}