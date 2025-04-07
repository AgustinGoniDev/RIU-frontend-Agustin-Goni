import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject, combineLatest, of } from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { HeroesService } from '../../../../core/services/heroes.service';
import { Hero } from '../../../../core/models/hero.model';
// import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-hero-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    FormsModule,
    ReactiveFormsModule,
    AsyncPipe
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent implements OnInit, OnDestroy {
  displayedColumns: string[] = ['id', 'name', 'alterEgo', 'publisher', 'actions'];
  heroes$!: Observable<Hero[]>;
  totalHeroes$!: Observable<number>;

  // Paginación
  pageSize = 5;
  pageIndex = 0;

  // Filtrado
  searchControl = new FormControl('');

  private destroy$ = new Subject<void>();

  constructor(
    private heroService: HeroesService,
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    // this.heroService.getHeroesChanges().subscribe(heroes => {
    //   this.heroes$ = of(heroes);
    // });


    // Combinar filtro de búsqueda y paginación
    const filter$ = this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged(),
      map(search => search || '')
    );

    // Obtener la lista filtrada de héroes
    this.heroes$ = combineLatest([
      filter$,
      this.heroService.getHeroesChanges()
    ]).pipe(
      map(([search, heroes]) => {
        // Filtrar por nombre
        const filteredHeroes = search
          ? heroes.filter(hero =>
              hero.name.toLowerCase().includes(search.toLowerCase())
            )
          : heroes;

        // Calcular el total para la paginación
        this.totalHeroes$ = of(filteredHeroes.length);

        // Aplicar paginación
        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;

        return filteredHeroes.slice(start, end);
      })
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  addHero(): void {
    this.router.navigate(['/heroes/new']);
  }

  editHero(hero: Hero): void {
    this.router.navigate(['/heroes/edit', hero.id]);
  }

  deleteHero(hero: Hero): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar superhéroe',
        message: `¿Estás seguro que deseas eliminar a ${hero.name}?`,
        confirmText: 'Eliminar',
        cancelText: 'Cancelar'
      }
    });

    dialogRef.afterClosed().pipe(
      takeUntil(this.destroy$)
    ).subscribe(result => {
      if (result) {
        this.heroService.deleteHero(hero.id).subscribe({
          next: () => {
            this.snackBar.open(`Superhéroe ${hero.name} eliminado con éxito`, 'Cerrar', {
              duration: 3000
            });
          },
          error: (error) => {
            this.snackBar.open(`Error al eliminar superhéroe: ${error.message}`, 'Cerrar', {
              duration: 3000
            });
          }
        });
      }
    });
  }
}
