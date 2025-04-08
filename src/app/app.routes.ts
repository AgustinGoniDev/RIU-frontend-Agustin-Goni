import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'heroes/table-view',
    pathMatch: 'full'
  },
  {
    path: 'heroes',
    loadChildren: () => import('./features/heroes/heroes.routes')
      .then(m => m.HEROES_ROUTES)
  },
];