import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroListComponent } from './hero-list.component';
import { Router } from '@angular/router';

import { HeroesService } from '../../../../core/services/heroes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

import { of } from 'rxjs';
import { Hero } from '../../../../core/models/hero.model';
import { TesterComponent } from '../../../../shared/utils/testing/tester/tester.component';

describe('HeroListComponent', () => {
  let component: HeroListComponent;
  let fixture: ComponentFixture<HeroListComponent>;

  const mockHeroes: Hero[] = [
    {
      id: '1',
      name: 'Superman',
      alterEgo: 'Clark Kent',
      publisher: 'DC',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      id: '2',
      name: 'Spider-Man',
      alterEgo: 'Peter Parker',
      publisher: 'Marvel',
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  ];

  const heroesServiceSpy = jasmine.createSpyObj('HeroesService', [
    'getHeroes',
    'getHeroesChanges',
    'deleteHero',
  ]);

  const routerMock = {
    navigate: jasmine.createSpy('navigate')
  };

  const dialogRefMock = {
    afterClosed: () => of(true)
  };

  const matDialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
  matDialogSpy.open.and.returnValue(dialogRefMock);

  const snackBarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);

  beforeEach(async () => {
    heroesServiceSpy.getHeroes.and.returnValue(of(mockHeroes));
    heroesServiceSpy.getHeroesChanges.and.returnValue(of(mockHeroes));
    heroesServiceSpy.deleteHero.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [HeroListComponent, TesterComponent],
      providers: [
        { provide: Router, useValue: routerMock },
        { provide: HeroesService, useValue: heroesServiceSpy },
        { provide: MatDialog, useValue: matDialogSpy },
        { provide: MatSnackBar, useValue: snackBarSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crear el componente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar héroes paginados', () => {
    const paginated = component.paginatedHeroes();
    expect(paginated.length).toBeGreaterThan(0);
    expect(paginated[0].name).toContain('Superman');
  });

  it('debería navegar a crear héroe', () => {
    component.addHero();
    expect(routerMock.navigate).toHaveBeenCalledWith(['home/heroes/new']);
  });
});
