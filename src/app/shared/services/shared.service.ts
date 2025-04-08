import { inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { BehaviorSubject, filter } from 'rxjs';
import { HERO_TITLES } from '../utils/models.utils';

@Injectable({
  providedIn: 'root'
})
export class SharedService {

private router = inject(Router);

private _title$ = new BehaviorSubject<string>('Héroes');
public title$ = this._title$.asObservable();

constructor() {
  this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        const url = this.router.url;

        let title = 'Héroes';
        if (url.includes('/edit/')) title = HERO_TITLES['edit'];
        else if (url.includes('/new')) title = HERO_TITLES['new'];
        else if (url.includes('/table-view')) title = HERO_TITLES['table-view'];
        else if (url.includes('/card-view')) title = HERO_TITLES['card-view'];

        this._title$.next(title);
      });
}
}
