import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { Hero } from '../models/hero.model';
import { HeroesService } from './heroes.service';

describe('HeroesService', () => {
  let service: HeroesService;
  let mockHero: Hero;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesService);

    // Crear un héroe de prueba
    mockHero = {
      id: 'test-id',
      name: 'Test Hero',
      alterEgo: 'Test Alter Ego',
      publisher: 'Test Publisher',
      firstAppearance: 'Test #1',
      abilities: ['Test Ability'],
      imageUrl: 'test-url.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all heroes', (done) => {
    service.getHeroes().subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('should create a hero', (done) => {
    const heroToCreate = {
      name: 'New Hero',
      alterEgo: 'New Alter Ego',
      publisher: 'New Publisher',
      firstAppearance: 'New #1',
      abilities: ['New Ability'],
      imageUrl: 'new-url.jpg'
    };

    service.createHero(heroToCreate).subscribe(hero => {
      expect(hero.id).toBeDefined();
      expect(hero.name).toBe(heroToCreate.name);
      expect(hero.alterEgo).toBe(heroToCreate.alterEgo);

      // Verificar que se haya agregado a la lista
      service.getHeroById(hero.id).subscribe(fetchedHero => {
        expect(fetchedHero).toBeDefined();
        expect(fetchedHero.name).toBe(heroToCreate.name);
        done();
      });
    });
  });

  it('should get a hero by id', (done) => {
    // Primero crear un héroe
    service.createHero({
      name: mockHero.name,
      alterEgo: mockHero.alterEgo,
      publisher: mockHero.publisher,
      firstAppearance: mockHero.firstAppearance,
      abilities: mockHero.abilities,
      imageUrl: mockHero.imageUrl
    }).subscribe(createdHero => {
      // Luego obtenerlo por ID
      service.getHeroById(createdHero.id).subscribe(hero => {
        expect(hero).toBeDefined();
        expect(hero.id).toBe(createdHero.id);
        expect(hero.name).toBe(mockHero.name);
        done();
      });
    });
  });

  it('should update a hero', (done) => {
    // Primero crear un héroe
    service.createHero({
      name: mockHero.name,
      alterEgo: mockHero.alterEgo,
      publisher: mockHero.publisher,
      firstAppearance: mockHero.firstAppearance,
      abilities: mockHero.abilities,
      imageUrl: mockHero.imageUrl
    }).subscribe(createdHero => {
      // Luego actualizarlo
      const updatedName = 'Updated Hero Name';
      service.updateHero(createdHero.id, { name: updatedName }).subscribe(updatedHero => {
        expect(updatedHero.id).toBe(createdHero.id);
        expect(updatedHero.name).toBe(updatedName);

        // Verificar que se haya actualizado en la lista
        service.getHeroById(createdHero.id).subscribe(fetchedHero => {
          expect(fetchedHero.name).toBe(updatedName);
          done();
        });
      });
    });
  });

  it('should delete a hero', (done) => {
    // Primero crear un héroe
    service.createHero({
      name: mockHero.name,
      alterEgo: mockHero.alterEgo,
      publisher: mockHero.publisher,
      firstAppearance: mockHero.firstAppearance,
      abilities: mockHero.abilities,
      imageUrl: mockHero.imageUrl
    }).subscribe(createdHero => {
      // Luego eliminarlo
      service.deleteHero(createdHero.id).subscribe(result => {
        expect(result).toBe(true);

        // Verificar que ya no existe
        service.getHeroById(createdHero.id).subscribe({
          next: () => {
            fail('Hero should not exist');
          },
          error: (error) => {
            expect(error).toBeDefined();
            done();
          }
        });
      });
    });
  });

  it('should filter heroes by name', (done) => {
    // Crear dos héroes con nombres diferentes
    const hero1 = {
      name: 'Superman',
      alterEgo: 'Clark Kent',
      publisher: 'DC'
    };

    const hero2 = {
      name: 'Batman',
      alterEgo: 'Bruce Wayne',
      publisher: 'DC'
    };

    // Crear ambos héroes
    service.createHero(hero1).subscribe(() => {
      service.createHero(hero2).subscribe(() => {
        // Filtrar por 'man'
        service.filterHeroes({ name: 'man' }).subscribe(heroes => {
          expect(heroes.length).toBeGreaterThan(0);
          expect(heroes.every(h => h.name.toLowerCase().includes('man'))).toBe(true);
          done();
        });
      });
    });
  });
});