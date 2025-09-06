import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./welcome/welcome'),
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.routes').then((m) => m.routes),
  },
  {
    path: 'products',
    loadComponent: () => import('./products/products').then((m) => m.default),
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];
