import { Routes } from '@angular/router';
import { HeroListComponent } from './components/hero-list/hero-list.component';
import { HeroFormComponent } from './components/hero-form/hero-form.component';

export const HEROES_ROUTES: Routes = [
  {
    path: '',
    component: HeroListComponent
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