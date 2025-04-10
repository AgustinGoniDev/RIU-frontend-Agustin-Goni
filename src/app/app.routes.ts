import { Routes } from '@angular/router';
import { LoginComponent } from './features/login/login/login.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full'
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'home',
    loadComponent: () => import('./features/home/home.component').then(c => c.HomeComponent),
    loadChildren: () => import('./features/home/home.routes').then(r => r.HOME_ROUTES),
    //canActivate: [authGuard]
  },
];