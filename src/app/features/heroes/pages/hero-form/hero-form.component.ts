import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatChipInputEvent, MatChipsModule } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HeroesService } from '../../../../core/services/heroes.service';
import { Hero } from '../../../../core/models/hero.model';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatIcon } from '@angular/material/icon';
import { NgFor } from '@angular/common';
import { ENTER, COMMA } from '@angular/cdk/keycodes';
import { UpperCaseDirective } from '../../directives/upper-case.directive';

@Component({
  selector: 'app-hero-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatChipsModule,
    FormsModule,
    MatIcon,
    NgFor,
    UpperCaseDirective
  ],
  templateUrl: './hero-form.component.html',
  styleUrl: './hero-form.component.scss'
})
export class HeroFormComponent implements OnInit, OnDestroy {
  heroForm!: FormGroup;
  isEditMode = false;
  heroId = '';
  abilities: string[] = [];
  readonly separatorKeysCodes = [ENTER, COMMA] as const;


  private destroy$ = new Subject<void>();

  //INJECTS
  private fb = inject(FormBuilder);
  private heroService = inject(HeroesService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private snackBar = inject(MatSnackBar);

  constructor() {}

  ngOnInit(): void {
    this.initForm();

    // Verificar si estamos en modo edición
    this.route.params.pipe(
      takeUntil(this.destroy$)
    ).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.heroId = params['id'];
        this.loadHero(this.heroId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private initForm(): void {
    this.heroForm =
    this.fb.group({
      name: ['', [Validators.required]],
      alterEgo: [''],
      publisher: [''],
      imageUrl: [''],
      abilities: [[]]
    });
  }

  private loadHero(id: string): void {
    this.heroService.getHeroById(id).pipe(
      takeUntil(this.destroy$)
    ).subscribe({
      next: (hero) => {
        this.heroForm.patchValue({
          name: hero.name,
          alterEgo: hero.alterEgo,
          publisher: hero.publisher,
          imageUrl: hero.imageUrl
        });

        this.abilities = hero.abilities || [];
      },
      error: (error) => {
        this.snackBar.open(`Error al cargar superhéroe: ${error.message}`, 'Cerrar', {
          duration: 3000
        });
        this.router.navigate(['/heroes']);
      }
    });
  }

  addAbility(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.abilities.push(value);
      this.heroForm.get('abilities')?.setValue(this.abilities);
    }

    event.chipInput!.clear();
  }

  removeAbility(ability: string): void {
    const index = this.abilities.indexOf(ability);

    if (index >= 0) {
      this.abilities.splice(index, 1);
      this.heroForm.get('abilities')?.setValue(this.abilities);
    }
  }

  onSubmit(): void {
    if (this.heroForm.invalid) {
      return;
    }

    const formValue = this.heroForm.value;
    const heroData: Partial<Hero> = {
      name: formValue.name,
      alterEgo: formValue.alterEgo,
      publisher: formValue.publisher,
      imageUrl: formValue.imageUrl,
      abilities: this.abilities
    };

    if (this.isEditMode) {
      this.heroService.updateHero(this.heroId, heroData).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (hero) => {
          this.snackBar.open(`Superhéroe ${hero.name} actualizado con éxito`, 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/heroes']);
        },
        error: (error) => {
          this.snackBar.open(`Error al actualizar superhéroe: ${error.message}`, 'Cerrar', {
            duration: 3000
          });
        }
      });
    } else {
      this.heroService.createHero(heroData as Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>).pipe(
        takeUntil(this.destroy$)
      ).subscribe({
        next: (hero) => {
          this.snackBar.open(`Superhéroe ${hero.name} creado con éxito`, 'Cerrar', {
            duration: 3000
          });
          this.router.navigate(['/heroes']);
        },
        error: (error) => {
          this.snackBar.open(`Error al crear superhéroe: ${error.message}`, 'Cerrar', {
            duration: 3000
          });
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/heroes']);
  }
}
