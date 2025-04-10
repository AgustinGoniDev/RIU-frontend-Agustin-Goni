import { inject, Injectable } from '@angular/core';
import { LocalStorageService } from '../../shared/services/local-storage.service';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private localStorageSrv = inject(LocalStorageService);

  private readonly USER_KEY = 'user';

  login(email: string): void {
    const user = { email };
    this.localStorageSrv.setItem(this.USER_KEY, JSON.stringify(user));
  }

  logout(): void {
    this.localStorageSrv.removeItem(this.USER_KEY);
  }

  getUser(): { email: string } | null {
    const userJson = this.localStorageSrv.getItem(this.USER_KEY);
    return userJson ? JSON.parse(userJson as string) : null;
  }

  isLoggedIn(): boolean {
    return this.getUser() !== null;
  }
}
