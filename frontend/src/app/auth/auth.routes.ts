import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'register',
    loadComponent: () => import('../register/register').then((m) => m.Register),
  },
  {
    path: 'login',
    loadComponent: () => import('../login/login').then((m) => m.Login),
  },
  {
    path: '/',
    redirectTo: '/login',
    pathMatch: 'full',
  },
  {
    path: '**',
    redirectTo: '/login',
  },
];
