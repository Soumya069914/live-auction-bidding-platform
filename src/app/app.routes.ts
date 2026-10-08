import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login')
        .then(m => m.Login)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register')
        .then(m => m.Register)
  },

  {
    path: 'forgot-password',
    loadComponent: () =>
      import('./pages/auth/forgot-password/forgot-password')
        .then(m => m.ForgotPassword)
  },

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

  {
    path: '**',
    redirectTo: 'login'
  }
];