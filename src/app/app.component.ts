import { Component, inject, InjectionToken, ViewChild } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LoadingComponent } from './shared/components/loading/loading.component';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import { NgIf } from '@angular/common';

export const WINDOW = new InjectionToken<Window>('WindowToken', {
  factory: () => {
    if(typeof window !== 'undefined') {
      return window
    }
    return new Window();
  }
});

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, LoadingComponent, MatSidenavModule, MatIcon, MatSidenavModule, NgIf, ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  private window = inject(WINDOW);
  title = 'RIU Frontend - Agustin Goñi';

  @ViewChild('sidenav') sidenav!: MatSidenav;
  sidenavOpened = true;


  ngOnInit(): void {
    this.checkScreenSize();
    this.window.addEventListener('resize', this.checkScreenSize.bind(this));
  }

  checkScreenSize(): void {
    if (this.window.innerWidth < 768) {
      this.sidenavOpened = false;
    } else {
      this.sidenavOpened = true;
    }
  }

  toggleSidenav(): void {
    this.sidenavOpened = !this.sidenavOpened;
    console.log(this.sidenavOpened);

  }

  logout(): void {
    console.log('Logout clicked');
    // this.authService.logout();
    // this.router.navigate(['/login']);
  }
}
