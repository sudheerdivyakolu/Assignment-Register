import { Component, OnInit, Self, SkipSelf } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';
import { LoginService } from '../services/login.service';
import { SnackService } from '../services/snack.service';

@Component({
  selector: 'app-del-user',
  templateUrl: './del-user.component.html',
  styleUrls: ['./del-user.component.css'],
  providers: [UserService]
})
export class DelUserComponent implements OnInit {

  constructor(private router: Router,
    @Self() private userService: UserService,
    @SkipSelf() private loginService: LoginService,
    private snackService: SnackService) { }

  disabled!: boolean;

  eradicate() {
    this.userService.delete().subscribe(data => {
      this.snackService.snack(data);
      this.loginService.isLoggedin = false;
      this.router.navigate(['/home']);
    },
      err => {
        this.snackService.snack({ message: err.error.message });
      });
  }

  ngOnInit(): void {
    if (this.loginService.isLoggedin) {
      this.disabled = false;
    }
    else {
      this.disabled = true;
    }
  }

  goback() {
    this.router.navigate(['/assignments']);
  }

}
