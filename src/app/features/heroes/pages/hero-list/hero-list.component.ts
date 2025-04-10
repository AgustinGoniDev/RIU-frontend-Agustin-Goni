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
import { Subject} from 'rxjs';
import { debounceTime, distinctUntilChanged, map, startWith, takeUntil } from 'rxjs/operators';
import { HeroesService } from '../../../../core/services/heroes.service';
import { Hero } from '../../../../core/models/hero.model';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';
import { toSignal } from '@angular/core/rxjs-interop';
import { DetailDialogComponent } from '../../components/detail-dialog/detail-dialog.component';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

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
    MatProgressSpinnerModule
  ],
  templateUrl: './hero-list.component.html',
  styleUrl: './hero-list.component.scss'
})
export class HeroListComponent implements OnInit, OnDestroy {

  //INJECTS
  private heroService = inject(HeroesService)
  private router = inject(Router);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);


  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();
  displayedColumns: string[] = ['id', 'name', 'alterEgo', 'publisher', 'actions'];

  //SIGNALS
  loading = signal(true);
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

  pageSize = signal(5);
  pageIndex = signal(0);


  ngOnInit(): void {
    this.loadHeroes();
  }


  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadHeroes(): void {
    this.loading.set(true);
    this.heroService.getHeroes().pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => this.loading.set(false),
      error: (error) => {
        this.loading.set(false);
        this.snackBar.open('Error al cargar los superhéroes', 'Cerrar', {
          duration: 5000,
          panelClass: 'error-snackbar'
        });
        console.error('Error loading heroes:', error);
      }
    });
  }

  onPageChange(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  addHero(): void {
    this.router.navigate(['home/heroes/new']);
  }

  editHero(hero: Hero): void {
    this.router.navigate(['home/heroes/edit', hero.id]);
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
