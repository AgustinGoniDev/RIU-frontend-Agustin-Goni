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

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should store user on login', () => {
    service.login(mockUser.email);
    expect(localStorageServiceSpy.setItem).toHaveBeenCalledWith(userKey, JSON.stringify(mockUser));
  });

  it('should remove user on logout', () => {
    service.logout();
    expect(localStorageServiceSpy.removeItem).toHaveBeenCalledWith(userKey);
  });

  it('should return user if stored', () => {
    localStorageServiceSpy.getItem.and.returnValue(JSON.stringify(mockUser));
    const user = service.getUser();
    expect(user).toEqual(mockUser);
  });

  it('should return null if no user stored', () => {
    localStorageServiceSpy.getItem.and.returnValue(null);
    const user = service.getUser();
    expect(user).toBeNull();
  });

  it('should return true if user is logged in', () => {
    localStorageServiceSpy.getItem.and.returnValue(JSON.stringify(mockUser));
    expect(service.isLoggedIn()).toBeTrue();
  });

  it('should return false if user is not logged in', () => {
    localStorageServiceSpy.getItem.and.returnValue(null);
    expect(service.isLoggedIn()).toBeFalse();
  });
});
