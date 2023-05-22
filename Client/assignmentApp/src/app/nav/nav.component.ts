import { Component, OnDestroy, inject } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Observable, Subscription } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';
import { UserService } from '../services/user.service';
import { Router } from '@angular/router';
import { LoginService } from '../services/login.service';
import { DelUserComponent } from '../del-user/del-user.component';
import { MatDialog } from '@angular/material/dialog';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
  providers: [UserService]
})
export class NavComponent implements OnDestroy {
  private breakpointObserver = inject(BreakpointObserver);
  private userService = inject(UserService);
  private router = inject(Router);
  loginService = inject(LoginService);
  private dialog = inject(MatDialog);
  private snackService = inject(SnackService);

  subscription!: Subscription;

  res: Object = {};

  isHandset$: Observable<boolean> = this.breakpointObserver.observe(Breakpoints.Handset)
    .pipe(
      map(result => result.matches),
      shareReplay()
    );

  logout() {
    this.subscription = this.userService.logout().subscribe(data => {
      this.res = data;
      this.loginService.isLoggedin = false;
      this.router.navigate(['home']);
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      })
  }

  openDialog(enterAnimationDuration: string, exitAnimationDuration: string): void {
    this.dialog.open(DelUserComponent, {
      enterAnimationDuration,
      exitAnimationDuration,
    });
  }


  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
