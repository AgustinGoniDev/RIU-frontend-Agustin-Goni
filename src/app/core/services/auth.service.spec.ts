import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { LocalStorageService } from '../../shared/services/local-storage.service';

describe('AuthService', () => {
  let service: AuthService;
  let localStorageServiceSpy: jasmine.SpyObj<LocalStorageService>;

  const mockUser = { email: 'test@example.com' };
  const userKey = 'user';

  beforeEach(() => {
    const spy = jasmine.createSpyObj('LocalStorageService', ['setItem', 'getItem', 'removeItem']);

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: LocalStorageService, useValue: spy }
      ]
    });

    service = TestBed.inject(AuthService);
    localStorageServiceSpy = TestBed.inject(LocalStorageService) as jasmine.SpyObj<LocalStorageService>;
  });

  it('Deberia ser creado', () => {
    expect(service).toBeTruthy();
  });

  it('Debería guardar al usuario al iniciar sesión', () => {
    service.login(mockUser.email);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith(userKey, JSON.stringify(mockUser));
  });

  it('Debería eliminar al usuario al cerrar sesión', () => {
    service.logout();
    expect(localStorageServiceSpy.removeItem).toHaveBeenCalledWith(userKey);
  });

  it('Debería devolver al usuario si está guardado', () => {
    localStorageServiceSpy.getItem.and.returnValue(JSON.stringify(mockUser));
    const user = service.getUser();
    expect(user).toEqual(mockUser);
  });

  it('Debería devolver null si no hay usuario guardado', () => {
    localStorageServiceSpy.getItem.and.returnValue(null);
    const user = service.getUser();
    expect(user).toBeNull();
  });

  it('Debería devolver true si el usuario está logueado.', () => {
    localStorageServiceSpy.getItem.and.returnValue(JSON.stringify(mockUser));
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('Debería devolver false si el usuario no está logueado', () => {
    localStorageServiceSpy.getItem.and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });
});
