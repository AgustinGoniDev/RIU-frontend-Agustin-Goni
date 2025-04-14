
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { LocalStorageService } from '../../shared/services/local-storage.service';
import { Hero } from '../models/hero.model';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly NETWORK_DELAY = 500;
  private readonly STORAGE_KEY = 'heroesData';

  private storage = inject(LocalStorageService);

  private heroes: Hero[] = [
    {
      id: uuidv4().split('-')[0],
      name: 'Superman',
      alterEgo: 'Clark Kent',
      publisher: 'DC Comics',
      abilities: ['Super strength', 'Flight', 'X-ray vision'],
      imageUrl: '../../../../../assets/superman.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4().split('-')[0],
      name: 'Spiderman',
      alterEgo: 'Peter Parker',
      publisher: 'Marvel Comics',
      abilities: ['Wall-crawling', 'Web-shooting', 'Spider sense'],
      imageUrl: '../../../../../assets/spiderman.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4().split('-')[0],
      name: 'Wonder Woman',
      alterEgo: 'Diana Prince',
      publisher: 'DC Comics',
      abilities: ['Super strength', 'Flight', 'Combat expertise'],
      imageUrl: '../../../../../assets/wonderwoman.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4().split('-')[0],
      name: 'Batman',
      alterEgo: 'Bruce Wayne',
      publisher: 'DC Comics',
      abilities: ['Intelligence', 'Combat expertise', 'Gadgets'],
      imageUrl: '../../../../../assets/batman.png',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: uuidv4().split('-')[0],
      name: 'Iron Man',
      alterEgo: 'Tony Stark',
      publisher: 'Marvel Comics',
      abilities: ['Power armor', 'Genius intellect', 'Wealth'],
      imageUrl: '../../../../../assets/ironman.png',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private heroesSubject = new BehaviorSubject<Hero[]>(this.heroes);

  constructor() {
    const storedHeroes = this.storage.getItem<Hero[]>(this.STORAGE_KEY);
    if (storedHeroes) {
      this.heroes = storedHeroes;
    } else {
      this.heroes = this.getDefaultHeroes();
      this.updateStorage();
    }

    this.heroesSubject.next(this.heroes);
  }

  private updateStorage(): void {
    this.storage.setItem(this.STORAGE_KEY, this.heroes);
  }

  getDefaultHeroes(): Hero[] {
    return this.heroes;
  }


  getHeroes(): Observable<Hero[]> {
    return of([...this.heroes]).pipe(
      delay(this.NETWORK_DELAY)
    );
  }


  getHeroById(id: string): Observable<Hero> {
    const hero = this.heroes.find(h => h.id === id);

    if (!hero) {
      return throwError(() => new Error(`Hero with id ${id} not found`));
    }

    return of({...hero}).pipe(
      delay(this.NETWORK_DELAY)
    );
  }


  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): Observable<Hero> {
    const newHero: Hero = {
      ...hero,
      id: uuidv4().split('-')[0],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.heroes = [...this.heroes, newHero];
    this.updateStorage();
    this.heroesSubject.next(this.heroes);
    return of(newHero).pipe(
      delay(this.NETWORK_DELAY)
    );
  }


  updateHero(id: string, heroData: Partial<Hero>): Observable<Hero> {
    const index = this.heroes.findIndex(h => h.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Hero with id ${id} not found`));
    }

    const updatedHero: Hero = {
      ...this.heroes[index],
      ...heroData,
      updatedAt: new Date()
    };

    this.heroes = [
      ...this.heroes.slice(0, index),
      updatedHero,
      ...this.heroes.slice(index + 1)
    ];

    this.updateStorage();
    this.heroesSubject.next(this.heroes);

    return of(updatedHero).pipe(
      delay(this.NETWORK_DELAY)
    );
  }


  deleteHero(id: string): Observable<boolean> {
    const index = this.heroes.findIndex(h => h.id === id);

    if (index === -1) {
      return throwError(() => new Error(`Hero with id ${id} not found`));
    }

    this.heroes = [
      ...this.heroes.slice(0, index),
      ...this.heroes.slice(index + 1)
    ];

    this.updateStorage();
    this.heroesSubject.next(this.heroes);

    return of(true).pipe(
      delay(this.NETWORK_DELAY)
    );
  }


  getHeroesChanges(): Observable<Hero[]> {
    return this.heroesSubject.asObservable();
  }
}