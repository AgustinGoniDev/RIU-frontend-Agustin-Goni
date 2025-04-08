import { Component, inject, InjectionToken, ViewChild } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import { LoadingComponent } from './shared/components/loading/loading.component';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { WINDOW } from './shared/utils/tokens.utils';
import { SharedService } from './shared/services/shared.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbarModule, MatButtonModule, LoadingComponent, MatSidenavModule, MatIcon, MatSidenavModule, MatTooltipModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})

export class AppComponent {
  title = 'RIU Frontend - Agustin Goñi';

  //INJECTS
  private window = inject(WINDOW);
  private router = inject(Router);
  private sharedSrv = inject(SharedService);

  sectionTitle$ = this.sharedSrv.title$;

  @ViewChild('sidenav') sidenav!: MatSidenav;
  sidenavOpened = true;

  constructor() {

  }

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

  navigateTo(route: string): void {
    this.router.navigate([route]);
  }

  logout(): void {
    console.log('Logout clicked');
    // this.authService.logout();
    // this.router.navigate(['/login']);
  }
}
