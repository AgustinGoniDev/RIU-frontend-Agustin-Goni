import { TestBed } from '@angular/core/testing';
import { LocalStorageService } from './local-storage.service';
import { PLATFORM_ID } from '@angular/core';

describe('LocalStorageService', () => {
  let service: LocalStorageService;

  const configureBrowserTests = () => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: PLATFORM_ID, useValue: 'browser' }
      ]
    });
    service = TestBed.inject(LocalStorageService);

    spyOn(localStorage, 'getItem');
    spyOn(localStorage, 'setItem');
    spyOn(localStorage, 'removeItem');
    spyOn(localStorage, 'clear');
  };

  const configureServerTests = () => {
    TestBed.configureTestingModule({
      providers: [
        LocalStorageService,
        { provide: PLATFORM_ID, useValue: 'server' }
      ]
    });
    service = TestBed.inject(LocalStorageService);
  };

  describe('En entorno de navegador', () => {
    beforeEach(() => {
      configureBrowserTests();
    });

    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('debería guardar un valor en localStorage', () => {
      const testObject = { name: 'Superman', power: 'Flight' };
      service.setItem('hero', testObject);
      expect(localStorage.setItem).toHaveBeenCalledWith('hero', JSON.stringify(testObject));
    });

    it('debería obtener un valor de localStorage', () => {
      const testObject = { name: 'Batman', power: 'Intelligence' };
      const stringifiedObj = JSON.stringify(testObject);

      (localStorage.getItem as jasmine.Spy).and.returnValue(stringifiedObj);

      const result = service.getItem('hero');

      expect(localStorage.getItem).toHaveBeenCalledWith('hero');
      expect(result).toEqual(testObject);
    });

    it('debería devolver null cuando el elemento no existe en localStorage', () => {
      (localStorage.getItem as jasmine.Spy).and.returnValue(null);

      const result = service.getItem('nonExistentKey');

      expect(localStorage.getItem).toHaveBeenCalledWith('nonExistentKey');
      expect(result).toBeNull();
    });

    it('debería eliminar un elemento de localStorage', () => {
      service.removeItem('hero');
      expect(localStorage.removeItem).toHaveBeenCalledWith('hero');
    });

    it('debería limpiar todo el localStorage', () => {
      service.clear();
      expect(localStorage.clear).toHaveBeenCalled();
    });
  });

  describe('En entorno de servidor', () => {
    beforeEach(() => {
      configureServerTests();
    });

    it('debería crear el servicio', () => {
      expect(service).toBeTruthy();
    });

    it('no debería intentar guardar en localStorage', () => {
      expect(() => {
        service.setItem('hero', { name: 'Wonder Woman' });
      }).not.toThrow();
    });

    it('debería devolver null al intentar obtener un elemento', () => {
      const result = service.getItem('hero');
      expect(result).toBeNull();
    });

    it('no debería producir errores al intentar eliminar un elemento', () => {
      expect(() => {
        service.removeItem('hero');
      }).not.toThrow();
    });

    it('no debería producir errores al intentar limpiar localStorage', () => {
      expect(() => {
        service.clear();
      }).not.toThrow();
    });
  });
});