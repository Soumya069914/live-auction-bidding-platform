
import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  // Authentication
  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login').then(m => m.Login)
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register').then(m => m.Register)
  },
  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },

  // User pages
  {
    path: 'dashboard',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../pages/user/dashboard/dashboard')
        .then(m => m.Dashboard)
  },
  {
    path: 'profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../pages/user/profile/profile')
        .then(m => m.Profile)
  },
  {
    path: 'edit-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/user/edit-profile/edit-profile')
        .then(m => m.EditProfile)
  },
  {
    path: 'change-password',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../pages/user/change-password/change-password')
        .then(m => m.ChangePassword)
  },

  // Create auction
  {
    path: 'auctions/create',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/auction/create-auction/create-auction')
        .then(m => m.CreateAuction)
  },

  // Live bidding — before the generic auction ID route
  {
    path: 'auctions/:id/bid',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../pages/auction/live-bidding/live-bidding')
        .then(m => m.LiveBidding)
  },

  // Auction list
  {
    path: 'auctions',
    canActivate: [authGuard],
    loadComponent: () =>
      import('../pages/auction/auction-list/auction-list')
        .then(m => m.AuctionList)
  },

  // Auction details
  {
    path: 'auctions/:id',
    canActivate: [authGuard],
    loadComponent: () =>
      import('./pages/auction/auction-details/auction-details')
        .then(m => m.AuctionDetails)
  },

  // Unknown routes
  {
    path: '**',
    redirectTo: 'login'
  }
];