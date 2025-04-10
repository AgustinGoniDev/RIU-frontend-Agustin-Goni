import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    loadComponent: () => import('./features/login/login/login.component').then(c => c.LoginComponent),
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    children: [
      {
        path: '',
        redirectTo: 'heroes',
        pathMatch: 'full'
      },
      {
        path: 'heroes',
        loadChildren: () => import('./features/heroes/heroes.routes').then(r => r.HEROES_ROUTES)
      }
    ],
  }
];