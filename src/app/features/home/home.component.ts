import { Component, inject, ViewChild } from '@angular/core';
import { Router, RouterModule, RouterOutlet } from '@angular/router';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatButtonModule } from '@angular/material/button';
import {MatSidenav, MatSidenavModule} from '@angular/material/sidenav';
import { MatIcon } from '@angular/material/icon';
import {MatTooltipModule} from '@angular/material/tooltip';
import { AsyncPipe } from '@angular/common';
import { WINDOW } from '../../shared/utils/tokens.utils';
import { SharedService } from '../../shared/services/shared.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-home',
  imports: [
    RouterOutlet,
    MatToolbarModule,
    MatButtonModule,
    MatSidenavModule,
    MatIcon,
    MatSidenavModule,
    MatTooltipModule,
    AsyncPipe,
    RouterModule
  ],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
    private window = inject(WINDOW);
    private sharedSrv = inject(SharedService);
    private router = inject(Router);
    private authService = inject(AuthService);

    sectionTitle$ = this.sharedSrv.title$;
    userEmail = this.authService.getUser()?.email ?? '';

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
      this.authService.logout();
      this.router.navigate(['/login']);
    }
}
