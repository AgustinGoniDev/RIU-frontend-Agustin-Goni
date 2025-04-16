import { AsyncPipe } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatSidenav, MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { RouterModule, RouterOutlet } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { ConfirmDialogComponent } from '../../shared/components/confirm-dialog/confirm-dialog.component';
import { SharedService } from '../../shared/services/shared.service';
import { WINDOW } from '../../shared/utils/tokens.utils';
import { Subject, takeUntil } from 'rxjs';

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
    private authService = inject(AuthService);
    private dialog = inject(MatDialog);

    sectionTitle$ = this.sharedSrv.title$;
    private destroy$ = new Subject<void>();
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
        const dialogRef = this.dialog.open(ConfirmDialogComponent, {
          width: '350px',
          data: {
            title: 'Cerrar sesión',
            message: `¿Estás seguro que deseas cerrar sesión?`,
            confirmText: 'Cerrar',
            cancelText: 'Cancelar'
          }
        });

        dialogRef.afterClosed().pipe(
          takeUntil(this.destroy$)
        ).subscribe(result => {
          if (result) {
            this.authService.logout();
          }
        });
      }
}
