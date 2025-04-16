import { TestBed } from '@angular/core/testing';
import { Hero } from '../models/hero.model';
import { HeroesService } from './heroes.service';

describe('HeroesService', () => {
  let service: HeroesService;
  let mockHero: Hero;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HeroesService);
    mockHero = {
      id: 'test-id',
      name: 'Test Hero',
      alterEgo: 'Test Alter Ego',
      publisher: 'Test Publisher',
      abilities: ['Test Ability'],
      imageUrl: 'test-url.jpg',
      createdAt: new Date(),
      updatedAt: new Date()
    };
  });

  it('Deberia ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debería obtener todos los héroes', (done) => {
    service.getHeroes().subscribe(heroes => {
      expect(heroes.length).toBeGreaterThan(0);
      done();
    });
  });

  it('Debería crear un héroe', (done) => {
    const heroToCreate = {
      name: 'New Hero',
      alterEgo: 'New Alter Ego',
      publisher: 'New Publisher',
      abilities: ['New Ability'],
      imageUrl: 'new-url.jpg'
    };

    service.createHero(heroToCreate).subscribe(hero => {
      expect(hero.id).toBeDefined();
      expect(hero.name).toBe(heroToCreate.name);
      expect(hero.alterEgo).toBe(heroToCreate.alterEgo);

      service.getHeroById(hero.id).subscribe(fetchedHero => {
        expect(fetchedHero).toBeDefined();
        expect(fetchedHero.name).toBe(heroToCreate.name);
        done();
      });
    });
  });

  it('Debería obtener un héroe por su ID.', (done) => {
    service.createHero({
      name: mockHero.name,
      alterEgo: mockHero.alterEgo,
      publisher: mockHero.publisher,
      abilities: mockHero.abilities,
      imageUrl: mockHero.imageUrl
    }).subscribe(createdHero => {
      service.getHeroById(createdHero.id).subscribe(hero => {
        expect(hero).toBeDefined();
        expect(hero.id).toBe(createdHero.id);
        expect(hero.name).toBe(mockHero.name);
        done();
      });
    });
  });

  it('Debería actualizar un héroe', (done) => {
    service.createHero({
      name: mockHero.name,
      alterEgo: mockHero.alterEgo,
      publisher: mockHero.publisher,
      abilities: mockHero.abilities,
      imageUrl: mockHero.imageUrl
    }).subscribe(createdHero => {
      const updatedName = 'Updated Hero Name';
      service.updateHero(createdHero.id, { name: updatedName }).subscribe(updatedHero => {
        expect(updatedHero.id).toBe(createdHero.id);
        expect(updatedHero.name).toBe(updatedName);

        service.getHeroById(createdHero.id).subscribe(fetchedHero => {
          expect(fetchedHero.name).toBe(updatedName);
          done();
        });
      });
    });
  });

  it('Debería eliminar un héroe.', (done) => {
    service.createHero({
      name: mockHero.name,
      alterEgo: mockHero.alterEgo,
      publisher: mockHero.publisher,
      abilities: mockHero.abilities,
      imageUrl: mockHero.imageUrl
    }).subscribe(createdHero => {
      service.deleteHero(createdHero.id).subscribe(result => {
        expect(result).toBe(true);

        service.getHeroById(createdHero.id).subscribe({
          next: () => {
            fail('El héroe no debería existir');
          },
          error: (error) => {
            expect(error).toBeDefined();
            done();
          }
        });
      });
    });
  });

});