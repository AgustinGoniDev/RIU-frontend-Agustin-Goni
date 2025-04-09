import { TestBed } from '@angular/core/testing';

import { SharedService } from './shared.service';
import { BehaviorSubject } from 'rxjs';
import { NavigationEnd, Router } from '@angular/router';
import { HERO_TITLES } from '../utils/models.utils';

describe('SharedService', () => {
  let service: SharedService;
  let router: jasmine.SpyObj<Router>;
  let eventSubject: BehaviorSubject<any>;

  beforeEach(() => {
    eventSubject = new BehaviorSubject<any>(null);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate'], {
      events: eventSubject.asObservable(),
      url: '/'
    });

    TestBed.configureTestingModule({
      providers: [
        SharedService,
        { provide: Router, useValue: routerSpy }
      ]
    });

    service = TestBed.inject(SharedService);
    router = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('debería crearse', () => {
    expect(service).toBeTruthy();
  });

  it('debería tener título inicial "Héroes"', (done) => {
    service.title$.subscribe(title => {
      expect(title).toBe('Héroes');
      done();
    });
  });

  it('debería actualizar el título a "Editar Héroe" cuando la URL incluye "/edit/"', () => {
    Object.defineProperty(router, 'url', { value: '/heroes/edit/1' });

    eventSubject.next(new NavigationEnd(1, '/heroes/edit/1', '/heroes'));

    service.title$.subscribe(title => {
      expect(title).toBe(HERO_TITLES['edit']);
    });
  });

  it('debería actualizar el título a "Nuevo Héroe" cuando la URL incluye "/new"', () => {
    Object.defineProperty(router, 'url', { value: '/heroes/new' });

    eventSubject.next(new NavigationEnd(1, '/heroes/new', '/heroes'));

    service.title$.subscribe(title => {
      expect(title).toBe(HERO_TITLES['new']);
    });
  });

  it('debería actualizar el título a título de vista de tabla cuando la URL incluye "/table-view"', () => {
    Object.defineProperty(router, 'url', { value: '/heroes/table-view' });

    eventSubject.next(new NavigationEnd(1, '/heroes/table-view', '/heroes'));

    service.title$.subscribe(title => {
      expect(title).toBe(HERO_TITLES['table-view']);
    });
  });

  it('debería actualizar el título a título de vista de tarjetas cuando la URL incluye "/card-view"', () => {
    Object.defineProperty(router, 'url', { value: '/heroes/card-view' });

    eventSubject.next(new NavigationEnd(1, '/heroes/card-view', '/heroes'));

    service.title$.subscribe(title => {
      expect(title).toBe(HERO_TITLES['card-view']);
    });
  });

  it('debería mantener el título como "Héroes" para rutas no específicas', () => {
    Object.defineProperty(router, 'url', { value: '/heroes' });

    eventSubject.next(new NavigationEnd(1, '/heroes', '/'));

    service.title$.subscribe(title => {
      expect(title).toBe('Héroes');
    });
  });
});
