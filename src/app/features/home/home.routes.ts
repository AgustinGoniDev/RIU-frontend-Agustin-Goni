import { Routes } from '@angular/router';

export const HOME_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'heroes',
    loadChildren: () => import('../heroes/heroes.routes').then(r => r.HEROES_ROUTES)
  }
];