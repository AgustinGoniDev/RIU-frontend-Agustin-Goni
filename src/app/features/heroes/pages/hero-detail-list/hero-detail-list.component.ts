import { Component, OnInit, OnDestroy, signal, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { FormsModule, ReactiveFormsModule, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil, debounceTime, distinctUntilChanged, startWith } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { Hero } from '../../../../core/models/hero.model';
import { HeroesService } from '../../../../core/services/heroes.service';
import { ConfirmDialogComponent } from '../../../../shared/components/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-hero-detail-list',
  imports: [
    CommonModule,
    MatCardModule,
    MatPaginatorModule,
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatDialogModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './hero-detail-list.component.html',
  styleUrl: './hero-detail-list.component.scss'
})
export class HeroDetailListComponent implements OnInit, OnDestroy {
  // INJECTS
  private heroService = inject(HeroesService);
  private dialog = inject(MatDialog);
  private snackBar = inject(MatSnackBar);
  private router = inject(Router);

  searchControl = new FormControl('');
  private destroy$ = new Subject<void>();

  // SIGNALS
  loading = signal(true);
  pageSize = signal(10);
  pageIndex = signal(0);


  private allHeroes = toSignal(this.heroService.getHeroesChanges(), { initialValue: [] });
  totalHeroes = computed(() => this.filteredHeroes().length);

  searchTerm = toSignal(
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ),
    { initialValue: '' }
  );

  filteredHeroes = computed(() => {
    const term = this.searchTerm()?.toLowerCase().trim() || '';
    const heroes = this.allHeroes();

    if (!term) {
      return heroes;
    }

    return heroes.filter(hero =>
      hero.name.toLowerCase().includes(term) ||
      (hero.alterEgo && hero.alterEgo.toLowerCase().includes(term))
    );
  });

  displayedHeroes = computed(() => {
    const start = this.pageIndex() * this.pageSize();
    const end = start + this.pageSize();
    return this.filteredHeroes().slice(start, end);
  });

  // METHODS

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
      next: () => this.loading.set(false),//Aca deberia actualizar la informacion, pero actualmente se maneja con observable desde el servicio.
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

  clearSearch(): void {
    this.searchControl.setValue('');
  }

  handlePageEvent(event: PageEvent): void {
    this.pageSize.set(event.pageSize);
    this.pageIndex.set(event.pageIndex);
  }

  addNewHero(): void {
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