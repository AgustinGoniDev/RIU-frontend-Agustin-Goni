import { Component, OnInit, OnDestroy, signal, inject, computed } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { HeroesService } from '../../../../core/services/heroes.service';
import { Hero } from '../../../../core/models/hero.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DetailDialogComponent } from '../../../../shared/components/detail-dialog/detail-dialog.component';

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
    ReactiveFormsModule
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent implements OnInit, OnDestroy {

  //INJECTS
  private heroService = inject(HeroesService)
  private router = inject(Router);
  private dialog: MatDialog = inject(MatDialog);
  private snackBar: MatSnackBar = inject(MatSnackBar);


  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  private heroes = toSignal(this.heroService.getHeroesChanges(), { initialValue: [] });

  private searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  filteredHeroes = computed(() => {
    const search = this.searchTerm()!.toLowerCase();
    const heroesList = this.heroes();

    return search
      ? heroesList.filter(hero => hero.name.toLowerCase().includes(search))
      : heroesList;
  });

  paginatedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredHeroes().slice(start, end);
  });

  totalHeroes = computed(() => this.filteredHeroes().length);

  displayedColumns: string[] = ['id', 'name', 'alterEgo', 'publisher', 'actions'];
  pageSize = signal(5);
  pageIndex = signal(0);


  ngOnInit(): void { }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
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

  viewHero(hero: Hero): void {
    const dialogRef = this.dialog.open(DetailDialogComponent, {
      width: '350px',
      data: hero
    });
  }
}
