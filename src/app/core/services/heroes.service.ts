
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { delay, map, tap } from 'rxjs/operators';
import { Hero, HeroFilter } from '../models/hero.model';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root'
})
export class HeroesService {
  private readonly NETWORK_DELAY = 500;

  private heroes: Hero[] = [
    {
      id: '1',
      name: 'Superman',
      alterEgo: 'Clark Kent',
      publisher: 'DC Comics',
      firstAppearance: 'Action Comics #1',
      abilities: ['Super strength', 'Flight', 'X-ray vision'],
      imageUrl: 'assets/heroes/superman.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '2',
      name: 'Spiderman',
      alterEgo: 'Peter Parker',
      publisher: 'Marvel Comics',
      firstAppearance: 'Amazing Fantasy #15',
      abilities: ['Wall-crawling', 'Web-shooting', 'Spider sense'],
      imageUrl: 'assets/heroes/spiderman.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '3',
      name: 'Wonder Woman',
      alterEgo: 'Diana Prince',
      publisher: 'DC Comics',
      firstAppearance: 'All Star Comics #8',
      abilities: ['Super strength', 'Flight', 'Combat expertise'],
      imageUrl: 'assets/heroes/wonderwoman.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '4',
      name: 'Batman',
      alterEgo: 'Bruce Wayne',
      publisher: 'DC Comics',
      firstAppearance: 'Detective Comics #27',
      abilities: ['Intelligence', 'Combat expertise', 'Gadgets'],
      imageUrl: 'assets/heroes/batman.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      id: '5',
      name: 'Iron Man',
      alterEgo: 'Tony Stark',
      publisher: 'Marvel Comics',
      firstAppearance: 'Tales of Suspense #39',
      abilities: ['Power armor', 'Genius intellect', 'Wealth'],
      imageUrl: 'assets/heroes/ironman.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  private heroesSubject = new BehaviorSubject<Hero[]>(this.heroes);

  constructor() {}


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


  filterHeroes(filter: HeroFilter): Observable<Hero[]> {
    return of([...this.heroes]).pipe(
      map(heroes => {
        let filteredHeroes = heroes;


        if (filter.name) {
          filteredHeroes = filteredHeroes.filter(hero =>
            hero.name.toLowerCase().includes(filter.name!.toLowerCase())
          );
        }


        if (filter.page !== undefined && filter.limit !== undefined) {
          const startIndex = filter.page * filter.limit;
          filteredHeroes = filteredHeroes.slice(startIndex, startIndex + filter.limit);
        }

        return filteredHeroes;
      }),
      delay(this.NETWORK_DELAY)
    );
  }


  createHero(hero: Omit<Hero, 'id' | 'createdAt' | 'updatedAt'>): Observable<Hero> {
    const newHero: Hero = {
      ...hero,
      id: uuidv4(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.heroes = [...this.heroes, newHero];
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

    this.heroesSubject.next(this.heroes);

    return of(true).pipe(
      delay(this.NETWORK_DELAY)
    );
  }


  getHeroesChanges(): Observable<Hero[]> {
    return this.heroesSubject.asObservable();
  }
}