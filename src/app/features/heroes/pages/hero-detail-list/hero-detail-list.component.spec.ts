import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroDetailListComponent } from './hero-detail-list.component';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { HeroesService } from '../../../../core/services/heroes.service';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Hero } from '../../../../core/models/hero.model';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

describe('HeroDetailListComponent', () => {
  let component: HeroDetailListComponent;
  let fixture: ComponentFixture<HeroDetailListComponent>;
  let heroServiceMock: jasmine.SpyObj<HeroesService>;
  let dialogMock: jasmine.SpyObj<MatDialog>;
  let snackBarMock: jasmine.SpyObj<MatSnackBar>;

  const mockHeroes: Hero[] = [
    { id: '1', name: 'Batman', alterEgo: 'Bruce Wayne', abilities: [], imageUrl: '', publisher: '' },
    { id: '2', name: 'Superman', alterEgo: 'Clark Kent', abilities: [], imageUrl: '', publisher: '' },
  ];

  beforeEach(async () => {
    heroServiceMock = jasmine.createSpyObj('HeroesService', ['getHeroes', 'getHeroesChanges', 'deleteHero']);
    dialogMock = jasmine.createSpyObj('MatDialog', ['open']);
    snackBarMock = jasmine.createSpyObj('MatSnackBar', ['open']);

    heroServiceMock.getHeroes.and.returnValue(of(mockHeroes));
    heroServiceMock.getHeroesChanges.and.returnValue(of(mockHeroes));

    await TestBed.configureTestingModule({
      imports: [HeroDetailListComponent],
      providers: [
        { provide: HeroesService, useValue: heroServiceMock },
        { provide: MatDialog, useValue: dialogMock },
        { provide: MatSnackBar, useValue: snackBarMock },
        provideRouter([]),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(HeroDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });


  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los héroes correctamente', () => {
    expect(component.loading()).toBeFalse();
    expect(component.totalHeroes()).toBe(2);
    expect(component.displayedHeroes().length).toBe(2);
  });

  it('debería filtrar héroes por nombre', async () => {
    heroServiceMock.getHeroesChanges.and.returnValue(of(mockHeroes));
    fixture = TestBed.createComponent(HeroDetailListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.searchControl.setValue('batman');
    await fixture.whenStable();
    fixture.detectChanges();
    const filtered = component.filteredHeroes();

    expect(filtered.length).toBe(1);
    expect(filtered[0].name).toBe('Batman');
  });

  it('debería manejar el cambio de página', () => {
    component.handlePageEvent({ pageIndex: 1, pageSize: 1, length: 2 });
    expect(component.pageIndex()).toBe(1);
    expect(component.pageSize()).toBe(1);
  });

  // it('debería eliminar un héroe tras confirmación', () => {
  //   dialogMock.open.and.returnValue({
  //     afterClosed: () => of(true)
  //   } as any);

  //   component.deleteHero(mockHeroes[0]);

  //   expect(dialogMock.open).toHaveBeenCalled();
  //   expect(heroServiceMock.deleteHero).toHaveBeenCalledWith('1');
  //   expect(snackBarMock.open).toHaveBeenCalledWith(jasmine.stringContaining('eliminado'), 'Cerrar', jasmine.anything());
  // });

  // it('no debería eliminar si se cancela el diálogo', () => {
  //   const hero: Hero = { id: '1', name: 'Batman', alterEgo: 'Bruce Wayne' };

  //   // Mock que retorna `false` al cerrar diálogo (cancelado)
  //   dialogMock.open.and.returnValue({
  //     afterClosed: () => of(false),
  //   } as any);

  //   fixture = TestBed.createComponent(HeroDetailListComponent);
  //   const component = fixture.componentInstance;
  //   fixture.detectChanges();

  //   component.deleteHero(hero);

  //   expect(heroServiceMock.deleteHero).not.toHaveBeenCalled();
  // });

  it('debería mostrar error si falla al cargar los héroes', () => {
    heroServiceMock.getHeroes.and.returnValue(throwError(() => new Error('Fallo de red')));

    component.loadHeroes();
    fixture.detectChanges();
    expect(component.loading()).toBeFalse();
  });
});
