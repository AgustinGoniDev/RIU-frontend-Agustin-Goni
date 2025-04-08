import { Routes } from '@angular/router';
import { HeroListComponent } from './pages/hero-list/hero-list.component';
import { HeroFormComponent } from './pages/hero-form/hero-form.component';
import { HeroDetailListComponent } from './pages/hero-detail-list/hero-detail-list.component';

export const HEROES_ROUTES: Routes = [
  {
    path: '',
    redirectTo: 'table-view',
    pathMatch: 'full'
  },
  {
    path: 'table-view',
    component: HeroListComponent
  },
  {
    path: 'card-view',
    component: HeroDetailListComponent
  },
  {
    path: 'new',
    component: HeroFormComponent
  },
  {
    path: 'edit/:id',
    component: HeroFormComponent
  }
];