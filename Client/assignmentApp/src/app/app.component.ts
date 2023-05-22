import { Component, HostListener, OnDestroy, Self, SkipSelf } from '@angular/core';
import { Subscription } from 'rxjs';
import { UserService } from './services/user.service';
import { Failure, Success } from './assignments';
import { LoginService } from './services/login.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [UserService]
})
export class AppComponent implements OnDestroy {
  title = 'assignmentApp';

  subscription!: Subscription;

  res!: Success | Failure;

  constructor(@Self() private userService: UserService,
    @SkipSelf() private loginService: LoginService,
    private router: Router) { }

  @HostListener('window:beforeunload', ['$event'])
  onBeforeUnload(event: BeforeUnloadEvent) {
    // Send request to backend

    if (this.loginService.isLoggedin) {
      this.subscription = this.userService.logout().subscribe(data => {
        this.res = data;
        this.loginService.isLoggedin = false;
        this.router.navigate(['home']);
      })
    }
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }
}
