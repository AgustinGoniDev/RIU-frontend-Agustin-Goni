import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { Hero } from '../../../../core/models/hero.model';
import { HeroesService } from '../../../../core/services/heroes.service';
import { HeroFormComponent } from './hero-form.component';

describe('HeroFormComponent', () => {
  let component: HeroFormComponent;
  let fixture: ComponentFixture<HeroFormComponent>;

  let heroesServiceMock: jasmine.SpyObj<HeroesService>;
  let routerMock: jasmine.SpyObj<Router>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  const mockHero: Hero = {
    id: '123',
    name: 'Iron Man',
    alterEgo: 'Tony Stark',
    publisher: 'Marvel',
    imageUrl: 'https://some.url/image.jpg',
    abilities: ['Flying', 'Shooting'],
    createdAt: new Date(),
    updatedAt: new Date()
  };

  beforeEach(async () => {
    heroesServiceMock = jasmine.createSpyObj('HeroesService', ['getHeroById']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    const activatedRouteStub = {
      params: of({ id: mockHero.id })
    };

    await TestBed.configureTestingModule({
      imports: [HeroFormComponent],
      providers: [
        { provide: HeroesService, useValue: heroesServiceMock },
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: Router, useValue: routerMock },
        { provide: MatSnackBar, useValue: snackBarMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HeroFormComponent);
    component = fixture.componentInstance;
  });

  it('debería inicializar en modo edición y cargar los datos del héroe', () => {
    heroesServiceMock.getHeroById.and.returnValue(of(mockHero));

    fixture.detectChanges();

    expect(component.isEditMode).toBeTrue();
    expect(component.heroId).toBe(mockHero.id);
    expect(component.heroForm.value.name).toBe(mockHero.name);
    expect(component.heroForm.value.alterEgo).toBe(mockHero.alterEgo);
    expect(component.heroForm.value.publisher).toBe(mockHero.publisher);
    expect(component.abilities).toEqual(mockHero.abilities!);
  });
});
